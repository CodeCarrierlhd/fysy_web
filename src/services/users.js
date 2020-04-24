import qs from 'qs'
import axios from 'axios'

export default {
  identifyCode() {
    // hans3d.transplus.cn/login/getVerifyCode
    return process.env.VUE_APP_BASEURL + '/login/getVerifyCode'
    // return 'http://39.108.187.58:8087/login/getVerifyCode'
  },
  identifyLogin() {
    return axios.get('/login/isLogin')
  },
  login(user) {
    const { password, username, verifyCode } = user
    var params = qs.stringify({
      password,
      username,
      verifyCode
    })

    return axios.post('/login/post', params)
  },
  getUserInfo() {
    return axios.get('/user/main')
  }
}
