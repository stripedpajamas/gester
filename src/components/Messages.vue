<template>
  <div id="message-container">
    <div class="message" v-for="(msg, idx) in messages" :key="idx">
      <span class="message__timestamp">{{ msg.timestamp }}</span>
      <span class="message__author" :style="{ color: msg.authorColor }">
        {{ getAuthor(msg) }}
      </span>
      <span class="message__text">{{ msg.text }}</span>
    </div>
    <div class="message" v-if="systemMessage.message">
      <span :class="getSystemClass(systemMessage)">
        <mark>{{ systemMessage.message }}</mark>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: 'Messages',
  watch: {
    messages: 'scrollToBottom',
    mode: 'scrollToBottom'
  },
  computed: {
    ...mapGetters({
      mode: 'mode',
      messages: 'visibleMessages'
    }),
    ...mapState({
      systemMessage: state => state.systemMessage,
      errorMessage: state => state.errorMessage,
      authors: state => state.authors,
      me: state => state.me
    })
  },
  methods: {
    scrollToBottom() {
      const container = this.$el;
      if (typeof container.scrollTo === 'function') {
        this.$nextTick(() => {
          container.scrollTo(0, container.scrollHeight);
        })
      }
    },
    getAuthor (msg) {
      return (this.authors[msg.author] || {}).name || msg.author;
    },
    getSystemClass (msg) {
      const prefix = msg.error ? 'error' : 'system'
      return `${prefix} message__text`
    }
  }
};
</script>

<style>
#message-container {
  padding: 0 10px;
  grid-row-start: 2;
  grid-row-end: 12;
  overflow: scroll;
}
.system > mark {
  background-color: #B2DFDB;
}
.error > mark {
  background-color: #ef9a9a;
}
.message {
  font-size: 18px;
  margin: 10px 0;
  display: grid;
  grid-template-columns: 120px 150px 1fr;
}
.message__timestamp {
  grid-column-start: 1;
  grid-column-end: 2;
  color: #bdbdbd;
  font-size: 14px;
}
.message__author {
  grid-column-start: 2;
  grid-column-end: 3;
  font-weight: bold;
  overflow: hidden;
  margin-right: 10px;
}
.message__text {
  grid-column-start: 3;
}
.message:hover {
  background-color: #EEEEEE;
}
</style>
