import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function sendCode(obj) {
  return http({
    url: constants.SEND_CODE_URL,
    method: 'post',
    data: obj
  })
}
export function codeListSearch(obj) {
  return http({
    url: constants.GET_MOBILE_VALIDATE_LIST_URL,
    method: 'post',
    data: obj
  })
}
