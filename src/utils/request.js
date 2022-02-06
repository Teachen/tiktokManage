// import axios from 'axios'
import { Message, Loading, MessageBox } from 'element-ui' // eslint-disable-line
import store from '@/store'
import { getToken, removeLoginType, removeCompanyName, setLoginType } from '@/utils/auth'
import { getRoles } from '@/utils/permission'
// import { reportError } from '@/utils/reportError'
// let loadingInstance = null;

// create an axios instance
const service = axios.create({ // eslint-disable-line
  baseURL: process.env.VUE_APP_BASE_API || process.env.BASE_API, // api的base_url
  timeout: 0 // request timeout
})

let showLoginExpire = false // 是否显示登陆超时的弹框
// request interceptor,请求拦截器
var requestUrl = ''
let isAlertLogin = false
service.interceptors.request.use(config => {
  if (config.url.includes('/ttapi')) {
    config.headers['X-Requested-Version'] = '20220125' // 抖店版本号
  }
  if (config.url.includes('kpapi0.ckjr001.com/api/admin/ttapi/') || config.url.includes('formalapi.ckjr001.com/api/admin/ttapi/')) { // 抖音正式域名不一样，加个判断
    config.url = config.url.replace(process.env.VUE_APP_BASE_API, process.env.VUE_APP_TIKTOK_API)
  }
  requestUrl = config.url
  // Do something before request is sent
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer ' + getToken() // jwt token 请求格式
  }
  // 数据分析请求头
  if (store.getters.adminUserId) {
    const userId = store.getters.adminUserId
    const companyId = store.getters.encodeCompanyId
    const channel = 'admro'
    const pathUrl = encodeURIComponent(window.location.pathname)
    config.headers['X-DMP'] = `u=${userId}&c=${companyId}&url=${pathUrl}&chl=${channel}`
  }
  if (store.getters.token) {
    var accountType = localStorage.getItem('accountType')
    /** 是为了解决 管理员进入子系统问题（由于进入子系统loginType是0，当store里的值不是0，adminUserId也是管理员id，无法对比）新增了一个accountType，如果不相等，说明账号发生改变 */
    var accountTypeValid = store.getters.accountType && store.getters.accountType != Number(accountType) // 登录的类型
    var loginUserIdValid = store.getters.adminUserId && store.getters.adminUserId != Number(localStorage.getItem('loginUserId'))// 登录的账号
    if (loginUserIdValid || accountTypeValid) {
      // 判断当前登录id是否与记录的一致，不一致说明是登录了多个账号，需要提示用户，然后刷新获取最新信息，防止串号
      if (isAlertLogin) {
        return Promise.reject('loginUserError')
      }
      isAlertLogin = true
      MessageBox.alert('您已更换登录账号，将获取您最新登录账号信息', '提示', {
        confirmButtonText: '确定',
        center: true,
        callback: action => {
          if (accountType == 0 || accountType == -1) { // 商家系统 子账号进入系统
            setLoginType(0)
            window.location.href = 'http://' + window.location.host + '/dashboard'
            return
          }
          window.location.href = 'http://' + window.location.host + '/root/' // 跳转到首页
        }
      })
      return Promise.reject('loginUserError')
    }
  }

  /* if (config.method == "post") {
    loadingInstance = Loading.service({
      fullscreen: true,
      lock: true,
      text: '执行中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }*/

  return config
}, error => {
  /* if (loadingInstance != null) {
    loadingInstance.close();
    loadingInstance = null;
  }*/
  // Do something with request error
  console.log('error', error) // for debug
  Promise.reject(error)
})
// respone interceptor,响应拦截器。
service.interceptors.response.use(
  // response => response,
  response => {
    // 1.判断页面是否停留了一小时 如果超过一小时要退出登录
    var roles = getRoles()
    // 判断token是否存在，并且是管理员登录

    var stepTime = 60 * 60 * 1000
    var isTest = process.env.VUE_APP_BASE_API == 'http://kpapi-cs.ckjr001.com/api/admin' || process.env.VUE_APP_BASE_API == 'http://kpapi-cs2.ckjr001.com/api/admin'
    var hourTime = isTest || roles.indexOf('admin') != -1 ? 3 * stepTime : stepTime
    if (store.getters.token && (roles.indexOf('root') != -1 || roles.indexOf('admin') != -1)) {
      var lastTime = sessionStorage.getItem('loginTime') // 取缓存里面的登录时间（登入时候存的缓存）
      var curTime = new Date().getTime()

      if (lastTime && (curTime - lastTime > hourTime)) { // 判断是否没操作超过了一小时
        if (showLoginExpire) { // 若已经弹过超时的提示了，直接return掉
          return Promise.reject('error')
        }
        showLoginExpire = true
        MessageBox.alert('登录信息已失效，请您重新登录', '提示', {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            sessionStorage.removeItem('loginTime') // 清空缓存
            removeLoginType()// 清空登录的类型
            removeCompanyName()
            store.dispatch('LogOut').then(() => { // 执行退出登录操作
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
            showLoginExpire = false // 点击退出登录把这个值置为false
          }
        })
        return Promise.reject('error')
      } else { // 如果有操作，则更新操作时间（即登录时间）
        sessionStorage.setItem('loginTime', curTime)
        showLoginExpire = false
      }
    }
    /* if (loadingInstance != null) {
      loadingInstance.close();
      loadingInstance = null;
    }*/
    // 2. 第二条拦截，返回正常的数据
    if (response.data.statusCode == 200) {
      return response
    } else {
      // 第三条拦截，返回500的拦截。
      if (response.data.statusCode == 500 || response.data.statusCode == 1001) {
        if (response.data.msg == 'ValidationException') { // 验证异常
          for (var i in response.data.errors) {
            Message({
              message: response.data.errors[i][0],
              type: 'error',
              duration: 3 * 1000
            })
            break
          }
        } else if (response.data.errorType && response.data.errorType.includes('companyClose')) { // 已关闭平台
          MessageBox.alert('账号已停用', '提示', {
            confirmButtonText: '确定',
            center: true,
            callback: action => {
              removeLoginType()
              removeCompanyName()
              store.dispatch('LogOutNoApi').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            }
          })
        } else {
          if (response.data.errors && response.data.errors.includes('SQLSTATE')) { // 出现了数据库问题
            console.error(response.data.errors)
            Message({
              message: '系统异常',
              type: 'error',
              duration: 3 * 1000
            })
          } else {
            Message({
              message: response.data.errors || response.data.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        }
      } else if (response.data.statusCode == 402) { // 登录超时
        MessageBox.alert('您可能因为太久未操作，登录已过期，请重新登录', '提示', {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            removeLoginType()
            removeCompanyName()
            store.dispatch('LogOutNoApi').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          }
        })
      } else if (response.data.statusCode != 40000 && response.data.statusCode != 40001) {
        Message({
          message: '系统出错了',
          type: 'error',
          duration: 3 * 1000
        })
      }
      console.log(requestUrl)
      // 给后台发送报错信息
      // if (!requestUrl.includes('common/reportError')) {
      //   reportError(requestUrl, response.data.errors || response.data.msg)
      // }
      return Promise.reject(response || 'error')
    }
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    /* if (loadingInstance != null) {
      loadingInstance.close();
      loadingInstance = null;
    }*/
    const resData = error.response ? error.response.data : error
    console.log(resData.statusCode, 'resData.statusCode')

    if (resData.statusCode == 500 || resData.statusCode == 503) { // 500错误
      Message({
        message: resData.msg || resData.data,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error.response)
    }
    if (error.message == 'Request failed with status code 403') {
      MessageBox.alert('登录信息被修改，需要重新登录', '提示', {
        confirmButtonText: '确定',
        center: true,
        callback: action => {
          removeLoginType()
          removeCompanyName()
          store.dispatch('LogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      })
      return
    }
    console.log('err', error)// for debug
    if (error == 'loginUserError') { // 同一个浏览器登录不同商家信息弹框的就不弹message了 直接return
      return Promise.reject('登录信息不一致')
    }
    Message({
      message: resData.msg || resData.data || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
