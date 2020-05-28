// const path = require('path');

// const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

// console.log(target)
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
