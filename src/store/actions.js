import { ipcRenderer } from 'electron'
import debounce from 'lodash.debounce'
import core from 'ssb-chat-core'
import * as Types from './actionTypes'
import * as Util from './util'

window.core = core
let notification // eslint-disable-line

export const setupCore = () => (dispatch, getState) => {
  // start up core
  core.start({ timeWindow: 1209600000 }, (err) => {
    if (err) {
      console.log(err)
      return
    }
    window.onbeforeunload = () => { core.stop() }
    // set to public mode initially
    core.mode.setPublic()
    // get messages, me, authors, unreads, and recents into redux immediately
    const messages = core.messages.getJS()
    dispatch({
      type: Types.SET_MESSAGES,
      messages
    })
    Util.getMessageAuthors(messages)
    dispatch({
      type: Types.SET_MY_NAMES,
      myNames: core.me.namesJS().map(n => `@${n}`)
    })
    // initial unreads
    const unreads = core.unreads.getJS()
    if (unreads.length) {
      ipcRenderer.send('unread', true)
    }
    dispatch({
      type: Types.SET_UNREADS,
      unreads
    })
    // add initial unread authors to initial message authors
    Util.getUnreadAuthors(unreads)

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
    Util.getRecentAuthors(recents)

    dispatch({
      type: Types.SET_ME,
      me: core.me.get()
    })

    // try to determine initial authors
    dispatch({
      type: Types.SET_AUTHORS,
      authors: core.authors.getJS()
    })

    // initial friends/blocking
    const friends = core.authors.getFriendsJS()
    dispatch({
      type: Types.SET_FOLLOWING,
      following: friends.following || []
    })
    dispatch({
      type: Types.SET_BLOCKED,
      blocked: friends.blocking || []
    })
  })

  // keep a copy of messages in redux and keep them up to date
  const debouncedMessagesUpdate = debounce((messages) => {
    dispatch({
      type: Types.SET_MESSAGES,
      messages
    })
    // need to get all authors of messages and make placeholders
    Util.getMessageAuthors(messages)
  }, 200, { leading: true })
  core.events.on('messages-changed', debouncedMessagesUpdate)

  // keep a copy of relevant authors in redux and keep them up to date
  const debouncedAuthorsUpdate = debounce((authors) => {
    dispatch({
      type: Types.SET_AUTHORS,
      authors
    })
  }, 300, { leading: true })
  core.events.on('authors-changed', debouncedAuthorsUpdate)

  core.events.on('friends-changed', (friends) => {
    dispatch({
      type: Types.SET_FOLLOWING,
      following: friends.following
    })
    dispatch({
      type: Types.SET_BLOCKED,
      blocked: friends.blocking
    })
  })

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
    Util.getRecentAuthors(recents)
  })

  // keep a record of unread private chats in redux and keep them up to date
  core.events.on('unreads-changed', (unreads) => {
    dispatch({
      type: Types.SET_UNREADS,
      unreads
    })
    if (unreads.length) {
      // there are unreads...
      // if we aren't focused, set the badge and pop a note
      if (!Util.isFocused()) {
        ipcRenderer.send('unread', true)
        notification = new window.Notification('Gester', {
          body: 'New unread message'
        })
      } else {
        // get the current private recps
        const recps = core.recipients.getJS()
        let shouldShowBadge = false
        unreads.forEach((unread) => {
          if (Util.compareArrays(unread, recps)) {
            // window is focused and we are talking to these recps
            core.unreads.setAsRead(core.recipients.get())
          } else {
            shouldShowBadge = true
          }
        })
        ipcRenderer.send('unread', shouldShowBadge)
      }
    } else {
      ipcRenderer.send('unread', false)
    }

    // make placeholders in state for any authors we don't know about
    Util.getUnreadAuthors(unreads)
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
      myNames: myNames.map(n => `@${n}`)
    })
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
  // TODO ask core if i am following + blocking this id
  // if the id is not me
  return {
    type: Types.OPEN_AUTHOR_DRAWER,
    currentAuthorId: id
  }
}
export const closeAuthorDrawer = () => {
  // TODO clear state on following/blocking
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
export const removeRecent = (recents) => (dispatch) => {
  core.recents.remove(recents)
}
// #endregion
