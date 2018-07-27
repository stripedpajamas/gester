const electron = require('electron')

const core = electron.remote.getGlobal('core')

const { constants } = core

export default {
  messages: [],
  authors: {},
  recipients: [],
  unreads: [],
  myNames: [],
  recents: [],
  mode: constants.MODE.PUBLIC
}
