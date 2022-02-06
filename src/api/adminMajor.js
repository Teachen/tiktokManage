import request from '@/utils/request'
export function getAccountList(data) {
  return request({
    url: '/adminMajor/accounts',
    method: 'get',
    params: data
  })
}
export function saveAccount(data) {
  return request({
    url: '/adminMajor/accounts',
    method: 'post',
    data
  })
}
export function updateAaccountInfo(id, data) {
  return request({
    url: `/adminMajor/accounts/${id}`,
    method: 'put',
    data
  })
}
export function editAccount(id) {
  return request({
    url: `/adminMajor/accounts/${id}/edit`,
    method: 'get'
  })
}
export function deleteAccount(id) {
  return request({
    url: `/adminMajor/accounts/${id}`,
    method: 'delete'
  })
}
export function batchDelAccount(data) {
  return request({
    url: '/adminMajor/accounts/deleteAll',
    method: 'delete',
    data
  })
}

// // 开屏广告 接口
export function savePoster(data) {
  return request({
    url: '/adminMajor/notice/savePoster',
    method: 'post',
    data
  })
}

// 店铺公告
export function noticeInfo() {
  return request({
    url: '/adminMajor/notice/noticeInfo',
    method: 'get'
  })
}

export function noticeUpdate(data) {
  return request({
    url: '/adminMajor/notice/noticeUpdate',
    method: 'post',
    data
  })
}
