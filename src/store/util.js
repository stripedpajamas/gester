import electron from 'electron'

const core = electron.remote.getGlobal('core')
const getMain = electron.remote.getGlobal('getMain')

export const updateAuthors = (ids, state) => {
  const newAuthors = Object.assign({}, state.authors)
  const coreAuthors = core.authors.getJS()
  let somethingNew = false
  for (let id of ids) {
    if (!newAuthors[id]) {
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

export const isReallyUnread = (unreads) => {
  // we want to show a red dot if we are not currently talking
  // to this 'unread' recipient list
  return !core.mode.isPrivate() || unreads.some((unread) => {
    // see if we're currently in private mode with these humyns
    const currentRecipients = core.recipients.get()
      .filter(r => r !== core.me.get())
    const talkingToThem = core.recipients.compare(currentRecipients, unread)

    // if we aren't talking to them, there's something unread
    return !talkingToThem
  })
}

export const isFocused = () => getMain().isFocused()
