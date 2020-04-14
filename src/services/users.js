import qs from 'qs'
import axios from 'axios'
export default {
  identifyCode() {
    return 'http://192.168.16.14:8080/login/getVerifyCode'
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
