import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuIndex: ''
  },
  mutations: {
    changeMenuIndex: (state, arg) => {
      state.menuIndex = arg
    }
  }
})
