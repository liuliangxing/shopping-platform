import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function contentListSearch(obj) {
  return http({
    url: constants.GET_CONTENT_LIST_SEARCH_URL,
    method: 'post',
    data: obj
  })
}
export function saveContent(obj) {
  return http({
    url: constants.GET_SAVE_CONTENT_URL,
    method: 'post',
    data: obj
  })
}
export function updateContent(obj) {
  return http({
    url: constants.GET_UPDATE_CONTENT_URL,
    method: 'post',
    data: obj
  })
}
