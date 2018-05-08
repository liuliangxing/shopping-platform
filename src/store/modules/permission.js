import { constantRouterMap } from '@/router'
const _import = require('../../router/_import_' + process.env.NODE_ENV)
import Layout from '../../views/layout/Layout'
/**
 * 动态路由生成
 */
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // 生成动态路由
        const accessedRouters = []
        const permissiom = data.permissiom
        permissiom.forEach((o1, i1) => {
          const route = {}
          // debugger
          const meta = {}
          meta.title = o1.menuNotes
          meta.noCache = true
          meta.iconName = o1.iconName
          let children = []
          let path = ''
          if (o1.type === 1) {
            route.path = '/' + o1.menuPath
            route.name = o1.menuPath
            children = o1.children
            path = o1.menuPath
            meta.type = o1.type
          } else {
            const paths = o1.menuPath.split('/')
            const parentPath = paths[0]
            const childPath = paths[1]
            // route.path = '/' + parentPath
            // route.name = route.path
            o1.path = childPath
            path = parentPath
            route.path = ''
            route.redirect = childPath
            children.push(o1)
          }
          route.meta = meta
          route.component = Layout
          getChildrenNode(path, children, route)
          // if (route.type === 1) {
          //   getChildrenNode(o1.path, o1.children, route)
          // } else {
          //   const childRoute = []
          //   const route1 = {}
          //   route1.path = o1.path
          //   route1.component = _import(o1.path)
          //   childRoute.push(route1)
          //   route.children = childRoute
          // }
          accessedRouters.push(route)
        })
        // console.info(accessedRouters)
        // 404
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
function getChildrenNode(path, children, parentRoute) {
  if (children && children.length) {
    const childRoute = []
    children.forEach((o2) => {
      const route = {}
      route.path = o2.menuPath
      route.name = o2.menuPath
      route.component = _import(path + '/' + o2.menuPath)
      const meta = {}
      meta.title = o2.menuNotes
      meta.iconName = o2.iconName
      meta.type = o2.type
      meta.noCache = true
      route.meta = meta
      childRoute.push(route)
      // 为了 3层目录做准备
      // const totalPath = path + '/' + o2.path
      // getChildrenNode(totalPath, o2.children, route)
    })
    parentRoute.children = childRoute
  }
}
export default permission
