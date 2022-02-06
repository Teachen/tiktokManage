import request from '@/utils/request'
export function getWithdrawInfo(query, type) {
  if (type == 2 || type == 3) {
    return request({
      url: '/personalModel/getWithdrawInfo',
      method: 'get',
      params: query
    })
  }

  if (type == 1) {
    return request({
      url: '/personalModel/userWithdrawInfo',
      method: 'get',
      params: query
    })
  }
}
export function withdrawList(query) {
  return request({
    url: '/personalModel/withdrawList',
    method: 'get',
    params: query
  })
}
export function applyWithdraw(type) {
  return request({
    url: `/personalModel/applyBaseInfo/${type}`,
    method: 'get'
  })
}
export function sureWithdraw(data) {
  return request({
    url: `/personalModel/sureWithdraw`,
    method: 'post',
    data
  })
}
// 分销商城确认提现
export function sureWithdrawForDistribution(data) {
  return request({
    url: `/personalModel/sureWithdrawForDistribution`,
    method: 'post',
    data
  })
}
export function failWithdraw(query) {
  return request({
    url: `/personalModel/failWithdraw`,
    method: 'get',
    params: query
  })
}
export function userWithdrawOk(data) {
  return request({
    url: `/personalModel/userWithdrawOk`,
    method: 'post',
    data
  })
}

export function companyWithdrawOk(data) {
  return request({
    url: `/personalModel/companyWithdrawOk`,
    method: 'post',
    data
  })
}

// 微店渠道商提现列表
export function microWithdrawList(query) {
  return request({
    url: `/channels/withdrawList`,
    method: 'get',
    params: query
  })
}

// 提现通过
export function passWithdraw(data) {
  return request({
    url: `/channels/passWithdraw`,
    method: 'post',
    data
  })
}
