import electron from 'electron'
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
          human: recent
            .filter(id => id !== core.me.get())
            .map(core.authors.getName)
            .join(', '),
          ids: recent
            .filter(id => id !== core.me.get())
        }))
        .sort((a, b) => a.human > b.human)
    })
  })

  // keep a record of unread private chats in redux and keep them up to date
  core.events.on('unreads-changed', (unreads) => {
    dispatch({
      type: Types.SET_UNREADS,
      unreads: unreads.toJS()
    })
  })

  // keep a record of who is the current private recipients in redux
  core.events.on('recipients-changed', (recipients) => {
    dispatch({
      type: Types.SET_RECIPIENTS,
      recipients: recipients.toJS()
        .filter(r => r !== core.me.get())
        .map(core.authors.getName)
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
    type: Types.SET_UNREADS,
    unreads: core.unreads.get().toJS()
  })
  dispatch({
    type: Types.SET_RECENTS,
    recents: core.recents.get()
      .map((recent) => ({
        human: recent
          .filter(id => id !== core.me.get())
          .map(core.authors.getName)
          .join(', '),
        ids: recent
          .filter(id => id !== core.me.get())
      }))
      .sort((a, b) => a.human > b.human)
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
// #endregion
