<template>
  <div id="message-container">
    <p class="message" v-for="(msg, idx) in messages" :key="idx">
      <span class="message__timestamp">{{ msg.timestamp }}</span>
      <span class="message__author" :style="{ color: msg.authorColor }">
        {{ getAuthor(msg) }}
      </span>
      <span class="message__text">{{ msg.text }}</span>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Messages',
  watch: {
    messages() {
      const container = this.$el
      if (typeof container.scrollTo === 'function') {
        container.scrollTo(0, container.scrollHeight)
      }
    }
  },
  computed: {
    ...mapState({
      messages: state => state.messages,
      authors: state => state.authors,
      me: state => state.me
    })
  },
  methods: {
    getAuthor(msg) {
      return (this.authors[msg.author] || {}).name || msg.author
    }
  }
}
</script>

<style>
#message-container {
  padding: 0 10px;
  grid-row-start: 2;
  grid-row-end: 12;
  overflow: scroll;
}
.message__timestamp {
  color: #9E9E9E;
}
.message__author {
  font-weight: bold;
}
.message-area {
  font-size: 18px;
}
.message {
  font-size: 18px;
  margin: 10px 0;
}
</style>
