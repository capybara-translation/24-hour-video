import Vue from 'vue'
import Vuex from 'vuex'
import cognitoUtils from '../lib/cognitoUtils'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state () {
    return {
      isLoggedIn: false,
      session: null
    }
  },

  getters: {
    isLoggedIn: state => state.isLoggedIn,
    session: state => state.session
  },

  mutations: {
    isLoggedIn: (state, value) => {
      state.isLoggedIn = value
    },
    session: (state, value) => {
      state.session = value
    }
  },

  actions: {
    setIsLoggedIn ({commit}, value) {
      commit('isLoggedIn', value)
    },
    setSession ({commit}, value) {
      commit('session', value)
    },
    async restoreSession ({dispatch}) {
      const session = await cognitoUtils.getCognitoSession()
      if (session) {
        dispatch('setSession', session)
        dispatch('setIsLoggedIn', true)
        console.log('restored:', true)
      } else {
        console.log('restored:', false)
      }
    },
    async initSession ({dispatch}, callbackHref) {
      await cognitoUtils.parseCognitoWebResponse(callbackHref) // parse the callback URL
      const session = await cognitoUtils.getCognitoSession()   // get a new session
      if (session) {
        dispatch('setSession', session)
        dispatch('setIsLoggedIn', true)
        console.log('logged-in:', true)
      } else {
        console.log('logged-in:', false)
      }
    }
  }
})

export default store
