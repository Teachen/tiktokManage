import store from '@/store'

/**
 * admin子账号权限
 */
// 此页面里面的函数，都是在状态管理里面取值
export function pageApprove() { // 是否有绑定微信页面
  return store.getters.adminPermission.indexOf('renewalApprove') != -1 ||
  store.getters.adminPermission.indexOf('baseApprove') != -1 ||
  store.getters.adminPermission.indexOf('baseCustomerList') != -1 ||
  store.getters.adminPermission.indexOf('renewalCustomerList') != -1 ||
  store.getters.adminPermission.indexOf('succeedCustomerList') != -1 ||
  store.getters.adminPermission.indexOf('tikTokManagement') != -1 ||
  store.getters.roles.indexOf('root') != -1
}
// export function renewalApply() { // 申请续费 （申请续费权限或者总部管理员）
//   return store.getters.adminPermission.indexOf('renewalApply') != -1 || store.getters.roles.indexOf('root') != -1
// }
// export function customerApply() { // 申请人绑定微信权限 （申请续费权限或者总部管理员或者客户列表的申请）
//   return store.getters.adminPermission.indexOf('customerList') != -1 || store.getters.roles.indexOf('root') != -1
// }
export function isRoot() { // 是否是root总部管理员
  return store.getters.roles.indexOf('root') != -1
}

export function getRoles() { // 是否是root总部管理员
  return store.getters.roles
}

// 基础组
export function basicServiceLeader() { // 组长
  return store.getters.adminPermission.indexOf('basicServiceLeader') != -1
}
export function baseApprove() { // 审批
  return store.getters.adminPermission.indexOf('baseApprove') != -1
}
export function baseCustomerList() { // 列表
  return store.getters.adminPermission.indexOf('baseCustomerList') != -1
}
export function baseDeliveryList() { // 交付列表
  return store.getters.adminPermission.indexOf('baseDeliveryList') != -1
}
export function baseFinancial() { // 交付列表财务权限
  return store.getters.adminPermission.indexOf('baseFinancial') != -1
}
// 续费组
export function renewalLeader() { // 组长
  return store.getters.adminPermission.indexOf('renewalLeader') != -1
}
export function renewalCustomerList() { // 列表
  return store.getters.adminPermission.indexOf('renewalCustomerList') != -1
}
export function renewalApprove() { // 审批
  return store.getters.adminPermission.indexOf('renewalApprove') != -1
}
export function renewalFinancial() { // 续费组财务权限
  return store.getters.adminPermission.indexOf('renewalFinancial') != -1
}
// 成功组
export function succeedLeader() { // 组长
  return store.getters.adminPermission.indexOf('succeedLeader') != -1
}
export function succeedCustomerList() { // 列表
  return store.getters.adminPermission.indexOf('succeedCustomerList') != -1
}
export function operatingApply() { // 申请
  return store.getters.adminPermission.indexOf('operatingApply') != -1
}
// 运营列表审批权限
export function operatingApproval() { // 审批
  return store.getters.adminPermission.indexOf('operatingApproval') != -1
}// 运营列表申请权限

// 需求工单-操作权限
export function requireOrderServiceOpt() { // 服务部操作权限
  return store.getters.adminPermission.indexOf('requireOrderServiceOpt') != -1
}
// 需求工单-全部操作权限
export function requireOrderTotalOpt() { // 全部操作权限
  return store.getters.adminPermission.indexOf('requireOrderTotalOpt') != -1
}

/**
 * 获取所有模块
 */
export function enableModules() {
  return store.getters.enableModules
}
// 获取所有权限
export function allPermission() {
  return store.getters.permission
}

/*
 *平台ID
 */
export function companyId() {
  return store.getters.enableModules.companyId
}
export function encodeCompanyId() {
  return store.getters.encodeCompanyId
}
// 子系统
export function isStaff() {
  return store.getters.staff
}

/**
 * 到期时间
 */
export function companyExpireTime() {
  return store.getters.enableModules.expireTime
}

/**
 * 公司版本
 */
export function companyVersion() {
  return store.getters.enableModules.version
}

/**
 *初始版本
 */
export function initialVersion() {
  return store.getters.enableModules.initialVersion
}
/**
 * 是否开启分销商城
 */
export function enableDistributionMarketModule() {
  return store.getters.enableModules.enableDistributionMarketModule == 1
}

/**
 * 抖音小程序权限
 */

export function shopManage_tiktokCategory() {
  return store.getters.enableModules.enableDyShop == 1
}
