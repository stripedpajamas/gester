const client = require('../helpers/client')

module.exports = (inviteCode) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    if (sbot && inviteCode) {
      sbot.invite.accept(inviteCode, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
