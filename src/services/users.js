import axios from 'axios'
export default {
  login (user) {
    return axios.post('/api/login', { params: user })
  }
}
