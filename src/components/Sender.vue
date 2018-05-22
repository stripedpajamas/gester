<template>
  <div id="send-container">
    <textarea id="send-area__data" class="message-area" placeholder="Type message here..."></textarea>
    <button id="send-area__button">Send</button>
  </div>
</template>

<script>
export default {
  name: 'Sender'
}
</script>

<style>
textarea {
  outline: none;
  resize: none;
}
#send-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  height: 100%;
}
#send-area__data {
  grid-column-start: 1;
  grid-column-end: 11;
  min-width: calc(100vw - (2*(100vw/12)));
  width: 100%;
}
#send-area__button {
  width: 100%;
  grid-column-start: 11;
  grid-column-end: 13;
}
</style>
