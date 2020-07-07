import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 这边的token 是从cookie里面拿的
  const hasToken = getToken()


  //先判断有无token  没有token只能跳登录页
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      //有token  判断有roles权限
      const hasRoles = store.getters.roles && store.getters.roles.length>0
      // 权限有就直接跳过
      if (hasRoles) {
        next()
      } else {
        try {
          //没有就发送请求拿到roles  渲染左侧权限菜单
          const datas = await store.dispatch('user/getInfo')

          const accessRoutes = await store.dispatch('permission/generateRoutes', datas)
          //必须设置下面这行这个才能动态路由
          router.options.routes = store.getters.routes
          // dynamically add accessible routes  要添加后面的404 并把constantRoutes的404跳转去掉
          router.addRoutes([...accessRoutes,{path:'*',redirect:'/404',hidden:true}])
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // token过期或者token不存在了 直接跳到登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    //没有token白名单跳登录页
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
