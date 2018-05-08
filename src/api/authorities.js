import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function authoritiesListSearch() {
  return http({
    url: constants.GET_AUTHORITY_LIST_URL,
    method: 'post'
  })
}
export function authoritiesListByRole(userId) {
  return http({
    url: constants.GET_AUTHORITY_LIST_BY_USER_ID_URL,
    method: 'post',
    data: {
      userId
    }
  })
}
export function saveAuthorities(obj) {
  return http({
    url: constants.GET_SAVE_AUTHORITY_URL,
    method: 'post',
    data: obj
  })
}
export function updateAuthorities(obj) {
  return http({
    url: constants.GET_UPDATE_AUTHORITY_URL,
    method: 'post',
    data: obj
  })
}
export function deleteAuthorites(id) {
  return http({
    url: constants.GET_DELETE_AUTHORIZE_URL,
    method: 'post',
    data: {
      id: id
    }
  })
}
export function getAuthoritiesByType(type) {
  return http({
    url: constants.GET_AUTHORITIES_BY_TYPE,
    method: 'post',
    data: {
      type
    }
  })
}
export function getAuthoritiesListByUserId(userId) {
  return http({
    url: constants.GET_AUTHORITIES_LIST_BY_USERID_URL,
    method: 'post',
    data: {
      userId
    }
  })
}
export function getAuthoritiesAllByRoleId(roleId) {
  return http({
    url: constants.GET_AUTHORITIES_ALL_BY_ROLE_ID_URL,
    method: 'post',
    data: {
      roleId
    }
  })
}

export function grantAuthoritiesListByUserId(userId, authoritiesList) {
  return http({
    url: constants.GRANT_AUTHORITIES_LIST_BY_USERID_URL,
    method: 'post',
    data: {
      userId,
      authoritiesList
    }
  })
}
