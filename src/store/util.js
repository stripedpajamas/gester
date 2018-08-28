import electron from 'electron'
import core from 'ssb-chat-core'

const getMain = electron.remote.getGlobal('getMain')

export const updateAuthors = (ids) => {
  for (let id of ids) {
    core.authors.getName(id)
  }
}

export const getRecentAuthors = (recents) => {
  // the array of recents ids need names if core has them
  const recentsIds = new Set()
  recents.forEach(r => { r.forEach(id => { recentsIds.add(id) }) })

  return updateAuthors(recentsIds)
}

export const getUnreadAuthors = (unreads) => {
  // the array of unreads ids need names if core has them
  const unreadsIds = new Set()
  unreads.forEach(u => { u.forEach(id => { unreadsIds.add(id) }) })

  return updateAuthors(unreadsIds)
}

export const getMessageAuthors = (messages) => {
  const authorsIds = new Set()
  messages.forEach(m => { authorsIds.add(m.author) })
  return updateAuthors(authorsIds)
}

export const getAuthorId = (name) => core.authors.getId(name)

export const isFocused = () => getMain().isFocused()

export const compareArrays = (a, b) => {
  if (a.length !== b.length) return false
  for (let i = a.length - 1; i > 0; i--) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
