import produce from 'immer'
import * as Types from './actionTypes'
import initialState from './initialState'

export default (state = initialState, action) => (
  produce(state, draft => {
    switch (action.type) {
      case Types.SET_ME:
        draft.me = action.me
        break
      case Types.SET_MESSAGES:
        draft.messages = action.messages
        break
      case Types.SET_RECIPIENTS:
        draft.recipients = action.recipients
        break
      case Types.SET_AUTHORS:
        draft.authors = action.authors
        break
      case Types.SET_UNREADS:
        draft.unreads = action.unreads
        break
      case Types.SET_RECENTS:
        draft.recents = action.recents
        break
      case Types.SET_MODE:
        draft.mode = action.mode
        break
      case Types.SET_ERROR:
        draft.error = action.error
        break
      case Types.SET_NOTIFICATION:
        draft.notification = action.notification
        break
    }
  })
)
