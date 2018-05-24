<template>
  <div class="header-container">
    <h1>:: {{ mode }} MODE <span v-if="isPrivateMode">{{ privateRecipients }} </span>::</h1>
  </div>
</template>

<script>
  import { mapGetters } from "vuex"
  import * as Constants from '../helpers/constants'

  export default {
    name: 'Header',
    computed: {
      ...mapGetters({
        mode: 'mode',
        privateRecipients: 'privateRecipientNames'
      }),
      isPrivateMode() {
        return this.mode === Constants.MODE.PRIVATE;
      }
    }
  }
</script>

<style>
  .header-container {
    border-bottom: 1px solid #E0E0E0;
    display: grid;
    align-items: center;
  }
</style>