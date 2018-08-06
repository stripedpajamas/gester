import electron, { ipcRenderer } from 'electron'
import debounce from 'lodash.debounce'
import * as Types from './actionTypes'

const core = electron.remote.getGlobal('core')
window.core = core

export const setupCore = () => (dispatch) => {
  // keep a copy of messages in redux and keep them up to date
  core.events.on('messages-changed', (messages) => {
    dispatch({
      type: Types.SET_MESSAGES,
      messages: messages.toJS()
    })
  })

  // keep a copy of relevant authors in redux and keep them up to date
  core.events.on('authors-changed', (authors) => {
    dispatch({
      type: Types.SET_AUTHORS,
      authors: authors.toJS()
    })
  })

  // keep a copy of people i follow in redux and keep them up to date
  // debounce it because following can update a lot initially
  const debouncedFollowingUpdate = debounce((following) => {
    dispatch({
      type: Types.SET_FOLLOWING,
      following: following.toJS()
    })
  }, 3000)
  core.events.on('following-changed', debouncedFollowingUpdate)

  // keep a copy of people following me in redux and keep them up to date
  const debouncedFollowingMeUpdate = debounce((followingMe) => {
    dispatch({
      type: Types.SET_FOLLOWING_ME,
      followingMe: followingMe.toJS()
    })
  }, 3000)
  core.events.on('following-me-changed', debouncedFollowingMeUpdate)

  // keep a copy of people i blocked in redux and keep them up to date
  const debouncedBlockedUpdate = debounce((blocked) => {
    dispatch({
      type: Types.SET_BLOCKED,
      blocked: blocked.toJS()
    })
  }, 3000)
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
        .map((recent) => recent.filter(id => {
          if (recent.length > 1) {
            // if there's more than me, i don't want me
            return id !== core.me.get()
          }
          // if it's just me, i want just me
          return true
        }))
    })
  })

  // keep a record of unread private chats in redux and keep them up to date
  core.events.on('unreads-changed', (unreads) => {
    const unreadsJS = unreads.toJS()
    if (unreadsJS.length) {
      // send to app to update badge
      ipcRenderer.send('unread')
    } else {
      // send to app to remove badge
      ipcRenderer.send('no-unread')
    }
    dispatch({
      type: Types.SET_UNREADS,
      unreads: unreadsJS
    })
  })

  // keep a record of who is the current private recipients in redux
  core.events.on('recipients-changed', (recipients) => {
    dispatch({
      type: Types.SET_RECIPIENTS,
      recipients: recipients.toJS()
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
      myNames: myNames.toJS()
    })
  })

  // set to public mode initially in case this is a refresh
  core.mode.setPublic()
  // get messages, me, authors, unreads, and recents into redux immediately
  dispatch({
    type: Types.SET_MESSAGES,
    messages: core.messages.get().toJS()
  })
  dispatch({
    type: Types.SET_AUTHORS,
    authors: core.authors.get().toJS()
  })
  dispatch({
    type: Types.SET_MY_NAMES,
    myNames: core.me.names().toJS()
  })
  dispatch({
    type: Types.SET_FOLLOWING,
    following: core.authors.getFollowing().toJS()
  })
  dispatch({
    type: Types.SET_FOLLOWING_ME,
    followingMe: core.authors.getFollowingMe().toJS()
  })
  dispatch({
    type: Types.SET_BLOCKED,
    blocked: core.authors.getBlocked().toJS()
  })

  // initial unreads
  const unreads = core.unreads.get().toJS()
  if (unreads.length) {
    // send to app to update badge
    ipcRenderer.send('unread')
  } else {
    // send to app to remove badge
    ipcRenderer.send('no-unread')
  }

  dispatch({
    type: Types.SET_UNREADS,
    unreads: core.unreads.get().toJS()
  })
  dispatch({
    type: Types.SET_RECENTS,
    recents: core.recents.get()
      .map((recent) => recent.filter(id => {
        if (recent.length > 1) {
          // if there's more than me, i don't want me
          return id !== core.me.get()
        }
        // if it's just me, i want just me
        return true
      }))
  })
  dispatch({
    type: Types.SET_ME,
    me: core.me.get()
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
  core.commands.quit()
    .catch((e) => dispatch(setError(e)))
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
// #endregion
