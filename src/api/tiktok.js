import request from '@/utils/request'
// 获取分类列表
export function getCourseCategoryList(query) {
  return request({
    url: '/ttapi/course-categories',
    method: 'get',
    params: query
  })
}

// 分类排序
export function moveSort(params) {
  return request({
    url: `/ttapi/common/moveSort`,
    method: 'get',
    params
  })
}

// 获取轮播图列表
export function getCarouselImgList(data) {
  return request({
    url: `/ttapi/carouselImg/getCarouselImgList`,
    method: 'post',
    data
  })
}

// 轮播设置排序
export function saveSort(data) {
  return request({
    url: `/ttapi/carouselImg/saveSort`,
    method: 'post',
    data
  })
}

// 获取单个轮播图
export function getCarouselImg(carouselImgId) {
  return request({
    url: `/ttapi/carouselImg/getCarouselImg/${carouselImgId}`,
    method: 'get'
  })
}

// 保存轮播图
export function saveCarouselImg(data) {
  return request({
    url: '/ttapi/carouselImg/saveCarouselImg',
    method: 'post',
    data
  })
}

// 删除轮播图
export function deleteCarouseImg(carouselImgId) {
  return request({
    url: `/ttapi/carouselImg/deleteCarouselImg/${carouselImgId}`,
    method: 'post'
  })
}

// 获取分类列表，用于下拉
export function getAllCategoryList(pId) {
  return request({
    url: `/ttapi/category/getAllCategoryList/${pId}`,
    method: 'get'
  })
}

// 获取分类列表
export function getCategoryList(data) {
  return request({
    url: '/ttapi/category/getCategoryList',
    method: 'post',
    data
  })
}

// 删除分类
export function deleteCategory(categoryId) {
  return request({
    url: `/ttapi/category/deleteCategory/${categoryId}`,
    method: 'post'
  })
}

// 保存分类
export function saveCategory(data) {
  return request({
    url: '/ttapi/category/saveCategory',
    method: 'post',
    data
  })
}

// 获取单个分类信息
export function getCategoryData(categoryId) {
  return request({
    url: `/ttapi/category/getCategoryData/${categoryId}`,
    method: 'get'
  })
}

// 分类设置排序
export function saveCategorySort(data) {
  return request({
    url: '/ttapi/category/saveSort',
    method: 'post',
    data
  })
}

// 获取审核记录
export function getCheckList(data) {
  return request({
    url: '/ttapi/prodCheck/getCheckList',
    method: 'post',
    data
  })
}

// 产品审核
export function auditCheck(data) {
  return request({
    url: '/ttapi/prodCheck/auditCheck',
    method: 'post',
    data
  })
}

// 获取联系方式
export function getCompanyInfoForCheckId(checkId) {
  return request({
    url: `/ttapi/prodCheck/getCompanyInfoForCheckId/${checkId}`,
    method: 'get'
  })
}

// 获取审核单信息
export function getCheckById(checkId) {
  return request({
    url: `/ttapi/prodCheck/getCheckById/${checkId}`,
    method: 'get'
  })
}

// 迁移分类排序
export function saveRelateSort(data) {
  return request({
    url: '/ttapi/category/saveRelateSort',
    method: 'post',
    data
  })
}

// 编辑查看商品信息
export function getProdInfo(checkId) {
  return request({
    url: `/ttapi/prodInfo/getProdInfo/${checkId}`,
    method: 'get'
  })
}

// Admin 获取所有音视频目录
export function getAllCatalogue(checkId, data) {
  return request({
    url: `/ttapi/prodInfo/getAllCatalogue/${checkId}`,
    method: 'get',
    params: data
  })
}

// 获取分类内容管理列表
export function getProdCategoryRelateList(data) {
  return request({
    url: '/ttapi/category/getProdCategoryRelateList',
    method: 'post',
    data
  })
}

// 分类内容迁移分类
export function updateProdCategory(data) {
  return request({
    url: '/ttapi/category/updateProdCategory',
    method: 'post',
    data
  })
}

// 分类内容删除课程目录
export function delProdCategoryRelate(prodId) {
  return request({
    url: `/ttapi/category/delProdCategoryRelate/${prodId}`,
    method: 'post'
  })
}

// 批量删除课程目录
export function delProdCategoryRelateBatch(data) {
  return request({
    url: '/ttapi/category/delProdCategoryRelateBatch',
    method: 'post',
    data
  })
}

