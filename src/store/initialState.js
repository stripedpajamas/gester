import core from 'ssb-chat-core'

const { constants } = core

export default {
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
  progress: { current: 0, target: 100 }
}
