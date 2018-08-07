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
      case Types.SET_MY_NAMES:
        draft.myNames = action.myNames
        break
      case Types.SET_FOLLOWING:
        draft.following = action.following
        break
      case Types.SET_FOLLOWING_ME:
        draft.followingMe = action.followingMe
        break
      case Types.SET_BLOCKED:
        draft.blocked = action.blocked
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
      case Types.SET_JOIN_PUB:
        draft.joiningPub = action.joiningPub
        break
      case Types.SET_NOTIFICATION:
        draft.notification = action.notification
        break
      case Types.CLEAR_NOTIFICATION:
        delete draft.notification
        delete draft.error
        break
      case Types.OPEN_AUTHOR_DRAWER:
        draft.authorDrawerOpen = true
        draft.currentAuthorId = action.currentAuthorId
        break
      case Types.CLOSE_AUTHOR_DRAWER:
        draft.authorDrawerOpen = false
        draft.currentAuthorId = ''
    }
  })
)
