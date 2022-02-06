import request from '@/utils/request'
// 公共接口
export function getDatumByCompanyId() {
  return request({
    url: '/datum/getAllDatum',
    method: 'post'
  })
}
// 获取省市区数据
export function getAreaList(parentId) {
  if (parentId === undefined || parentId === null) {
    parentId = 0
  }

  return request({
    url: `common/areaList`,
    method: 'get',
    params: { parentId }
  })
}

export function getSocialByCompanyId() {
  return request({
    url: '/social/getAllSocial',
    method: 'post'
  })
}

export function getExamByCompanyId() {
  return request({
    url: '/exam/getAllExam',
    method: 'post'
  })
}

export function toGetCompanyInfo() {
  return request({
    url: '/common/getCompanyInfo',
    method: 'get'
  })
}

export function toGetRelData(data) {
  return request({
    url: '/common/toGetRelData',
    method: 'post',
    params: data
  })
}
export function getModelPermission(data) {
  return request({
    url: '/permission/getModelPermission',
    method: 'post',
    params: data
  })
}
export function getQRCodeImage(data) {
  return request({
    url: '/common/getQRCodeImg',
    method: 'post',
    params: data
  })
}
export function updateSort(data, tableId) {
  return request({
    url: '/common/updateSort/' + tableId,
    method: 'post',
    params: data
  })
}
export function toSaveSort(data) {
  return request({
    url: 'exam/toSaveSort',
    method: 'post',
    data
  })
}
export function setSetting(data) {
  return request({
    url: 'extend/setSetting',
    method: 'post',
    data
  })
}
export function getSetting(data) {
  return request({
    url: 'extend/',
    method: 'get',
    params: data
  })
}
export function getAgentName(data) {
  return request({
    url: '/common/getAgentName',
    method: 'get'
  })
}

// 获取要设置抽成比例的列表（新模式用到）
export function getProdList(query) {
  return request({
    url: 'common/getProdList',
    method: 'get',
    params: query
  })
}
// 保存比例设置
export function saveCommissionRate(id, data) {
  return request({
    url: `common/saveCommissionRate/${id}`,
    method: 'post',
    data
  })
}

// 获取二维码(新)
export function getQrcodeImg(query) {
  return request({
    url: '/common/qrcodeImg',
    method: 'get',
    params: query
  })
}

// 统计访问信息 客户数据分析用到
export function visitStat(data) {
  return request({
    url: `/common/visitStat`,
    method: 'post',
    data
  })
}

// 获取体验二维码
export function getExpCodeImg(query) {
  return request({
    url: '/common/expCodeImg',
    method: 'get',
    params: query
  })
}
// 获取体验二维码
export function relatedGoods(params) {
  return request({
    url: '/common/relatedGoods',
    method: 'get',
    params
  })
}

// 将编辑器里面的图片转换成我们的地址（外链图片 例如秀米啊 公众号文章啥的）
export function imgConvert(data) {
  return request({
    url: `/common/imgConvert`,
    method: 'post',
    data
  })
}

// 图片地址上传 （图片数组 编辑器用到）
export function singleImgConvert(data) {
  return request({
    url: `/common/singleImgConvert`,
    method: 'post',
    data
  })
}

// 获取上传的token
export function getUploadToken() {
  return request({
    url: '/common/qiniu/uploadToken',
    method: 'get'
  })
}
