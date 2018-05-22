exports.name = 'autoclose'
exports.version = '0.0.0'
exports.init = function (sbot, config) {
  // shut down when no connections for a while
  var timer
  var keepalive = (config.timers && config.timers.keepalive) || 30e3
  var connections = 0
  sbot.on('rpc:connect', function (rpc) {
    clearTimeout(timer)
    connections++
    rpc.on('closed', function () {
      if (!--connections) timer = setTimeout(autoclose, keepalive)
    })
  })

  function autoclose () {
    // this is grepped for in tests
    console.log('sbot auto closing')
    sbot.close(function (err) {
      if (err) throw err
      process.exit(0)
    })
  }
}
