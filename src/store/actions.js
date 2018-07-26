import electron from 'electron'
import * as Types from './actionTypes'

const core = electron.remote.getGlobal('core')
window.core = core

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

export const updateMessages = () => {
  // get latest messages from core
  const messages = core.messages.get().toJS()
    .map((msg) => ({
      ...msg,
      authorName: msg.authorName() // so that we can react
    }))
  return {
    type: Types.SET_MESSAGES,
    messages
  }
}

export const setPrivate = () => {
  return {
    type: Types.SET_PRIVATE
  }
}

export const setPublic = () => {
  return {
    type: Types.SET_PUBLIC
  }
}
