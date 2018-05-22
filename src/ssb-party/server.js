console.log('this is running')
process.once('message', function (config) {
  console.log('got the message')
  var createSbot = require('scuttlebot')
    .use(require('scuttlebot/plugins/master'))
    .use(require('./control'))
    .use(require('./autoclose'))

  if (!config.skipPlugins) {
    var plugins = require('scuttlebot/plugins/plugins')
    createSbot = createSbot
      .use(plugins)
      .use(require('scuttlebot/plugins/gossip'))
      .use(require('scuttlebot/plugins/replicate'))
      .use(require('ssb-friends'))
      .use(require('ssb-blobs'))
      .use(require('scuttlebot/plugins/invite'))
      .use(require('scuttlebot/plugins/local'))
      .use(require('scuttlebot/plugins/logging'))
      .use(require('ssb-private'))
      .use(require('ssb-links'))
      .use(require('ssb-query'))
      .use(require('ssb-ws'))
    plugins.loadUserPlugins(createSbot, config)
  }

  var server = createSbot(config)

  process.send({
    manifest: server.getManifest(),
    address: server.getAddress()
  })
  process.disconnect()
})
