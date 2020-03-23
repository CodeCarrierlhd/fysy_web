import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      auth: true,
      keepAlive: false
    },
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      keepAlive: false
    },
    component: Login
  }
];

const router = new VueRouter({
  routes
});
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    // 判断进入路由之前是否需要登录
    const token = localStorage.getItem("token");
    // 前端实现路由无状态化
    if (token != null) {
      next();
    } else {
      console.log(2);
      next({
        path: "/login",
        query: { reditect: to.path }
      });
    }
  } else {
    console.log(3);
    next();
  }
});
export default router;
