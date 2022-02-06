import { loginByUsername, loginByMobile, login, logout, resetPw, getUserInfo, loginProxy } from '@/api/login'
import { getToken, setToken, removeToken, setLoginType, getLoginType, removeLoginType } from '@/utils/auth'
// import { Message } from 'element-ui'

const user = {
  state: {
    user: '',
    noviceGuidance: {
      step: 0, // 第几个步骤
      exit: false, // 是否退出
      sideBarItem: '',
      fn: [] // 执行的回调
    },
    toUrlPath: null, // 目标页
    leftMenu: null, // 左侧导航栏
    currentLink: null, // 在当前页需要引导
    menuList: [], // 左侧导航栏可下拉
    status: '',
    companyTypeInfo: {},
    companyInfo: {},
    code: '',
    token: getToken(),
    name: '',
    isPerfectInfo: false,
    avatar: '',
    introduction: '',
    roles: [],
    enableModules: [],
    adminUserId: '',
    encodeCompanyId: null, // 加密后的公司id
    permission: null,
    staff: null,
    loginType: null,
    adminPermission: null,
    setting: {
      articlePlatform: []
    },
    allShopList: '',
    roleType: '', // 登录角色
    accountType: ''
  },

  mutations: {
    SET_NOVICEGUIDANCE_STEP: (state, step) => {
      state.noviceGuidance.step = step
    },
    SET_NOVICEGUIDANCE_EXIT: (state, exit) => {
      state.noviceGuidance.exit = exit
    },
    SET_NOVICEGUIDANCE_SIDE_BAR_ITEM: (state, sideBarItem) => {
      state.noviceGuidance.sideBarItem = sideBarItem
    },
    SET_NOVICEGUIDANCE_FN: (state, fn) => {
      state.noviceGuidance.fn.push(fn)
    },
    SET_NOVICEGUIDANCE_RESET_FN: (state) => {
      state.noviceGuidance.fn = []
    },
    SET_TO_URL_PATH: (state, toUrlPath) => {
      state.toUrlPath = toUrlPath
    },
    SET_CURRENT_LINK: (state, currentLink) => {
      state.currentLink = currentLink
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_LEFTMENU: (state, leftMenu) => {
      state.leftMenu = leftMenu
    },
    SET_MENULIST: (state, menuList) => {
      state.menuList = menuList
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ENABLE_MODULES: (state, enableModules) => {
      state.enableModules = enableModules
    },
    SET_ENABLE_MODULES_WX_NOTICE: (state, enableModules) => {
      state.enableModules.enableWxNotice = enableModules
    },
    SET_ADMIN_USER_ID: (state, adminUserId) => {
      state.adminUserId = adminUserId
    },
    SET_ADMIN_USER_PERMISSION: (state, permission) => {
      state.permission = permission
    },
    SET_ADMIN_USER_STAFF: (state, staff) => {
      state.staff = staff
    },
    SET_LOGIN_TYPE: (state, type) => {
      state.loginType = type
    },
    SET_ENCODE_COMPANY_ID: (state, encodeCompanyId) => {
      // 公司加密ID
      state.encodeCompanyId = encodeCompanyId
    },
    SET_IS_PERFECT_INFO: (state, isPerfectInfo) => {
      // 是否完善了信息
      state.isPerfectInfo = isPerfectInfo
    },
    SET_COMPANY_INFO: (state, companyInfo) => {
      // 是否完善了信息
      state.companyInfo = companyInfo
    },
    SET_COMPANY_TYPE_INFO: (state, companyTypeInfo) => {
      // 是否完善了信息
      state.companyTypeInfo = companyTypeInfo
    },
    SET_ADMIN_PERMISSION: (state, adminPermission) => {
      state.adminPermission = adminPermission
    },
    SET_ROLE_TYPE: (state, roleType) => {
      state.roleType = roleType
    },
    SET_ALL_SHOP: (state, allShopList) => {
      state.allShopList = allShopList
    },
    SET_ACCOUNT_TYPE: (state, val) => {
      state.accountType = val
    },
  },

  actions: {
    setServiceName({ commit }, serviceName) {
      commit('SET_SERVICE_NAME', serviceName)
    },
    // 用户名登录，用户手动输入用户名的时候调用。
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          if (response.data.statusCode == 200) {
            commit('SET_TOKEN', response.data.data.token)
            setToken(response.data.data.token)
            // 记录登录时间
            sessionStorage.setItem('loginTime', new Date().getTime())
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 手机号登录 手机号和验证码，新版权限用到
    LoginByMobile({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByMobile(userInfo).then(response => {
          // 记录登录时间
          sessionStorage.setItem('loginTime', new Date().getTime())
          if (response.data.data.token) {
            commit('SET_TOKEN', response.data.data.token)
            setToken(response.data.data.token)
            resolve({ type: 'login', data: response })
            return
          }
          commit('SET_ALL_SHOP', response.data.data)
          sessionStorage.setItem('loginUserInfo', JSON.stringify(userInfo)) // 存一下登录的手机号和验证码信息，多店铺选择需要用到
          sessionStorage.setItem('allShopList', JSON.stringify(response.data.data)) // 存下店铺的信息
          resolve({ type: 'selectShop', data: response })
        }).catch(error => {
          reject(error)
        })
      })
    },
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          // 记录登录时间
          sessionStorage.setItem('loginTime', new Date().getTime())
          if (response.data.data.token) {
            commit('SET_TOKEN', response.data.data.token)
            setToken(response.data.data.token)
            // sessionStorage.removeItem('allShopList') // 以防万一，直接进入的话清空下多店铺信息
            // sessionStorage.removeItem('loginUserInfo')
            resolve({ type: 'login', data: response })
            return
          }
          commit('SET_ALL_SHOP', response.data.data)
          sessionStorage.setItem('loginUserInfo', JSON.stringify(userInfo)) // 存一下登录的手机号和验证码信息，多店铺选择需要用到
          sessionStorage.setItem('allShopList', JSON.stringify(response.data.data)) // 存下店铺的信息
          resolve({ type: 'selectShop', data: response })
        }).catch(error => {
          reject(error)
        })
      })
    },
    ResetPwd({ commit }, userInfo) { // 忘记密码，多店铺的
      return new Promise((resolve, reject) => {
        resetPw(userInfo).then(response => {
          if (response.data.data.status) {
            resolve({ type: 'success', data: response.data.data })
            return
          }
          commit('SET_ALL_SHOP', response.data.data)
          sessionStorage.setItem('loginUserInfo', JSON.stringify(userInfo)) // 存一下登录的手机号和验证码信息，多店铺选择需要用到
          sessionStorage.setItem('allShopList', JSON.stringify(response.data.data)) // 存下店铺的信息
          resolve({ type: 'selectShop', data: response.data.data })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登录代理，有总系统进入子系统输入的管理密码。
    LoginProxy({ commit }, companyId) {
      return new Promise((resolve, reject) => {
        loginProxy(companyId).then(response => {
          if (response.data.statusCode == 200) {
            commit('SET_TOKEN', response.data.data.token)
            setToken(response.data.data.token)
            // 记录登录时间
            sessionStorage.setItem('loginTime', new Date().getTime())
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          // 记录登录时间
          // sessionStorage.setItem('loginTime', new Date().getTime())
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data.data
          // 要存储的用户信息
          commit('SET_ADMIN_USER_ID', data.id)
          commit('SET_ENCODE_COMPANY_ID', data.encodeCompanyId) // 公司加密id

          // commit('SET_IS_PERFECT_INFO', data.isPerfectInfo) // 是否完善信息
          commit('SET_IS_PERFECT_INFO', data.retCode == 1) // 是否完善信息
          // commit('SET_IS_PERFECT_INFO', true) // 是否完善信息

          commit('SET_COMPANY_INFO', data.companyInfo) // 是否完善信息
          commit('SET_COMPANY_TYPE_INFO', data.companyTypeInfo) // 是否完善信息
          commit('SET_ROLES', data.roles) // 公司的角色
          commit('SET_NAME', data.name) // 公司的名字
          commit('SET_AVATAR', data.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif') // 公司的头像
          commit('SET_INTRODUCTION', data.introduction) // 公司的简介,此处用户信息中并未包含，存贮错误。
          commit('SET_ENABLE_MODULES', data.enableModules)
          commit('SET_ADMIN_USER_PERMISSION', data.permission)
          commit('SET_ADMIN_USER_STAFF', data.staff)
          commit('SET_LOGIN_TYPE', data.type)
          commit('SET_ADMIN_PERMISSION', data.adminPermission)
          commit('SET_ROLE_TYPE', data.roleType) // 角色
          // 开通约课并且不开通报单
          if (data.enableModules.enableDeclareModule == 1 || data.enableModules.enableReservationModule != 1) {
            data.enableModules.isNoJuShangMei = 0
          } else {
            data.enableModules.isNoJuShangMei = 1
          }
          const type = getLoginType()
          if (type == null || type == undefined) {
            setLoginType(data.type) // 0: company 1: root
          }

          if (data.roles[0] == 'company' && type != 0) {
            setLoginType(0)
          }
          if (data.roles[0] == 'root' && type > 1) {
            setLoginType(1)
          }
          try {
            localStorage.setItem('loginUserId', data.id) // 记录登录的商家id
            var loginType = data.type
            if((data.type == 1 || data.type == 3) && getLoginType() == 0) { // 表示是管理员进入子系统
              loginType = -1
            }
            localStorage.setItem('accountType', loginType) // 记录登录的商家登录类型 0: company 1: root 3 admin -1 表示是管理员进入子系统
            commit('SET_ACCOUNT_TYPE', loginType)
          } catch (error) {
            console.error('缓存满了，shift+ctrl+delete清除缓存')
          }
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeLoginType()
          removeToken() // token清除掉
          sessionStorage.removeItem('loginTime') // 登录时间清除掉
          localStorage.removeItem('loginUserId')
          localStorage.removeItem('accountType')
          sessionStorage.removeItem(`${user.state.adminUserId}experienceList`)
          sessionStorage.removeItem(`${user.state.adminUserId}customerList`)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOutNoApi({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeLoginType()
          removeToken() // token清除掉
          sessionStorage.removeItem('loginTime') // 登录时间清除掉
          localStorage.removeItem('loginUserId')
          localStorage.removeItem('accountType')
          sessionStorage.removeItem(`${user.state.adminUserId}experienceList`)
          sessionStorage.removeItem(`${user.state.adminUserId}customerList`)
          resolve()
        } catch {
          reject(error)
        }
      })
    },

    // 切换账号时候,登出子系统
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        localStorage.removeItem('loginUserId')
        localStorage.removeItem('accountType')
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
