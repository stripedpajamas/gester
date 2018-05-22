<template>
  <div class="main">
    <div id="master-grid-div">
      <h1>everything happens here</h1>
      <Messages />
      <Sender />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'
import { ADD_MESSAGE, SET_AUTHORS, SET_ME } from './store/types'
import { getAuthorQueueLength } from './helpers/authorQueue'
import * as Constants from './helpers/constants'
import Messages from './components/Messages'
import Sender from './components/Sender'

export default {
  name: 'App',
  components: {
    Messages,
    Sender
  },
  mounted() {
    ipcRenderer.on(Constants.GENERIC_SBOT_IPC, (_, msg) => this.addMessage({ message: msg }))
    ipcRenderer.on(Constants.SBOT_ME_IPC, (_, msg) => this.setMe({ me: msg }))
    setInterval(() => {
      if (getAuthorQueueLength()) {
        this.setAuthors()
      }
    }, 1000)
  },
  methods: {
    ...mapActions({
      addMessage: ADD_MESSAGE,
      setAuthors: SET_AUTHORS,
      setMe: SET_ME
    })
  }
}
</script>

<style global>
* {
  font-family: 'Inconsolata', monospace;
  padding: 0;
  margin: 0;
}
.main {
  height: 100vh;
}

#master-grid-div {
  height: 100%;
  display: grid;
  grid-template-rows: repeat(12, 1fr)
}
</style>
