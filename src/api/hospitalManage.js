/*
 * @Author: Lancer
 * @Date:2020/7/7
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/7/7
 */
import {requestK} from "@/api/request";
import Qs from 'qs'


//添加医院 POST /hosp/addHosp

export function addHosp(data) {
    return requestK({
      method:'post',
      url:'/hosp/addHosp',
      data,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
}


//获取医院列表分页  POST /hosp/getHospList
export function getHospList(data) {
  return requestK({
    method:'post',
    url:'/hosp/getHospList',
    data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[function (data) {
      data = Qs.stringify(data)
      return data
    }]
  })
}

//移除医院POST /hosp/removeHosp
export function removeHosp(data) {
  return requestK({
    method:'post',
    url:'/hosp/removeHosp',
    data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[function (data) {
      data = Qs.stringify(data)
      return data
    }]
  })
}


//查询医院 POST /hosp/selectHosp
export function selectHosp(data) {
  return requestK({
    method:'post',
    url:'/hosp/selectHosp',
    data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[function (data) {
      data = Qs.stringify(data)
      return data
    }]
  })
}


//根据id获取 医院 POST /hosp/getHospById
export function getHospById(data) {
  return requestK({
    method:'post',
    url:'/hosp/getHospById',
    data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[function (data) {
      data = Qs.stringify(data)
      return data
    }]
  })
}


//编辑医院  POST /hosp/updateHosp
export function updateHosp(data) {
  return requestK({
    method:'post',
    url:'/hosp/updateHosp',
    data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[function (data) {
      data = Qs.stringify(data)
      return data
    }]
  })
}


