import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function outwardInterfaceListSearch(obj) {
  return http({
    url: constants.GET_OUTWARD_INTERFACE_LIST_SEARCH_URL,
    method: 'post',
    data: obj
  })
}
export function saveArticle(obj) {
  return http({
    url: constants.GET_SAVE_ARTICLE_URL,
    method: 'post',
    data: obj
  })
}
export function updateArticle(obj) {
  return http({
    url: constants.GET_UPDATE_ARTICLE_URL,
    method: 'post',
    data: obj
  })
}
export function deleteArticle(obj) {
  return http({
    url: constants.GET_DELETET_ARTICLE_URL,
    method: 'post',
    data: obj
  })
}
