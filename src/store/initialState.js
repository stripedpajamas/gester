import electron from 'electron'

const core = electron.remote.getGlobal('core')

export default {
  messages: core.messages.get().toJS(),
  authors: core.authors.get().toJS()
}
