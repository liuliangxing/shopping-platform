const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  id: state => state.user.id,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  menuPermission: state => state.user.menuPermission,
  operationPermissions: state => state.user.operationPermissions,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
