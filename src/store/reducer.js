import produce from 'immer'
import * as Types from './actionTypes'
import initialState from './initialState'

export default (state = initialState, action) => (
  produce(state, draft => {
    switch (action.type) {
      case Types.SET_MESSAGES:
        draft.messages = action.messages
        break
      case Types.SET_PRIVATE:
        draft.private = true
        break
      case Types.SET_PUBLIC:
        draft.private = false
        break
    }
  })
)
