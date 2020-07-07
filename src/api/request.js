/*
 * @Author: Lancer
 * @Date:2019/12/12
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/12
 */
import  axios from 'axios'
export function request(config,token) {
  const instance  = axios.create({
     baseURL:'http://192.168.3.47:8082'
  })
  instance.interceptors.request.use(config=>{
    if(token){
      config.headers['token'] = token
    }
    return config
  },err=>{
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    return Promise.reject(err)
  })
  return instance(config)
}


