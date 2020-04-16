import Vue from 'vue'
import '../node_modules/vue-area-linkage/dist/index.css'
import VueAreaLinkage from 'vue-area-linkage'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './commont/reset.css'
import axios from 'axios'

import { encryptString, decodeString } from '@/utils/encrypt'
import {
  listData,
  searchData,
  dataChange,
  delItem,
  valueData,
  resetPassword,
  rightList
} from '@/utils/comon'
import interceptor from './interceptor'

// axios.defaults.timeout = 5000; // 请求超时
axios.defaults.baseURL = '/api/'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

Vue.prototype.encryptString = encryptString
Vue.prototype.decodeString = decodeString
Vue.prototype.listData = listData
Vue.prototype.searchData = searchData
Vue.prototype.dataChange = dataChange
Vue.prototype.delItem = delItem
Vue.prototype.valueData = valueData
Vue.prototype.resetPassword = resetPassword
Vue.prototype.rightList = rightList

Vue.config.productionTip = false
interceptor()
Vue.use(VueAreaLinkage)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
