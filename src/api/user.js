/*
 * @Author: Lancer
 * @Date:2020/7/6
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/7/6
 */
import {request} from '@/api/request'

import Qs from 'qs'


export function login(adminAccount,adminPassword) {
    return request({
      method:'post',
      url:"/login/adminLogin",
      data:{
        adminAccount,
        adminPassword
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[function (data) {
          data = Qs.stringify(data)
          return data
      }]
    })
}


export function getInfo(token) {
  return request({
    method:'get',
    url:"/login/checkToken",
    params:{
      token
    }
  })
}
