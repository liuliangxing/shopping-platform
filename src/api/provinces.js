import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function getProvincesList() {
  return http({
    url: constants.GET_PROVINCES_LIST_URL,
    method: 'post',
    data: {}
  })
}
export function saveProvinces(obj) {
  return http({
    url: constants.GET_SAVE_PROVINCES_URL,
    method: 'post',
    data: obj
  })
}
export function updateProvinces(obj) {
  return http({
    url: constants.GET_UPDATE_PROVINCES_URL,
    method: 'post',
    data: obj
  })
}
export function getProvincesById(id) {
  return http({
    url: constants.GET_PROVINCES_LIST_URL,
    method: 'post',
    data: {
      id: id
    }
  })
}
