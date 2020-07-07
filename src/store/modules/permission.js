/*
 * @Author: Lancer
 * @Date:2020/7/3
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/7/3
 */


import {asyncRoutes, constantRoutes} from '@/router'

import Layout from '@/layout'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}


/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data, roles) {
  data.forEach(item => {
    let componentSrc = item.component
    let loadView = (view) => { // 路由懒加载
      return (resolve) => require([`@/views/${view}`], resolve)
    }
    const menu = {
      path: item.menuUrl,
      component: item.menuUrl.match(/\//g).length === 1 ? Layout : loadView(componentSrc),
      children: [],
      // redirect:item.secondMenus[0].menuUrl,
      name: item.component + item.menuId,
      meta: {title: item.menuName, id: item.menuId, roles: roles, icon: item.icon}
    }
    if (item.secondMenus) {
      generaMenu(menu.children, item.secondMenus, roles)
    }
    routes.push(menu)
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, datas) {
    let {roles, menuList} = datas
    return new Promise(resolve => {
      //首先把所有权限路由整合
      let routeArr = []

      menuList.forEach(item => {
        if (item.menuName !== '系统管理') {
          routeArr.push(item)
        }
      })


      generaMenu(asyncRoutes, routeArr, roles)


      //返回权限路由数组列表
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      //设置路由权限列表
      commit('SET_ROUTES', accessedRoutes)

      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
