import Vue from 'vue'
import Vuex from 'vuex'

import us from '../services/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    setLoginState(state, statu) {
      state.isLogin = statu
    }
  },
  actions: {
    login({ commit }, user) {
      return us.login(user).then(res => {
        if (res.data.code === 200) {
          return res.data.code
        } else {
          return '登陆失败'
        }
      })
    }
  },
  modules: {}
})
