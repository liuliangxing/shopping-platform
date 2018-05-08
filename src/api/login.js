import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function login(obj) {
  return http({
    url: constants.GET_LOGIN_URL,
    method: 'post',
    data: obj
  })
}
export function register(obj) {
  return http({
    url: constants.REGISTER_USER_URL,
    method: 'post',
    data: obj
  })
}
export function retrievePassword(obj) {
  return http({
    url: constants.RETRIEVE_PASSWORD_URL,
    method: 'post',
    data: obj
  })
}
export function getUserList(data) {
  return http({
    url: constants.GETUSERLIST_URL,
    method: 'post',
    data: data
  })
}

export function delUser(userId, enabled) {
  return http({
    url: constants.DEL_USER_URL,
    method: 'post',
    data: {
      userId,
      enabled
    }
  })
}

export function editUser(data) {
  return http({
    url: constants.EDIT_USER_URL,
    method: 'post',
    data: data
  })
}
