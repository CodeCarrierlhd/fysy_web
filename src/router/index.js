import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import Login from '../views/Login.vue'
// import MainContent from '../components/MainContent'
// import AcMa from '../components/AccountManagement.vue'
// import AuMa from '../components/AuthorityManagement.vue'
// import MaMa from '../components/MaterialManagement.vue'
// import VeMa from '../components/VendorManagement.vue'
// import ActiveCode from '../components/ActiveCode.vue'
// import SecurityCode from '../components/SecurityCode.vue'
// import ShMa from '../components/ShippingManagement.vue'
// import ProductStorage from '../components/ProductStorage.vue'
// import ProductBack from '../components/ProductBack.vue'
// import InMa from '../components/InventoryManagement.vue'
// import GetProduct from '../components/GetProduct.vue'
// import AcSt from '../components/ActiveStatistics.vue'
// import FlSt from '../components/FlowStatistics.vue'
// import SaSt from '../components/SalesStatistics.vue'

import us from '../services/users'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      auth: true,
      keepAlive: false
    },
    redirect: '/wellcome',
    component: resolve => require(['../views/Home.vue'], resolve),

    children: [
      {
        path: '/wellcome',
        name: 'MainContent',
        component: resolve => require(['../components/MainContent'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/AcMa',
        name: 'AccountManagement',
        component: resolve =>
          require(['../components/AccountManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/AuMa',
        name: 'AuthorityManagement',
        component: resolve =>
          require(['../components/AuthorityManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/MaMa',
        name: 'MaterialManagement',
        component: resolve =>
          require(['../components/MaterialManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/VeMa',
        name: 'VendorManagement',
        component: resolve =>
          require(['../components/VendorManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/ActiveCode',
        name: 'ActiveCode',
        component: resolve =>
          require(['../components/ActiveCode.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/SecurityCode',
        name: 'SecurityCode',
        component: resolve =>
          require(['../components/SecurityCode.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/ShMa',
        name: 'ShippingManagement',
        component: resolve =>
          require(['../components/ShippingManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/ProductStorage',
        name: 'ProductStorage',
        component: resolve =>
          require(['../components/ProductStorage.vue'], resolve),

        meta: {
          auth: true
        }
      },
      {
        path: '/ProductBack',
        name: 'ProductBack',
        component: resolve =>
          require(['../components/ProductBack.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/InMa',
        name: 'InventoryManagement',
        component: resolve =>
          require(['../components/InventoryManagement.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/GetProduct',
        name: 'GetProduct',
        component: resolve =>
          require(['../components/GetProduct.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/AcSt',
        name: 'ActiveStatistics',
        component: resolve =>
          require(['../components/ActiveStatistics.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/FlSt',
        name: 'FlowStatistics',
        component: resolve =>
          require(['../components/FlowStatistics.vue'], resolve),
        meta: {
          auth: true
        }
      },
      {
        path: '/SaSt',
        name: 'SalesStatistics',
        component: resolve =>
          require(['../components/SalesStatistics.vue'], resolve),

        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      keepAlive: false
    },
    component: resolve => require(['../views/Login.vue'], resolve)
  },
  {
    path: '/down/:packType',
    name: 'Down',
    component: resolve => require(['../views/DownFile.vue'], resolve)
  }
]

const router = new VueRouter({
  routes
})
// 路由守卫

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    // 判断进入路由之前是否需要登录
    us.identifyLogin().then(res => {
      if (res.data.object) {
        next()
      } else {
        next({
          path: '/login',
          query: { reditect: to.path }
        })
      }
    })
  } else {
    next()
  }
})

// router.afterEach((to, from) => {
//   console.log(to, from)
// })

// 此VueRouter是自己自定义引入暴露出来的，即是自定义的，以下的VueRouter同样是这样
// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
