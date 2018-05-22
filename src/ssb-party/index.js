/* copy of ssb-party with some minor electron tweaks */

var createConfig = require('ssb-config/inject')
var ssbKeys = require('ssb-keys')
var path = require('path')
var fs = require('fs')
var MultiServer = require('multiserver')
var msShs = require('multiserver/plugins/shs')
var msNet = require('multiserver/plugins/net')
var muxrpc = require('muxrpc')
var pull = require('pull-stream')
var ssbHash = require('pull-hash/ext/ssb')
var multicb = require('multicb')

function toSodiumKeys (keys) {
  if (!keys || !keys.public) return null
  return {
    publicKey: Buffer.from(keys.public.replace('.ed25519', ''), 'base64'),
    secretKey: Buffer.from(keys.private.replace('.ed25519', ''), 'base64')
  }
}

function fixAddBlob (add) {
  return function (hash, cb) {
    if (typeof hash === 'function') {
      cb = hash
      hash = null
    }
    var done = multicb({ pluck: 1, spread: true })
    var sink = pull(
      ssbHash(done()),
      add(hash, done())
    )
    done(cb)
    return sink
  }
}

function fork (before, after) {
  return function () {
    before.apply(this, arguments)
    after.apply(this, arguments)
  }
}

module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = null
  }
  opts = opts || {}
  var config = createConfig(process.env.ssb_appname, opts)
  var appKey = config.appKey ||
    (config.caps && config.caps.shs && Buffer.from(config.caps.shs, 'base64'))
  if (!appKey) return cb(new Error('missing secret-handshake capability key'))
  var keys = config.keys || (config.keys =
    ssbKeys.loadOrCreateSync(path.join(config.path, 'secret')))
  config.manifestFile = path.join(config.path, 'manifest.json')

  var shs = msShs({
    keys: toSodiumKeys(keys),
    appKey: appKey,
    auth: function (cb) { cb(null, false) },
    timeout: (config.timers && config.timers.handshake) || 5e3
  })

  var ms = MultiServer([
    [msNet({}), shs]
  ])

  var keyPublic = keys.public.replace('.ed25519', '')
  var host = config.host || 'localhost'
  var remote = 'net:' + host + ':' + config.port + '~shs:' + keyPublic

  ;(function tryConnect (remote) {
    ms.client(remote, function (err, stream) {
      if (err && err.code === 'ECONNREFUSED') {
        return spawnSbot(config, function (err, remote) {
          if (err) {
            return cb(new Error(
              'unable to connect to or start sbot: ' + err.stack))
          }
          tryConnect(remote)
        })
      }
      if (err) return cb(new Error('unable to connect to sbot: ' + err.stack))

      var manifest = config.manifest ||
        JSON.parse(fs.readFileSync(config.manifestFile))
      var sbot = muxrpc(manifest, false)()
      sbot.id = '@' + stream.remote.toString('base64') + '.ed25519'
      if (sbot.blobs && sbot.blobs.add) sbot.blobs.add = fixAddBlob(sbot.blobs.add)
      pull(stream, sbot.createStream(), stream)
      delete config.keys
      var keepalive = setInterval(sbot.whoami, 1e3)
      sbot.close = fork(sbot.close, function () {
        clearInterval(keepalive)
      })
      cb(null, sbot, config)
    })
  }(remote))
}

function spawnSbot (config, cb) {
  function cbOnce (err, addr) {
    if (!cb) return
    cb(err, addr)
    cb = null
  }
  var proc = require('child_process')
  var scriptPath = path.join(__dirname, 'server.js')
  var child = proc.fork(scriptPath, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore', 'ipc']
  })
  child.send(config)
  child.once('message', function (msg) {
    var manifestJSON = JSON.stringify(msg.manifest, null, 2)
    fs.writeFile(config.manifestFile, manifestJSON, function (err) {
      if (err) console.error('warning: unable to write manifest: ' + err.stack)
      child.unref()
      cbOnce(null, msg.address)
    })
  })
  child.once('error', function (err) {
    cbOnce(new Error('child sbot error: ' + err.stack))
  })
}
