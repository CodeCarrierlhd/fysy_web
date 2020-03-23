import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./commont/reset.css";
import interceptor from "./interceptor";

Vue.config.productionTip = false;
interceptor();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");