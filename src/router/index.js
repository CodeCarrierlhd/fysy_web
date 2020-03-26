import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import MainContent from "../components/MainContent";
import AcMa from "../components/AccountManagement.vue";
import AuMa from "../components/AuthorityManagement.vue";
import MaMa from "../components/MaterialManagement.vue";
import VeMa from "../components/VendorManagement.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      auth: true,
      keepAlive: false
    },
    redirect: "/wellcome",
    component: Home,
    children: [
      {
        path: "/wellcome",
        name: "MainContent",
        component: MainContent
      },
      {
        path: "/AcMa",
        name: "AccountManagement",
        component: AcMa
      },
      {
        path: "/AuMa",
        name: "AuthorityManagement",
        component: AuMa
      },
      {
        path: "/MaMa",
        name: "MaterialManagement",
        component: MaMa
      },
      {
        path: "/VeMa",
        name: "VendorManagement",
        component: VeMa
      }
    ]
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
    next();
  }
});
export default router;
