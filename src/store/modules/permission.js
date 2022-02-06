import { asyncRouterMap, constantRouterMap } from '@/router'
import { getLoginType } from '@/utils/auth'
// import { initialVersion, companyExpireTime } from '@/utils/permission'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// roles 代表角色,route代表路由,enableModules代表模块权限，isStaff是否是子账号，adminPermission总系统权限,fullpath用于判断全部路径中总系统的权限。
function hasPermission(roles, route, enableModules, isStaff, adminPermission, fullPath) {
  if (route.meta) {
    // if (route.meta.roles) {
    //   if (!roles.some(role => route.meta.roles.indexOf(role) >= 0)) {
    //     return false
    //   }
    // }
    // 子账号
    if (route.meta.isStaff) {
      return parseInt(isStaff) < 1
    }
    //
    if (route.meta.isCompany) {
      const type = getLoginType()
      if (type == null || type == 1 || type == 3) {
        return false
      }
    }
    // admin后台
    if (route.meta.isAdmin) {
      const type = getLoginType()
      if (type == null || type == 0) {
        return false
      }

      if (type == 3) { // admin的子账号才判断权限
        let res = false
        // 找的到客户列表
        if (adminPermission.indexOf('customerManagement') == -1 && (adminPermission.indexOf('customerList') != -1 || adminPermission.indexOf('experienceList') != -1 || adminPermission.indexOf('distributionCustomerList') != -1)) {
          adminPermission.push('customerManagement')
        }
        // 找得到需求工单
        if (adminPermission.indexOf('needList') == -1 && (adminPermission.indexOf('requireOrderTotalOpt') != -1 || adminPermission.indexOf('requireOrderServiceOpt') != -1)) {
          // 有需求工单的子集（服务部操作和全部操作） 那就 添加需求工单的菜单
          adminPermission.push('needList')
        }
        if (adminPermission.indexOf('workOrderSystem') == -1 && (adminPermission.indexOf('needList') != -1 || adminPermission.indexOf('complainList') != -1)) {
          adminPermission.push('workOrderSystem')
        }
        // adminPermission.indexOf('tikTokIntendApply_edit') != -1 || adminPermission.indexOf('tikTokIntendApply_look') != -1 || adminPermission.indexOf('tikTokIntendApply_look_standard') != -1
        adminPermission.find(i => i.includes('tikTokIntendApply')) && adminPermission.indexOf('tikTokIntendApply') == -1 && adminPermission.push('tikTokIntendApply')

        // if (adminPermission.indexOf('tikTokSettleTalent_look') != -1 || adminPermission.indexOf('tikTokSettleTalent_edit') != -1) {
        adminPermission.find(i => i.includes('tikTokSettleTalent')) && adminPermission.indexOf('tikTokSettleTalent') == -1 && adminPermission.push('tikTokSettleTalent')
        // }

        // if (adminPermission.indexOf('tikTokGiveUpInto_look') != -1 || adminPermission.indexOf('tikTokGiveUpInto_edit') != -1) {
        adminPermission.find(i => i.includes('tikTokGiveUpInto')) && adminPermission.indexOf('tikTokGiveUpInto') == -1 && adminPermission.push('tikTokGiveUpInto')
        // }

        adminPermission.find(i => i.includes('tikTokdataAnalysis')) && adminPermission.indexOf('tikTokAnalysis') == -1 && adminPermission.push('tikTokAnalysis')

        if (adminPermission.indexOf('tikTokGiveUpInto') != -1 || adminPermission.indexOf('tikTokSettleTalent') != -1 || adminPermission.indexOf('tikTokIntendApply') != -1) {
          adminPermission.indexOf('tikTokIntalent') == -1 && adminPermission.push('tikTokIntalent')
        }
        // , 'tikTokIntendApply', 'tikTokSettleTalent', 'tikTokGiveUpInto', 'tikTokIntendApply_look', 'tikTokIntendApply_edit',
        // 'tikTokSettleTalent_look', 'tikTokSettleTalent_edit', 'tikTokGiveUpInto_look', 'tikTokGiveUpInto_edit'

        const tiktokArr = ['tikTokDecorate', 'tikTokIntalent', 'tikTokAudit', 'tikTokClassification', 'tikTokAnalysis', 'tikTokOperatingSet', 'tikTokVersioning']
        if (adminPermission.indexOf('tikTokManagement') == -1 && adminPermission.filter(i => tiktokArr.includes(i)).length > 0) { // 找得到抖音小程序管理的
          adminPermission.push('tikTokManagement')
        }

        var businessPlatArr = ['opeAdv', 'proDyn', 'shopTemplate', 'notice', 'authorizeTutorials',
          'version', 'successCase', 'wxapp', 'iosGzhPayConfs', 'feedback', 'inviteCard', 'illegalReport', 'messagePush']

        if (adminPermission.indexOf('businessPlat') == -1 && adminPermission.filter(i => businessPlatArr.includes(i)).length > 0) { // 找得到商家平台的
          adminPermission.push('businessPlat')
        }

        var distributionArr = ['distributionDecorate', 'distributionCategory', 'contentReview']
        if (adminPermission.indexOf('distributionManagement') == -1 && adminPermission.filter(i => distributionArr.includes(i)).length > 0) { // 找得到内容管理的
          adminPermission.push('distributionManagement')
        }
        var financeArr = ['costSetting', 'widthdrawManagement', 'transaction', 'orderManagement', 'invoiceExamine']
        if (adminPermission.indexOf('financialManagement') == -1 && adminPermission.filter(i => financeArr.includes(i)).length > 0) { // 找得到财务管理的
          adminPermission.push('financialManagement')
        }
        var abnormalArr = ['authError', 'smsWarning', 'transcodeList', 'smsRecord', 'assistTool', 'materialMigration']
        if (adminPermission.indexOf('customerAbnormal') == -1 && adminPermission.filter(i => abnormalArr.includes(i)).length > 0) { // 找得到客户异常的
          adminPermission.push('customerAbnormal')
        }
        // 用户数据：userData_C
        // 客户数据：customerData_B
        var dataAnylyArr = ['liveData']
        if (adminPermission.indexOf('dataAnalysis') == -1 && adminPermission.filter(i => dataAnylyArr.includes(i)).length > 0) { // 数据分析
          adminPermission.push('dataAnalysis')
        }
        for (let i = 0; i < adminPermission.length; i++) {
          if (fullPath.indexOf(adminPermission[i]) == -1) {
            continue
          }
          res = true
        }
        return res
      }
    }

    if (route.meta.isAccount) {
      if (parseInt(isStaff) == 1) {
        return false
      }
    }
    if (route.meta.isRoot) { // 是否是总管理员
      return roles.indexOf('root') != -1
    }
  }

  return true
}
// 用于拼接完整路径。
function formatPath(rootPath, path) {
  let fullPath = ''
  fullPath = path
  // if (rootPath == '') {
  //   fullPath = path
  // } else {
  //   fullPath = rootPath + '/' + path
  // }
  return fullPath
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles, enableModules, staff, adminPermission, rootPath = '') {
  const accessedRouters = asyncRouterMap.filter(route => {
    const fullPath = formatPath(rootPath, route.path)
    if (hasPermission(roles, route, enableModules, staff, adminPermission, fullPath)) {
      // 递归遍历子路由
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles, enableModules, staff, adminPermission, route.path)
      }
      return true
    }
    return false
  })
  // 递归过后，返回用户可以访问的路由。
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    enableModules: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ state, commit, rootState }, data) {
      return new Promise(resolve => {
        const { roles, staff, permission } = data
        // let accessedRouters
        // if (roles.indexOf('admin') >= 0) {
        // accessedRouters = asyncRouterMap
        // } else {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles, rootState.user.enableModules, rootState.user.staff, rootState.user.adminPermission)
        /* if (staff == 1) {
            accessedRouters = [];
            for (let i=0; i<permission.length; i++) {
              let pfName = permission[i].name;
              let arr = [];
              for (let m=0;m<asyncRouterMap.length;m++) {
                if (pfName == asyncRouterMap[m].path) {
                  arr.push(asyncRouterMap[m]);
                  let arrChildren = [];
                  for (let j=0; j<permission[i].children.length; j++) {
                    let cfName = permission[i].children.name
                    for (let n = 0; n<asyncRouterMap[m].children.length; n++) {
                      if(cfName == asyncRouterMap[m].children[n].path) {
                        arrChildren.push(asyncRouterMap[m].children[n]);
                      }
                    }
                  }

                }
              }

            }

          }else {
            accessedRouters = filterAsyncRouter(asyncRouterMap, roles, rootState.user.enableModules)
          }*/
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
