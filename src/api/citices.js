import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function getCiticesList(provinceId) {
  return http({
    url: constants.GET_CITICES_LIST_URL,
    method: 'post',
    data: {
      provinceId: provinceId
    }
  })
}
export function saveCitices(obj) {
  return http({
    url: constants.GET_SAVE_CITICES_URL,
    method: 'post',
    data: obj
  })
}
export function updateCitices(obj) {
  return http({
    url: constants.GET_UPDATE_CITICES_URL,
    method: 'post',
    data: obj
  })
}
