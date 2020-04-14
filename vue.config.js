var proEnv = require('./config/pro.env') // 生产环境
var devEnv = require('./config/dev.env') // 本地环境
const env = process.env.NODE_ENV

let target = ''
// 默认是本地环境
if (env === 'production') {
  // 生产环境
  target = proEnv.hosturl
} else {
  // 本地环境
  target = devEnv.hosturl
}
// 生成代理配置对象

module.exports = {
  devServer: {
    // open: process.platform === "darwin",
    host: '0.0.0.0',
    https: false,
    port: 8080,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: target, // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => {}
  }
}
