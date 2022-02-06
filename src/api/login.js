import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
export function loginByMobile(data) { // 新版权限增加，通过手机号验证码登录
  return request({
    url: '/appAuth/loginByMobile',
    method: 'post',
    data
  })
}
export function login(data) { // 新版权限增加，多店铺通过用户名密码登录
  return request({
    url: '/appAuth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}

export function loginProxy(companyId) {
  return request({
    url: '/auth/loginProxy',
    method: 'get',
    params: { companyId }
  })
}

export function getCaptcha() {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}
export function sendMessage(data) {
  return request({
    url: '/personalModel/sendCode',
    method: 'post',
    data
  })
}
export function passwordSendMessage(data) {
  return request({
    url: '/personalModel/sendCode2',
    method: 'post',
    data
  })
}
export function confirmRegister(data) {
  return request({
    url: '/personalModel/register',
    method: 'post',
    data
  })
}
export function confirmModifyPassword(data) {
  return request({
    url: '/personalModel/resetPw',
    method: 'post',
    data
  })
}
// 多店铺忘记密码接口 要返回多店铺列表的
export function resetPw(data) {
  return request({
    url: '/appAuth/resetPw',
    method: 'post',
    data
  })
}
// 忘记密码发送验证码 （数字加字母的验证码）
export function sendCodeByForget(data) {
  return request({
    url: '/appAuth/sendCodeByForget',
    method: 'post',
    data
  })
}

// 发送验证码
export function appSendCode(data) {
  return request({
    url: '/appAuth/sendCode',
    method: 'post',
    data
  })
}
/** --------内训相关分割线---------- */
// 内训账号创建
export function createEtAccount(data) {
  return request({
    url: '/kpEtRelates/createEtAccount',
    method: 'post',
    data
  })
}
// 获取关联内训账号
export function getEtAccount(data) {
  return request({
    url: '/kpEtRelates/getEtAccount',
    method: 'get',
    params: data
  })
}
// 获取内训登录token
export function getEtAccountToken(data) {
  return request({
    url: '/kpEtRelates/getEtAccountToken',
    method: 'get',
    params: data
  })
}