// 批量迁移分类
export function updateProdCategoryBatch(data) {
  return request({
    url: '/ttapi/category/updateProdCategoryBatch',
    method: 'post',
    data
  })
}

// 获取商品列表
export function adminProdList(data) {
  return request({
    url: '/ttapi/prodInfo/adminProdList',
    method: 'post',
    data
  })
}

// 官网链接获取
// export function getDictItems(data) {
//   return request({
//     url: `/ttapi/dict/getDictItemsPage/official_link`,
//     method: 'get',
//     params: data
//   })
// }
// 获取跳转连接
export function getLinkDictList(data) {
  return request({
    url: `/ttapi/dict/getLinkDictList`,
    method: 'get',
    params: data
  })
}

// 订单查询
export function searchOrdersList(data) {
  return request({
    url: '/ttapi/orders/searchOrdersList',
    method: 'post',
    data
  })
}

// 分销明细查询
export function searchDistributionDealings(data) {
  return request({
    url: '/ttapi/distributionDealings/searchDistributionDealings',
    method: 'post',
    data
  })
}

// 意向申请列表
export function getIntendedList(status) {
  return request({
    url: `/ttapi/talentManage/list`,
    method: 'get',
    params: status
  })
}

// 意向申请列表修改
export function editIntendedList(data) {
  return request({
    url: '/ttapi/talentManage/edit',
    method: 'post',
    data
  })
}

// 入驻达人分页查询
export function settleInPage(status) {
  return request({
    url: `/ttapi/talentManage/settleInPage`,
    method: 'get',
    params: status
  })
}

// 提现记录查询
export function adminPageWithdrawLogs(data) {
  return request({
    url: '/ttapi/withdrawLogs/adminPageWithdrawLogs',
    method: 'post',
    data
  })
}

// 提现审核通过
export function auditApproved(data) {
  return request({
    url: '/ttapi/withdrawLogs/approved',
    method: 'post',
    data
  })
}

// 提现审核不通过
export function auditReject(data) {
  return request({
    url: '/ttapi/withdrawLogs/reject',
    method: 'post',
    data
  })
}

// 已通过异常处理
export function prodErrorDeal(data) {
  return request({
    url: `/ttapi/prodCheck/prodErrorDeal`,
    method: 'post',
    data
  })
}

// 作品类别
export function getDictItems() {
  return request({
    url: `/ttapi/dict/getDictItems/talent_type`,
    method: 'get'
  })
}

// 部署达人添加客户
export function setTodePloy(data) {
  return request({
    url: `/ttapi/talentManage/todeploy`,
    method: 'post',
    data
  })
}

// 编辑达人添加客户
export function editTodePloy(data) {
  return request({
    url: `/ttapi/talentManage/editTalent`,
    method: 'post',
    data
  })
}

// 达人详情查看
export function getViewTalent(query) {
  return request({
    url: `/ttapi/talentManage/viewTalent`,
    method: 'get',
    params: query
  })
}

// 入驻达人信息修改
export function setEditTalent(data) {
  return request({
    url: `/ttapi/talentManage/editTalent`,
    method: 'post',
    data
  })
}

// 重新召回
export function setRecall(data) {
  return request({
    url: `/ttapi/talentManage/recall`,
    method: 'post',
    data
  })
}

// 获取专区列表
export function getSectionList() {
  return request({
    url: `/ttapi/section/getSectionList`,
    method: 'post'
  })
}

// 设置专区内容
export function saveSection(data) {
  return request({
    url: `/ttapi/section/saveSection`,
    method: 'post',
    data
  })
}

// 获取专区内容列表
export function getSectionContentList(data) {
  return request({
    url: `/ttapi/section/getSectionContentList`,
    method: 'post',
    data
  })
}

// 设置专区内容精选
export function setSectionContentHot(data) {
  return request({
    url: `/ttapi/section/setSectionContentHot`,
    method: 'post',
    data
  })
}

// 删除专区内容
export function deleteSectionContent(sectionContentId) {
  return request({
    url: `/ttapi/section/deleteSectionContent/${sectionContentId}`,
    method: 'post'
  })
}

// 批量删除专区内容
export function deleteSectionContentBatch(data) {
  return request({
    url: `/ttapi/section/deleteSectionContentBatch`,
    method: 'post',
    data
  })
}

