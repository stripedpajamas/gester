import electron, { ipcRenderer } from 'electron'
import debounce from 'lodash.debounce'
import * as Types from './actionTypes'
import * as Util from './util'

const core = electron.remote.getGlobal('core')
window.core = core

export const setupCore = () => (dispatch, getState) => {
  // keep a copy of messages in redux and keep them up to date
  core.events.on('messages-changed', (messages) => {
    dispatch({
      type: Types.SET_MESSAGES,
      messages
    })
    // need to get all authors of messages and make placeholders
    const { somethingNew, authors } = Util.getMessageAuthors(messages, getState())
    if (somethingNew) {
      dispatch({
        type: Types.SET_AUTHORS,
        authors
      })
    }
  })

  // keep a copy of relevant authors in redux and keep them up to date
  const debouncedAuthorsUpdate = debounce((authors) => {
    const state = getState()
    const oldAuthors = state.authors // { @k9...: { name: '@squicc', setter: 'k9...' } }
    const newAuthors = {}
    Object.keys(oldAuthors).forEach((id) => {
      newAuthors[id] = authors[id] || {}
    })
    dispatch({
      type: Types.SET_AUTHORS,
      authors: newAuthors
    })
  }, 1000)
  core.events.on('authors-changed', debouncedAuthorsUpdate)

  // keep a copy of people i follow in redux and keep them up to date
  // debounce it because following can update a lot initially
  const debouncedFollowingUpdate = debounce((following) => {
    dispatch({
      type: Types.SET_FOLLOWING,
      following
    })
  }, 1000)
  core.events.on('following-changed', debouncedFollowingUpdate)

  // keep a copy of people following me in redux and keep them up to date
  const debouncedFollowingMeUpdate = debounce((followingMe) => {
    dispatch({
      type: Types.SET_FOLLOWING_ME,
      followingMe
    })
  }, 1000)
  core.events.on('following-me-changed', debouncedFollowingMeUpdate)

  // keep a copy of people i blocked in redux and keep them up to date
  const debouncedBlockedUpdate = debounce((blocked) => {
    dispatch({
      type: Types.SET_BLOCKED,
      blocked
    })
  }, 1000)
  core.events.on('blocked-changed', debouncedBlockedUpdate)

  // keep a record of what mode we are in in redux and keep it up to date
  core.events.on('mode-changed', (mode) => {
    dispatch({
      type: Types.SET_MODE,
      mode
    })
  })

  // keep a record of recent private chats in redux and keep it up to date
  core.events.on('recents-changed', (recents) => {
    dispatch({
      type: Types.SET_RECENTS,
      recents: recents
        .map((recent) => ({
          filtered: recent.filter(id => {
            if (recent.length > 1) {
              // if there's more than me, i don't want me
              return id !== core.me.get()
            }
            // if it's just me, i want just me
            return true
          }),
          raw: recent
        }))
    })

    // make placeholders in state for any authors we don't know about
    const { somethingNew, authors } = Util.getRecentAuthors(recents, getState())
    if (somethingNew) {
      dispatch({
        type: Types.SET_AUTHORS,
        authors
      })
    }
  })

  // keep a record of unread private chats in redux and keep them up to date
  core.events.on('unreads-changed', (unreads) => {
    if (unreads.length) {
      // send to app to update badge
      ipcRenderer.send('unread')
    } else {
      // send to app to remove badge
      ipcRenderer.send('no-unread')
    }
    dispatch({
      type: Types.SET_UNREADS,
      unreads
    })

    // make placeholders in state for any authors we don't know about
    const { somethingNew, authors } = Util.getUnreadAuthors(unreads, getState())

    if (somethingNew) {
      dispatch({
        type: Types.SET_AUTHORS,
        authors
      })
    }
  })

  // keep a record of who is the current private recipients in redux
  core.events.on('recipients-changed', (recipients) => {
    dispatch({
      type: Types.SET_RECIPIENTS,
      recipients: recipients
        .filter((r, _, a) => {
          if (a.length > 1) {
            return r !== core.me.get()
          }
          return true
        })
    })
  })

  // keep a record of who is the current private recipients in redux
  core.events.on('my-names-changed', (myNames) => {
    dispatch({
      type: Types.SET_MY_NAMES,
      myNames
    })
  })

  // set to public mode initially in case this is a refresh
  core.mode.setPublic()
  // get messages, me, authors, unreads, and recents into redux immediately
  const messages = core.messages.getJS()
  dispatch({
    type: Types.SET_MESSAGES,
    messages
  })
  let { authors } = Util.getMessageAuthors(messages, getState())
  dispatch({
    type: Types.SET_MY_NAMES,
    myNames: core.me.namesJS()
  })
  dispatch({
    type: Types.SET_FOLLOWING,
    following: core.authors.getFollowingJS()
  })
  dispatch({
    type: Types.SET_FOLLOWING_ME,
    followingMe: core.authors.getFollowingMeJS()
  })
  dispatch({
    type: Types.SET_BLOCKED,
    blocked: core.authors.getBlockedJS()
  })

  // initial unreads
  const unreads = core.unreads.getJS()
  if (unreads.length) {
    if (Util.isReallyUnread(unreads)) {
      // send to app to update badge
      ipcRenderer.send('unread')
    } else {
      // we are in private mode with people
      // that core considers 'unread', so tell core we saw the msg
      // but only if the window is focused
      if (Util.isFocused()) {
        core.unreads.setAsRead(getState().recipients)
      }
    }
  } else {
    // send to app to remove badge
    ipcRenderer.send('no-unread')
  }

  // when the app gains focus, mark whatever our view is as read
  ipcRenderer.on('main-focused', () => {
    core.unreads.setAsRead(getState().recipients)
  })

  dispatch({
    type: Types.SET_UNREADS,
    unreads
  })
  // add initial unread authors to initial message authors
  const { authors: unreadAuthors } = Util.getUnreadAuthors(unreads, getState())
  Object.assign(authors, unreadAuthors)

  const recents = core.recents.get()
  dispatch({
    type: Types.SET_RECENTS,
    recents: recents
      .map((recent) => ({
        filtered: recent.filter(id => {
          if (recent.length > 1) {
            // if there's more than me, i don't want me
            return id !== core.me.get()
          }
          // if it's just me, i want just me
          return true
        }),
        raw: recent
      }))
  })
  // add initial recent authors to initial message + unreads authors
  const { authors: recentAuthors } = Util.getRecentAuthors(recents, getState())
  Object.assign(authors, recentAuthors)

  dispatch({
    type: Types.SET_ME,
    me: core.me.get()
  })

  // try to determine initial authors
  const coreAuthors = core.authors.getJS()
  Object.keys(authors).forEach((id) => {
    authors[id] = coreAuthors[id] || {}
  })
  dispatch({
    type: Types.SET_AUTHORS,
    authors
  })
}

