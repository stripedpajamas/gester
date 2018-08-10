const electron = require('electron')

const core = electron.remote.getGlobal('core')

const { constants } = core

export default {
  messages: [],
  authors: {},
  following: [],
  followingMe: [],
  blocked: [],
  recipients: [],
  unreads: [],
  myNames: [],
  recents: [],
  me: '',
  mode: constants.MODE.PUBLIC,
  joiningPub: false,
  currentAuthorId: '',
  authorDrawerOpen: false
}
