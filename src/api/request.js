/*
 * @Author: Lancer
 * @Date:2019/12/12
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/12
 */
import axios from 'axios'

import {getToken} from "@/utils/auth";

import router from "@/router";


import store from "@/store";

import {Message} from 'element-ui'

export function request(config, token) {
  const instance = axios.create({
    baseURL: 'http://192.168.3.47:8082'
  })
  instance.interceptors.request.use(config => {
    if (token) {
      config.headers['token'] = token
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    return Promise.reject(err)
  })
  return instance(config)
}


export function requestK(config) {
  const instance = axios.create({
    baseURL: 'http://192.168.3.47:8082'
  })
  instance.interceptors.request.use(config => {
    config.headers['token'] = getToken()
    return config
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(async res => {
    let code = res.data.code
    //500是假token  501是token过期  拦截跳转
    if ((code && code === 500) || (code && code === 501)) {
      //清空token和用户信息
      await store.dispatch('user/resetToken')
      Message({
        type: 'error',
        message: '页面已失效，请重新登录！'
      })
      router.push('/login?redirect=/')
      //页面强制刷新一下 才行
      window.location.reload(true)
    } else {
      return res.data
    }
  }, err => {
    return Promise.reject(err)
  })
  return instance(config)
}


