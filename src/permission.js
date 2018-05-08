import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getItem } from '@/utils/auth'
import constants from '@/utils/constants.js'

NProgress.configure({ showSpinner: false })

// permissiom judge function

const whiteList = ['/login', '/408']// 可直接访问的页面

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getItem(constants.PROJECT_TOKEN)) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      if (store.getters.menuPermission.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetAuthoritiesList').then(res => { // 或取user_info
          const permissiom = store.getters.menuPermission
          store.dispatch('GenerateRoutes', { permissiom }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            Message.error('登录失败, 请重试！')
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
