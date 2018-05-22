import * as Modules from '../modules'
import * as Constants from './constants'

class Processor {
  constructor (webContents) {
    this.webContents = webContents
    this.send = this.send.bind(this)
    this.processMsg = this.processMsg.bind(this)
  }
  send (channel, ...args) {
    this.webContents.send(channel, ...args)
  }
  processMe (msg) {
    this.send(Constants.SBOT_ME_IPC, msg)
  }
  processMsg (msg) {
    if (msg && msg.value && typeof msg.value.content === 'string') {
      // this is a private message, so we should unbox it and then send it through again
      Modules.unbox(msg.value.content)
        .then((content) => {
          const decryptedMsg = msg
          decryptedMsg.value.content = content
          decryptedMsg.value.private = true // so we can alter the ui
          return this.processMsg(decryptedMsg)
        })
        .catch(() => { }) // ignore failure to decrypt private messages
      return
    }
    this.send(Constants.GENERIC_SBOT_IPC, msg)
  }
}

export default Processor
