export const updateAuthors = (ids, state) => {
  const newAuthors = state.authors
  for (let id of ids) {
    if (!newAuthors[id]) {
      // make a placeholder so that when new authors come
      // in from core, it can replace the placeholder with content
      newAuthors[id] = {}
    }
  }
  return newAuthors
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
