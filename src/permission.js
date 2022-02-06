import router from './router'
import store from './store'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken, removeLoginType, removeCompanyName } from '@/utils/auth' // getToken from cookie
import { getRoles } from '@/utils/permission'
import { parseTime } from '@/utils/index'

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

function hasAuthority(permission, router) {
  let str = router.slice(1)
  str = str.replace(/\//g, '_')
  for (var key in permission) {
    if (key == str || (str.indexOf(key) == 0)) { // 健值相等，或者健值为包含关系
      if (permission[key].length == 0) {
        return false
      } else {
        return true
      }
    }
  }
  return true
}
// 由总系统进入子系统的登录。
function nextOperate(to, from, next) {
  if (to.path === '/login') {
    next({ path: '/' })
    NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  } else {
    if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
        if (roles.indexOf('root') == -1 && roles.indexOf('admin') == -1) {
          if (window.location.host.includes('localhost')) { // 本地运行环境
            MessageBox.alert('本地运行环境暂不支持登入商家系统', '提示', {
              confirmButtonText: '确定',
              center: true,
              callback: action => {
                sessionStorage.removeItem('loginTime')
                removeLoginType()
                removeCompanyName()
                store.dispatch('LogOut').then(() => {
                  location.reload()// 为了重新实例化vue-router对象 避免bug
                })
              }
            })
          } else {
            document.location.href = 'http://' + window.location.host + '/dashboard'
          }
          return
        }
        // let staff = res.data.staff != null && res.data.staff != undefined ? res.data.staff : 0;
        // let permission = res.data.permission != null && res.data.permission != undefined ? res.data.permission : [];
        store.dispatch('GenerateRoutes', { roles }).then(() => { // store.dispatch('GenerateRoutes', { roles, staff, permission }).then(() => { //根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          if (document.body.clientWidth < 640) {
            // setSidebarStatus(0)

            store.commit('CLOSE_SIDEBAR')
          } else {
            store.commit('OPEN_SIDEBAR')
          }
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      }).catch(() => {
        store.dispatch('FedLogOut').then(() => {
          // 将token登录信息清空一下，不然登录的信息会错乱
          removeLoginType()
          store.commit('SET_TOKEN', '')
          store.commit('SET_ROLES', [])
          Message.error('验证失败, 请重新登录')
          next({ path: '/login' })
        })
      })
    } else {
      // console.log('每个页面是否都判断')
      // if(){}
      // console.log(store.getters,'完善信息')
      const perfectContdition = true
      // store.getters.isPerfectInfo
      if (perfectContdition) {
        console.log('有权限')
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          if (hasAuthority(store.getters.permission, to.path)) {
            next()
          } else {
            /* next()
            next({ path: '/401', replace: true, query: { noGoBack: true }})*/
            const time = (new Date()).getTime()
            const p = { path: '/authority/index', replace: true, query: { time: time }}
            next(p)
            // next({ path: '/authority/index', replace: true })
          }
          // next({ path: '/401', replace: true, query: { noGoBack: true }})
        } else {
          // next({ path: '/authority/index', replace: true })//
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      } else {
        // const p = { name: 'perfectInfo', replace: true}
        //   next(p)
        // const time = (new Date()).getTime()
        if (to.path == '/perfectInfo') {
          next()
          NProgress.done()
        } else {
          const p = { path: '/perfectInfo' }
          next(p)
          NProgress.done()
        }
      }

      // 可删 ↑
    }
  }
}
const whiteList = ['/login', '/root/login', '/perfectInfo', '/authredirect', '/register', '/creatSuccess', '/modifyPassword', '/modifyPasswordSuccess']// no redirect whitelist
// 首次登录
router.beforeEach((to, from, next) => {
  // console.log(from.path)
  // console.log(to.path)
  NProgress.start() // start progress bar
  const isLoginToken = location.href.includes('/login') && location.search.includes('isLoginOut')
  const isLoginOut = to.query.isLoginOut || ''
  if (isLoginToken && isLoginOut) { // 退出知识付费系统
    store.dispatch('LogOutNoApi').then(() => {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    })
    return
  }
  if (store.getters.token) { // determine if there has token
    /* has token*/
    var roles = getRoles()
    var loginTime = sessionStorage.getItem('loginTime')
    // 判断是否是第一次登录
    var isFirstLogin = parseTime(Number(loginTime), '{y}-{m}-{d}') == parseTime(new Date().getTime(), '{y}-{m}-{d}')
    // 管理员登录
    if ((roles.indexOf('root') != -1 || roles.indexOf('admin') != -1) && loginTime && !isFirstLogin) {
      MessageBox.alert('登录信息已失效，请您重新登录', '提示', {
        confirmButtonText: '确定',
        center: true,
        callback: action => {
          sessionStorage.removeItem('loginTime')
          removeLoginType()
          removeCompanyName()
          store.dispatch('LogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      })
      return
    }
    nextOperate(to, from, next)
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else if (to.path.includes('selectShop') && sessionStorage.getItem('allShopList')) { // 还没token的时候有多个店铺的话进入选择店铺
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
