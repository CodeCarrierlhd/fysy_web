import Vue from "vue";
import Vuex from "vuex";

import us from "../services/users";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    setLoginState(state, statu) {
      state.isLogin = statu;
    }
  },
  actions: {
    login({ commit }, user) {
      return us.login(user).then(res => {
        const { code, token } = res.data;
        console.log(token);
        if (code === 0) {
          commit("setLoginState", true);
          localStorage.setItem("token", token);
        }
        return code;
      });
    }
  },
  modules: {}
});
