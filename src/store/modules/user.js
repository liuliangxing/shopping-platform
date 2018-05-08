import { login } from '@/api/login'
import { getAuthoritiesList } from '@/api/user.js'
import { getItem, setItem, removeItem } from '@/utils/auth'
import constants from '@/utils/constants.js'

const user = {
  state: {
    id: 0,
    username: '',
    nickname: '',
    token: getItem(constants.PROJECT_TOKEN),
    menuPermission: [],
    operationPermissions: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_MENUPERMISSIN: (state, menuPermission) => {
      state.menuPermission = menuPermission
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_OPERATIONPERMISSIONS: (state, operationPermissions) => {
      state.operationPermissions = operationPermissions
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, obj) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(obj).then(response => {
          debugger
          commit('SET_TOKEN', response.dataObject.accessToken)
          setItem(constants.PROJECT_TOKEN, response.dataObject.accessToken)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取菜单
    GetAuthoritiesList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getAuthoritiesList(state.token).then(response => {
          // if (response.code !== '0') {
          //   reject('error')
          // }
          commit('SET_MENUPERMISSIN', response.dataObject.authoritiesList)
          commit('SET_ID', response.dataObject.id)
          commit('SET_USERNAME', response.dataObject.username)
          commit('SET_NICKNAME', response.dataObject.nickname)
          commit('SET_OPERATIONPERMISSIONS', response.dataObject.operationPermissions)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        removeItem(constants.PROJECT_TOKEN)
        commit('SET_ID', 0)
        commit('SET_USERNAME', '')
        resolve()
      })
    }
  }
}

export default user
