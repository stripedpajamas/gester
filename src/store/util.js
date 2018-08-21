import electron from 'electron'

const core = electron.remote.getGlobal('core')
const getMain = electron.remote.getGlobal('getMain')

export const updateAuthors = (ids, state) => {
  const newAuthors = Object.assign({}, state.authors)
  const coreAuthors = core.authors.getJS()
  let somethingNew = false
  for (let id of ids) {
    if (!newAuthors[id] || !Object.keys(newAuthors[id]).length) {
      somethingNew = true
      // try to get the author directly from core, otherwise
      // make a placeholder so that when new authors come
      // in from core, it can replace the placeholder with content
      newAuthors[id] = coreAuthors[id] || {}
    }
  }
  return { somethingNew, authors: newAuthors }
}

export const getRecentAuthors = (recents, state) => {
  // the array of recents ids need names if core has them
  const recentsIds = new Set()
  recents.forEach(r => { r.forEach(id => { recentsIds.add(id) }) })

  return updateAuthors(recentsIds, state)
}

export const getUnreadAuthors = (unreads, state) => {
  // the array of unreads ids need names if core has them
  const unreadsIds = new Set()
  unreads.forEach(u => { u.forEach(id => { unreadsIds.add(id) }) })

  return updateAuthors(unreadsIds, state)
}

export const getMessageAuthors = (messages, state) => {
  const authorsIds = new Set()
  messages.forEach(m => { authorsIds.add(m.author) })
  return updateAuthors(authorsIds, state)
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
