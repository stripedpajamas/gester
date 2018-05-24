import * as Modules from '../modules'
import * as Constants from './constants'

class Processor {
  constructor (webContents) {
    this.webContents = webContents
    this.send = this.send.bind(this)
    this.processMe = this.processMe.bind(this)
    this.processMsg = this.processMsg.bind(this)
    this.processSbotCommand = this.processSbotCommand.bind(this)
    this.handleSystemMessage = this.handleSystemMessage.bind(this)
    this.handleErrorMessage = this.handleErrorMessage.bind(this)
  }
  send (channel, ...args) {
    this.webContents.send(channel, ...args)
  }
  handleSystemMessage (msg) {
    this.send(Constants.SYSTEM_MESSAGE, msg)
  }
  handleErrorMessage (msg) {
    this.send(Constants.ERROR_MESSAGE, msg)
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
  processSbotCommand (data) {
    switch (data.command) {
      case Constants.SEND_PUBLIC: {
        Modules.post(data.text)
          .catch(() => this.handleErrorMessage(Constants.PUBLIC_SEND_FAILURE))
        break
      }
      case Constants.WHOAMI: {
        Modules.whoami()
          .then((id) => this.handleSystemMessage(id))
          .catch(() => this.handleErrorMessage(Constants.WHOAMI_FAILURE))
        break
      }
      default:
        break
    }
  }
}

export default Processor
