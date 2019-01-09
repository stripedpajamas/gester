import core from 'ssb-chat-core'
import configStorage from './storage'

const storedConfig = configStorage.getConfigSync()

const { constants } = core

export default Object.assign({
  messages: [],
  authors: {},
  following: [],
  blocked: [],
  recipients: [],
  unreads: [],
  myNames: [],
  recents: [],
  me: '',
  mode: constants.MODE.PUBLIC,
  joiningPub: false,
  currentAuthorId: '',
  authorDrawerOpen: false,
  loading: true,
  darkTheme: false,
  progress: { current: 0, target: 100 }
}, storedConfig)
