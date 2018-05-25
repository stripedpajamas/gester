import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import initialState from './store'

Vue.use(Vuex)
Vue.directive('focus', {
  inserted: el => { el.focus() }
})

App.store = new Vuex.Store(initialState)

new Vue(App).$mount('#app')
