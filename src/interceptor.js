import axios from "axios";
export default () => {
  // 用于拦截请求和响应
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      config.headers.token = token;
    }
    return config;
  });
};