// 协议书列表
export function protocolList(query) {
  return request({
    url: `/ttapi/talentManage/protocolList`,
    method: 'get',
    params: query
  })
}

// 入驻达人列表筛选主体
export function getSubjectType() {
  return request({
    url: `/ttapi/dict/getDictItems/subject_type`,
    method: 'get'
  })
}

// 放弃入驻
export function setGiveup(data) {
  return request({
    url: `/ttapi/talentManage/giveup`,
    method: 'post',
    data
  })
}

// 设置小程序审核类型

export function setAppCheckProdRelate(data) {
  return request({
    url: `/ttapi/appCheck/setAppCheckProdRelate`,
    method: 'post',
    data
  })
}

// 获取达人列表
export function searchTalentList(data) {
  return request({
    url: `/ttapi/talentManage/searchTalentList`,
    method: 'post',
    data
  })
}

// 添加或移除专区内容
export function modifySectionContent(data) {
  return request({
    url: `/ttapi/section/modifySectionContent`,
    method: 'post',
    data
  })
}

// 产品弹窗通用查询
export function getSearchProd(data) {
  return request({
    url: `/ttapi/common/searchProd`,
    method: 'post',
    data
  })
}

// 设置排序
export function setSort(data) {
  return request({
    url: `/ttapi/common/setSort`,
    method: 'post',
    data
  })
}

// 数据分析实时概览
export function getRealTimeView(params) {
  return request({
    url: `/ttapi/adminDataStatistics/realTimeView`,
    method: 'get',
    params
  })
}

// 核心指标数据
export function getPlatformCore(params) {
  return request({
    url: `/ttapi/adminDataStatistics/platformCore`,
    method: 'get',
    params
  })
}

// 核心指标数据折线图
export function getPlatformCoreOption(params) {
  return request({
    url: `/ttapi/adminDataStatistics/platformCoreOption`,
    method: 'get',
    params
  })
}

// 成交TOP5达人
export function getTalentDealTop(params) {
  return request({
    url: `/ttapi/adminDataStatistics/talentDealTop`,
    method: 'get',
    params
  })
}

// 成交榜TOP商品
export function getProdDealTop(params) {
  return request({
    url: `/ttapi/adminDataStatistics/prodDealTop`,
    method: 'get',
    params
  })
}

// 运营计划-产品动态
export function saveOperationalSettings(data) {
  return request({
    url: `/ttapi/opSettings/saveOperationalSettings`,
    method: 'post',
    data
  })
}

// 获取运营设置
export function getOsData(params) {
  return request({
    url: `/ttapi/opSettings/getOsData`,
    method: 'get',
    params
  })
}

// 获取老师小程序列表
export function getCompanyAppVersionAdminList(data) {
  return request({
    url: '/ttapi/microApp/getCompanyAppVersionAdminList',
    method: 'post',
    data
  })
}

// 获取老师小程序版本统计
export function getCompanyAppVersionStatistics(imType) {
  return request({
    url: `/ttapi/microApp/getCompanyAppVersionStatistics/${imType}`,
    method: 'get'
  })
}

// 小程序提审_admin端
export function auditAdmin(companyId, data) {
  return request({
    url: `/ttapi/microApp/auditAdmin/${companyId}`,
    method: 'post',
    data
  })
}

// 服务商代小程序进件
export function getAppMerchant(companyId, data) {
  return request({
    url: `/ttapi/openPlat/getAppMerchant/${companyId}`,
    method: 'post',
    data
  })
}

// 保存开屏广告
export function saveOperationalSettingsForAd(data) {
  return request({
    url: `/ttapi/opSettings/saveOperationalSettingsForAd`,
    method: 'post',
    data
  })
}

// 获取开屏广告
export function getOsDataForAd() {
  return request({
    url: `/ttapi/opSettings/getOsDataForAd`,
    method: 'get'
  })
}

// 小程序发布_admin端
export function setRelease(companyId, data) {
  return request({
    url: `/ttapi/openPlat/release/${companyId}`,
    method: 'post',
    data
  })
}

// 获取抖音分类列表，用于下拉
export function getDyAllCategoryList(pId) {
  return request({
    url: `/ttapi/category/getDyAllCategoryList/${pId}`,
    method: 'get'
  })
}
