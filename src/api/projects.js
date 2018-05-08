import http from '@/utils/request'
import constants from '@/utils/constants.js'

export function projectsListSearch(obj) {
  return http({
    url: constants.GET_PROJECT_LIST_URL,
    method: 'post',
    data: obj
  })
}
export function saveProject(obj) {
  return http({
    url: constants.GET_SAVE_PROJECT_URL,
    method: 'post',
    data: obj
  })
}
export function updateProject(obj) {
  return http({
    url: constants.GET_UPDATE_PROJECT_URL,
    method: 'post',
    data: obj
  })
}
export function projectListAll() {
  return http({
    url: constants.GET_PROJECT_LIST_ALL_URL,
    method: 'post'
  })
}
export function projectAuthortiesList(projectId) {
  return http({
    url: constants.GET_PROJECT_AUTHORIZE_LIST_ALL_URL,
    method: 'post',
    data: {
      projectId: projectId
    }
  })
}
export function getRoleListByProjectId(projectId) {
  return http({
    url: constants.GET_ROLE_LIST_BY_PROJECTID_URL,
    method: 'post',
    data: {
      projectId: projectId
    }
  })
}
export function getProjectAuthoritiesTree() {
  return http({
    url: constants.GET_PROJECT_AUTHORITIES_TREE_URL,
    method: 'post'
  })
}
