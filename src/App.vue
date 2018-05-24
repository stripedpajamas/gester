<template>
  <div class="main">
    <div id="master-grid-div">
      <Header />
      <Messages />
      <Sender />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'
import {
  ADD_MESSAGE,
  SET_SYSTEM_MESSAGE,
  SET_AUTHORS,
  SET_ME
} from './store/types'
import { getAuthorQueueLength } from './helpers/authorQueue'
import * as Constants from './helpers/constants'
import Header from './components/Header'
import Messages from './components/Messages'
import Sender from './components/Sender'

export default {
  name: 'App',
  components: {
    Header,
    Messages,
    Sender
  },
  mounted() {
    ipcRenderer.on(Constants.GENERIC_SBOT_IPC, (_, msg) => this.addMessage({ message: msg }))
    ipcRenderer.on(Constants.SBOT_ME_IPC, (_, msg) => this.setMe({ me: msg }))
    ipcRenderer.on(Constants.SYSTEM_MESSAGE, (_, msg) => this.setSystemMessage({ message: msg }))
    setInterval(() => {
      if (getAuthorQueueLength()) {
        this.setAuthors()
      }
    }, 300)
  },
  methods: {
    ...mapActions({
      addMessage: ADD_MESSAGE,
      setSystemMessage: SET_SYSTEM_MESSAGE,
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
