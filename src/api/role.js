import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function roleListSearch(obj) {
  return http({
    url: constants.GET_ROLE_LIST_URL,
    method: 'post',
    data: obj
  })
}
export function saveRole(obj) {
  return http({
    url: constants.GET_SAVE_ROLE_URL,
    method: 'post',
    data: obj
  })
}
export function updateRole(obj) {
  return http({
    url: constants.GET_UPDATE_ROLE_URL,
    method: 'post',
    data: obj
  })
}
export function selectRoleAuthoritiesList(roleId) {
  return http({
    url: constants.GET_AUTHORITY_LIST_BY_ROLEID_URL,
    method: 'post',
    data: {
      id: roleId
    }
  })
}

export function disableRole(obj) {
  return http({
    url: constants.DISABLE_ROLE_URL,
    method: 'post',
    data: obj
  })
}

export function getRoleByUserId(userId) {
  return http({
    url: constants.GET_ROLE_BY_USER_ID,
    method: 'post',
    data: {
      userId
    }
  })
}
export function editUserRole(obj) {
  return http({
    url: constants.EDIT_USER_ROLE_URL,
    method: 'post',
    data: obj
  })
}

