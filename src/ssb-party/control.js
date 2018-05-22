exports.name = 'control'
exports.version = '0.0.0'
exports.permissions = {
  master: {allow: ['close']}
}
exports.manifest = {
  stop: 'async'
}
exports.init = function (sbot, config) {
  return {
    stop: function (cb) {
      sbot.close(function (err) {
        if (err) return cb(err)
        cb()
        // TODO: make this not necessary
        process.exit(0)
      })
    }
  }
}
