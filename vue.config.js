// const path = require('path');

// const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

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
//  configureWebpack:{
//     resolve:{
//       alias:{
//         '@':path.resolve(__dirname, './src'),
//         '@i':path.resolve(__dirname, './src/assets'),
//       }
//     },
//     plugins: [
//       new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

//       // 下面是下载的插件的配置
//       new CompressionWebpackPlugin({
//         algorithm: 'gzip',
//         test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//         threshold: 10240,
//         minRatio: 0.8
//       }),
//       new webpack.optimize.LimitChunkCountPlugin({
//         maxChunks: 5,
//         minChunkSize: 100
//       })
//     ]
//   }
