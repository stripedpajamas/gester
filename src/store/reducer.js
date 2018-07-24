import produce from 'immer'
import * as Types from './actionTypes'
import initialState from './initialState'

export default (state = initialState, action) => (
  produce(state, draft => {
    switch (action.type) {
      case Types.SET_MESSAGES:
        draft.messages = action.messages
    }
  })
)
