<template>
  <div id="send-container">
    <input
      id="send-area__data"
      v-focus
      v-model="msg"
      placeholder="Type message here..."
      @keyup.enter="handleSend"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { SEND_MESSAGE } from '../store/types'

  export default {
    name: 'Sender',
    data () {
      return {
        msg: ''
      }
    },
    methods: {
      handleSend () {
        this.sendMessage({ text: this.msg })
        this.msg = ''
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
    font-size: 18px;
    min-width: 100vw;
    width: 100%;
  }
</style>
