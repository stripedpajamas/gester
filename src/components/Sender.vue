<template>
  <div id="send-container">
    <input
      id="send-area__data"
      v-focus
      v-model="msg"
      placeholder="Type message here..."
      @keyup.enter="handleSend"
      @keydown="handleKey"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { SEND_MESSAGE } from '../store/types'
  import { COMMANDS } from '../helpers/constants'

  export default {
    name: 'Sender',
    data () {
      return {
        msg: '',
        tabCompleter: null
      }
    },
    computed: {
      ...mapGetters([
        'authorNames'
      ])
    },
    methods: {
      authorCompletion (partial) {
        return this.authorNames.filter(name => name.startsWith(partial))
      },
      commandCompletion (partial) {
        return Object.values(COMMANDS).filter(cmd => cmd.startsWith(partial))
      },
      tabComplete (line) {
        const split = this.msg.split(' ')
        let beginning = split.slice(0, split.length - 1).join(' ')
        let lastWord = split[split.length - 1]
        let matches = []

        if (split.length === 1 && lastWord[0] === '/') { // command
          matches = this.commandCompletion(lastWord)
        } else { // assume author completion
          // if they didn't include an @ symbol, put one on
          if (lastWord[0] !== '@') {
            lastWord = `@${lastWord}`
          }

          matches = this.authorCompletion(lastWord)
        }

        // keep a separation between what's being tab-completed and what came before
        if (beginning) {
          beginning = `${beginning} `
        }

        let idx = -1
        return (back) => {
          if (matches.length) {
            if (back) {
              idx--
            } else {
              idx++
            }
            return `${beginning}${matches[Math.abs(idx) % matches.length]}`
          }
          return line
        }
      },
      handleSend () {
        this.sendMessage({ text: this.msg })
        this.msg = ''
      },
      handleKey (e) {
        if (e.key === 'Escape') {
          // reset input on escape
          this.msg = ''
        }
        if (e.key === 'Tab') {
          // tab completion stuff
          e.preventDefault()
          e.stopPropagation()
          if (!this.tabCompleter) {
            this.tabCompleter = this.tabComplete(this.msg)
          }
          this.msg = this.tabCompleter(e.shiftKey)
        } else if (e.key !== 'Shift') {
          // we aren't tabbing anymore (or shift tabbing), reset tab completion
          this.tabCompleter = null
        }
      },
      ...mapActions({
        sendMessage: SEND_MESSAGE
      })
    }
  }
</script>

<style>
  input {
    outline: none;
  }
  #send-container {
    display: grid;
    width: 100%;
    height: 100%;
  }
  #send-area__data {
    padding-left: 10px;
    font-size: 18px;
    min-width: calc(100vw - 10px);
    border: none;
    border-top: 1px solid #E0E0E0;
  }
</style>
