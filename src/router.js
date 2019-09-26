import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'

import store from './store'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home }
  // { path: '/callback', name: 'callback', component: SigninCallback }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.path === '/callback' && to.hash) {  // callback uri on signin operation
    store.dispatch('initSession', window.location.href)
      .then(() => {
        console.log('callback')
        next({ name: 'home' })
      })
    return
  } else if (to.path === '/signout') {  // callback uri on signout operation
    console.log('signout')
    next({ name: 'home' })
    return
  }
  next()
})

export default router