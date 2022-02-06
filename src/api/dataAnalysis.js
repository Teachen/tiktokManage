import request from '@/utils/request'

// 直播场次实时数据
export function getLiveNumber(params) {
  return request({
    url: '/adminMajor/analysis/live/getLiveNumber',
    method: 'get',
    params
  })
}

// 直播统计数据（大班课）
export function getLiveData(params) {
  return request({
    url: '/adminMajor/analysis/live/getLiveData',
    method: 'get',
    params
  })
}

// 直播统计数据（小班课）
export function getClassData(params) {
  return request({
    url: '/adminMajor/analysis/live/getClassData',
    method: 'get',
    params
  })
}

// 直播每日总流量统计
export function getLiveFlow(params) {
  return request({
    url: '/adminMajor/analysis/live/getLiveFlow',
    method: 'get',
    params
  })
}

// 每日直播间参与人数TOP3
export function getLivePeopleTop(params) {
  return request({
    url: '/adminMajor/analysis/live/getLivePeopleTop',
    method: 'get',
    params
  })
}
// 每日直播流量详细列表
export function getFlowDetailList(params) {
  return request({
    url: '/adminMajor/analysis/live/getFlowDetailList',
    method: 'get',
    params
  })
}