// #region Strictly UI
export const setNotification = (n) => {
  return {
    type: Types.SET_NOTIFICATION,
    notification: n
  }
}
export const setError = (e) => {
  return {
    type: Types.SET_ERROR,
    error: e
  }
}
export const clearNotification = () => {
  return {
    type: Types.CLEAR_NOTIFICATION
  }
}
export const setJoinPub = (join) => {
  return {
    type: Types.SET_JOIN_PUB,
    joiningPub: join
  }
}
export const openAuthorDrawer = (id) => {
  return {
    type: Types.OPEN_AUTHOR_DRAWER,
    currentAuthorId: id
  }
}
export const closeAuthorDrawer = () => {
  return {
    type: Types.CLOSE_AUTHOR_DRAWER
  }
}
// #endregion

// #region Interacting with the core
export const goPrivate = recipients => (dispatch) => {
  core.commands.private(recipients)
    .catch((e) => dispatch(setError(e)))
}
export const goPublic = () => (dispatch) => {
  dispatch({
    type: Types.SET_MESSAGES,
    messages: [{ loading: true }]
  })
  dispatch({
    type: Types.SET_MODE,
    mode: 'PUBLIC'
  })
  dispatch({
    type: Types.SET_RECIPIENTS,
    recipients: []
  })
  core.commands.quit()
    .catch((e) => dispatch(setError(e)))
}
export const toggleMode = () => (dispatch, getState) => {
  const state = getState()
  if (state.mode === core.constants.MODE.PUBLIC) {
    const recps = core.recipients.getLast()
    if (recps) {
      dispatch(goPrivate(recps.toJS()))
    }
  } else {
    dispatch(goPublic())
  }
}
export const joinPub = (invite) => (dispatch) => {
  core.commands.pub(invite)
    .then(({ result }) => dispatch(setNotification(result)))
    .catch((e) => dispatch(setError(e)))
}
export const sendMessage = (msg) => (dispatch) => {
  core.messenger.sendMessage(msg)
    .catch((e) => dispatch(setError(e)))
}
export const follow = (id) => (dispatch) => {
  core.commands.follow(id)
    .then(({ result }) => dispatch(setNotification(result)))
    .catch((e) => dispatch(setError(e)))
}
export const block = (id) => (dispatch) => {
  core.commands.block(id)
    .then(({ result }) => dispatch(setNotification(result)))
    .catch((e) => dispatch(setError(e)))
}
export const unfollow = (id) => (dispatch) => {
  core.commands.unfollow(id)
    .then(({ result }) => dispatch(setNotification(result)))
    .catch((e) => dispatch(setError(e)))
}
export const unblock = (id) => (dispatch) => {
  core.commands.unblock(id)
    .then(({ result }) => dispatch(setNotification(result)))
    .catch((e) => dispatch(setError(e)))
}
export const removeRecent = (recents) => {
  core.recents.remove(recents)
}
// #endregion
