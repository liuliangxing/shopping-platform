import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getItem } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Token'] = getItem('token')
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== '0') {
      if (res.code === 'BE1003') {
        Message.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象
          })
        })
      } else if (res.code === 'SE1003') {
        Message({
          message: '系统繁忙!',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        Message({
          message: res.errorDescription === null || res.errorDescription === '' || res.errorDescription === undefined ? '系统繁忙!' : res.errorDescription,
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(res.errorDescription)
    } else {
      return response.data
    }
  },
  error => {
    if (!error.response) {
      error.status = 408
      error.message = '请求超时'
    }
    return Promise.reject(error)
  })
export default service
