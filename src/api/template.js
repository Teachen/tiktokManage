import request from '@/utils/request'
export function templateList(data) {
  return request({
    url: '/adminMajor/theme/themeList',
    method: 'get',
    params: data
  })
}
export function toWingding(data) {
  return request({
    url: '/adminMajor/theme/toWinding',
    method: 'get',
    params: data
  })
}

export function getThemeInfo(id) {
  return request({
    url: `/adminMajor/theme/getThemeInfo/${id}`,
    method: 'get'
  })
}
export function saveTheme(data) {
  return request({
    url: '/adminMajor/theme/saveThemes',
    method: 'post',
    data
  })
}
// ----------------------------------------

export function getAPPBottomNav(data) {
  return request({
    url: '/shopManage/getAPPBottomNav',
    method: 'get'
  })
}
export function saveAPPBottomNav(data) {
  return request({
    url: '/shopManage/saveAPPBottomNav',
    method: 'post',
    data
  })
}
export function customTemplatesShow(data) {
  return request({
    url: '/shopManage/customTemplatesShow',
    method: 'get',
    params: data
  })
}

export function getAppConfs(data) {
  return request({
    url: '/shopManage/getAppConfs',
    method: 'get',
    params: data
  })
}
export function saveAppConfs(data) {
  return request({
    url: '/shopManage/saveAppConfs',
    method: 'post',
    data
  })
}

export function getAppPersonalThemeInfo(data) {
  return request({
    url: '/shopManage/getAppPersonalThemeInfo',
    method: 'get',
    params: data
  })
}

export function memberProject(data) {
  return request({
    url: '/shopManage/memberProject',
    method: 'get',
    params: data
  })
}
export function saveMemberProject(data) {
  return request({
    url: '/shopManage/saveMemberProject',
    method: 'post',
    data
  })
}

export function wechatManageIndex(data) {
  return request({
    url: '/shopManage/wechatManage/pageIndex',
    method: 'get',
    params: data
  })
}

export function enableTemplate(data) {
  return request({
    url: '/shopManage/wechatManage/enableTemplate',
    method: 'post',
    data
  })
}

export function getProtocol(data) {
  return request({
    url: '/shopManage/getProtocol',
    method: 'get',
    params: data
  })
}

export function saveProtocol(data) {
  return request({
    url: '/shopManage/saveProtocol',
    method: 'post',
    data
  })
}

export function getCustomOfficialTemplates(id) {
  return request({
    url: `/shopManage/getCustomOfficialTemplates/${id}`,
    method: 'get'
  })
}

export function getmbCourses(catId, sort, tp, page) {
  return request({
    url: `/shopManage/getCourses?catId=${catId}&sort=${sort}&p=${tp}&page=${page}`,
    method: 'get'
  })
}

export function saveThemeTemplate(data) {
  return request({
    url: '/shopManage/wechatManage/saveThemeTemplate',
    method: 'post',
    data
  })
}

export function getFansActivityList(data) {
  return request({
    url: '/activity/fans/getFansActivityList',
    method: 'post',
    data
  })
}

export function setFansActivity(data) {
  return request({
    url: '/activity/fans/setFansActivity',
    method: 'post',
    data
  })
}

export function getFansActivityData(data) {
  return request({
    url: '/activity/fans/getFansActivityData',
    method: 'post',
    data
  })
}

export function deleteFansActivity(data) {
  return request({
    url: '/activity/fans/deleteFansActivity',
    method: 'post',
    data
  })
}

export function setFansActivityStatus(data) {
  return request({
    url: '/activity/fans/setFansActivityStatus',
    method: 'post',
    data
  })
}

export function getFansActivityQrcode(data) {
  return request({
    url: '/activity/fans/getFansActivityQrcode',
    method: 'post',
    data
  })
}
