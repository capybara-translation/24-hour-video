import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'babel-polyfill'


async function main() {
  // Restore session from local storage
  await store.dispatch('restoreSession')
    .catch(err => {
      console.error(err)
    })

  new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
  })
}

main()
