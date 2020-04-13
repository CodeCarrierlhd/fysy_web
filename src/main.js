import Vue from "vue";
import "../node_modules/vue-area-linkage/dist/index.css";
import VueAreaLinkage from "vue-area-linkage";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./commont/reset.css";
import interceptor from "./interceptor";
import { setCookie, getCookie, delCookie } from "./commont/js/cookie";

Vue.prototype.$cookieStore = { setCookie, getCookie, delCookie };
Vue.config.productionTip = false;
interceptor();
Vue.use(VueAreaLinkage);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
