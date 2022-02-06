import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const LoginTypeKey = 'Login-Type'
const companyNameKey = 'Company-Name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { secure: document.location.protocol == 'https:' })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLoginType(val) {
  return Cookies.set(LoginTypeKey, val, { secure: document.location.protocol == 'https:' })
}

export function getLoginType() {
  return Cookies.get(LoginTypeKey)
}

export function removeLoginType() {
  return Cookies.remove(LoginTypeKey)
}

export function setCompanyName(val) {
  return Cookies.set(companyNameKey, val, { secure: document.location.protocol == 'https:' })
}

export function getCompanyName() {
  return Cookies.get(companyNameKey)
}

export function removeCompanyName() {
  return Cookies.remove(companyNameKey)
}

export function setSidebarStatus(val) {
  Cookies.set('sidebarStatus', val, { secure: document.location.protocol == 'https:' })
}
