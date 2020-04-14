import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import MainContent from '../components/MainContent'
import AcMa from '../components/AccountManagement.vue'
import AuMa from '../components/AuthorityManagement.vue'
import MaMa from '../components/MaterialManagement.vue'
import VeMa from '../components/VendorManagement.vue'
import ActiveCode from '../components/ActiveCode.vue'
import SecurityCode from '../components/SecurityCode.vue'
import ShMa from '../components/ShippingManagement.vue'
import ProductStorage from '../components/ProductStorage.vue'
import ProductBack from '../components/ProductBack.vue'
import InMa from '../components/InventoryManagement.vue'
import GetProduct from '../components/GetProduct.vue'

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
    component: Home,

    children: [
      {
        path: '/wellcome',
        name: 'MainContent',
        component: MainContent,
        meta: {
          auth: true
        }
      },
      {
        path: '/AcMa',
        name: 'AccountManagement',
        component: AcMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/AuMa',
        name: 'AuthorityManagement',
        component: AuMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/MaMa',
        name: 'MaterialManagement',
        component: MaMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/VeMa',
        name: 'VendorManagement',
        component: VeMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/ActiveCode',
        name: 'ActiveCode',
        component: ActiveCode,
        meta: {
          auth: true
        }
      },
      {
        path: '/SecurityCode',
        name: 'SecurityCode',
        component: SecurityCode,
        meta: {
          auth: true
        }
      },
      {
        path: '/ShMa',
        name: 'ShippingManagement',
        component: ShMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/ProductStorage',
        name: 'ProductStorage',
        component: ProductStorage,
        meta: {
          auth: true
        }
      },
      {
        path: '/ProductBack',
        name: 'ProductBack',
        component: ProductBack,
        meta: {
          auth: true
        }
      },
      {
        path: '/InMa',
        name: 'InventoryManagement',
        component: InMa,
        meta: {
          auth: true
        }
      },
      {
        path: '/GetProduct',
        name: 'GetProduct',
        component: GetProduct,
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
    component: Login
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
export default router
