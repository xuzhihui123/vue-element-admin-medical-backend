import {login, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    adminId: null,
    roles: [],
    menuList: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ADMINID: (state, id) => {
    state.adminId = id
  },
  SET_ROLES: (state, role) => {
    state.roles = role
  },
  SET_MANULIST: (state, list) => {
    state.menuList = list
  }
}

const actions = {
  // user login 用户登录
  login({commit}, userInfo) {
    const {adminAccount, adminPassword} = userInfo
    return new Promise((resolve, reject) => {
      login(adminAccount, adminPassword).then(response => {
        //登录成功  把token记录
        if (response.code === 200) {
          commit('SET_TOKEN', response.data)
          //设置token到cookie里面
          setToken(response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      //这边是根据token 向后台再异步请求拿到用户数据
      getInfo(state.token).then(response => {
        //请求成功 赋值
        if (response.code === 200) {
          commit('SET_ADMINID', response.data.adminId)
          commit('SET_NAME', response.data.adminName)
          commit('SET_ROLES', response.data.roleList)
          commit('SET_MANULIST', response.data.menuList)
          resolve({
            roles: state.roles,
            menuList: state.menuList
          })
        } else {
          reject('token is error')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

