import electron from 'electron'
import * as Types from './actionTypes'

const core = electron.remote.getGlobal('core')
window.core = core

export const updateMessages = () => {
  // get latest messages from core
  const messages = core.messages.get().toJS()
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
