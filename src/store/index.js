import Vue from 'vue'
import { format } from 'date-fns'
import * as Types from './types'
import * as Constants from '../helpers/constants'
import { getRandomColor } from '../helpers/randomColor'
import { getAuthorQueue, resetAuthorQueue, pushAuthorQueue } from '../helpers/authorQueue'
import ui from './ui'

export default {
  state: {
    me: '',
    messages: [],
    authors: {},
    authorColors: {}
  },
  getters: {

  },
  mutations: {
    [Types.SET_AUTHOR_COLOR] (state, { author, color }) {
      Vue.set(state.authorColors, author, color)
    },
    [Types.SET_ME] (state, { me }) {
      Vue.set(state, 'me', me)
    },
    [Types.ADD_MESSAGE] (state, { message }) {
      state.messages.push(message)
    },
    [Types.SET_AUTHORS] (state, { authors }) {
      authors.forEach(({ author, name, setter }) => {
        Vue.set(state.authors, author, { name, setter })
      })
    }
  },
  actions: {
    [Types.SET_ME] ({ commit }, { me }) {
      commit(Types.SET_ME, { me })
      commit(Types.SET_AUTHOR_COLOR, { author: me, color: Constants.ME_GREEN })
    },
    [Types.ADD_MESSAGE] ({ state, commit, dispatch, getters }, { message }) {
      const msg = message.value
      if (msg && msg.content) {
        switch (msg.content.type) {
          case Constants.ABOUT: {
            if (msg.content.about && msg.content.name) {
              // only honor self-identification or my own identification of someone else
              if (msg.author === msg.content.about || msg.author === state.me) {
                let author = msg.content.about
                let cleanName = msg.content.name
                let setter = msg.author
                if (cleanName[0] !== '@') {
                  cleanName = `@${cleanName}`
                }
                const alreadySet = state.authors[author]
                // if we already have this author set
                // and it was already set by the author itself
                // and we are trying to set it ourselves
                // make that happen
                if (alreadySet && alreadySet.setter === author && author !== setter) {
                  pushAuthorQueue({ author, name: cleanName, setter })
                  return
                }
                // if any of that wasn't true, go ahead and set it
                pushAuthorQueue({ author, name: cleanName, setter })
              }
            }
            break
          }
          case Constants.MESSAGE_TYPE: {
            let authorColor
            if (!state.authorColors[msg.author]) {
              authorColor = getRandomColor()
              commit(Types.SET_AUTHOR_COLOR, { author: msg.author, color: authorColor })
            } else {
              authorColor = state.authorColors[msg.author]
            }
            const formattedMessage = {
              timestamp: format(msg.timestamp, Constants.TIME_FORMAT),
              author: msg.author,
              text: msg.content.text,
              authorColor: authorColor
            }
            commit(Types.ADD_MESSAGE, { message: formattedMessage })
            break
          }
          default:
            console.log(msg)
            break
        }
      }
    },
    [Types.SET_AUTHORS] ({ commit }) {
      commit(Types.SET_AUTHORS, { authors: getAuthorQueue() })
      resetAuthorQueue()
      // we now potentially have a new author, so refresh the message view
      // TODO refreshMessageFilter()
    }
  },
  modules: {
    ui
  }
}
