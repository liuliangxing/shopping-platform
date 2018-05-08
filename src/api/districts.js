import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function getDistrictsList(cityId) {
  return http({
    url: constants.GET_DISTRICTS_LIST_URL,
    method: 'post',
    data: {
      cityId: cityId
    }
  })
}
export function saveDistricts(obj) {
  return http({
    url: constants.GET_SAVE_DISTRICTS_URL,
    method: 'post',
    data: obj
  })
}
export function updateDistricts(obj) {
  return http({
    url: constants.GET_UPDATE_DISTRICTS_URL,
    method: 'post',
    data: obj
  })
}

