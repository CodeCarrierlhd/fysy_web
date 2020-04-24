// var proEnv = require('./config/prod.env') // 生产环境
// var devEnv = require('./config/dev.env') // 本地环境
// const env = process.env.NODE_ENV

// let target = ''
// // 默认是本地环境
// if (env === 'production') {
//   // 生产环境
//   target = proEnv.VUE_APP_URP
// } else {
//   // 本地环境
//   target = devEnv.VUE_APP_URP
// }
// // 生成代理配置对象
console.log(process.env.NODE_ENV)
console.log(process.env.VUE_APP_BASEURL)

// console.log(target)

module.exports = {
  publicPath: './',
  devServer: {
    // open: process.platform === "darwin",
    host: '0.0.0.0',
    https: false,
    port: 3001,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASEURL, // 对应自己的接口
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
