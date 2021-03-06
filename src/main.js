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
import echarts from 'echarts'

// import cookie from 'vue-cookie'

import { encryptString, decodeString } from '@/utils/encrypt'
import {
  listData,
  searchData,
  dataChange,
  delItem,
  valueData,
  resetPassword,
  rightList,
  codeData,
  rightChange,
  rightInsert,
  getSums,
  roleList,
  productDone,
  searchAll,
  sendId,
  sendProducts,
  getSearchData
} from '@/utils/comon'

import { exportCompanyExcel, downloadFile } from '../src/utils/importCommon'
import interceptor from './interceptor'

// axios.defaults.timeout = 5000; // 请求超时
// axios.defaults.baseURL =
//   process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASEURL : '/api'
axios.defaults.baseURL = '/api'
// 后端存入cookie 必须打开
// axios.defaults.withCredentials = true
// axios.defaults.headers
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
Vue.prototype.codeData = codeData
Vue.prototype.rightChange = rightChange
Vue.prototype.rightInsert = rightInsert
Vue.prototype.getSums = getSums
Vue.prototype.roleList = roleList
Vue.prototype.productDone = productDone
Vue.prototype.searchAll = searchAll
Vue.prototype.sendId = sendId
Vue.prototype.getSearchData = getSearchData
Vue.prototype.sendProducts = sendProducts
Vue.prototype.exportCompanyExcel = exportCompanyExcel
Vue.prototype.downloadFile = downloadFile
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
interceptor()
Vue.use(VueAreaLinkage)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
