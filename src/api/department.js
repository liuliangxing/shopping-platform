import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function getDepartmentList(obj) {
  return http({
    url: constants.GET_DEPARTMENT_LIST_URL,
    method: 'post',
    data: obj
  })
}
export function getUserListByDepartmentId(id) {
  return http({
    url: constants.GET_USERLIST_BY_DEPARTMENTID_URL,
    method: 'post',
    data: {
      departmentId: id
    }
  })
}
export function departmentAuthorities(obj) {
  return http({
    url: constants.GET_DEPARTMENT_AUTHOTIZE_URL,
    method: 'post',
    data: obj
  })
}

