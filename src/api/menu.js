import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function menuListAll(obj) {
  return http({
    url: constants.GET_MENU_LIST_URL,
    method: 'post',
    data: obj
  })
}
export function saveMenu(obj) {
  return http({
    url: constants.GET_SAVE_MENU_URL,
    method: 'post',
    data: obj
  })
}
export function updateMenu(obj) {
  return http({
    url: constants.GET_UPDATE_MENU_URL,
    method: 'post',
    data: obj
  })
}
export function menuTree() {
  return http({
    url: constants.GET_MENU_TREE_URL,
    method: 'post'
  })
}
export function getCatalogueMenuList() {
  return http({
    url: constants.GET_CATALOGUE_MENU_LIST,
    method: 'post'
  })
}
export function deleteMenuById(id) {
  return http({
    url: constants.DELETE_MENU_BY_ID,
    method: 'post',
    data: {
      id
    }
  })
}
