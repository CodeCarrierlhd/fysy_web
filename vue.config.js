module.exports = {
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    https: false,
    hotOnly: false,
    proxy: {
      api: {
        target: "http://192.168.16.15:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }, // 设置代理
    before: app => {
      const bodyParser = require("body-parser");
      app.use(bodyParser.json()); //通过bodyParser获取req.body）
      // 保护接口的中间件
      function auth(req, res, next) {
        if (req.header.token !== null) {
          next();
        } else {
          res.sendStatus(401);
        }
      }
      app.post("/api/login", (req, res) => {
        const { username, password } = req.body.params;
        if (username === "admin" && password === "123456") {
          res.json({
            code: 0,
            token: "ss"
          });
        } else {
          res.json({
            code: "1",
            message: "错误"
          });
        }
      });
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
