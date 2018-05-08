import http from '@/utils/request'
import { getItem } from '@/utils/auth'
import constants from '@/utils/constants.js'

export function getAuthoritiesList(token) {
  return http({
    url: constants.GET_AUTHORITIES_LIST_URL,
    method: 'post',
    data: {
      token
    },
    headers: { 'Authorization': getItem(constants.PROJECT_TOKEN) }
  })
}
