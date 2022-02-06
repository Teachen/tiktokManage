/* import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router) */

import { getLoginType } from '@/utils/auth'
/* Layout */
import Layout from '../views/layout/Layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    name: 'login',
    meta: { title: '登录' }
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true,
    name: 'register',
    meta: { title: '注册' }
  },
  {
    path: '/creatSuccess',
    component: () => import('@/views/login/creatSuccess'),
    hidden: true,
    name: 'creatSuccess',
    meta: { title: '创建成功' }
  },
  // 修改密码的路由
  {
    path: '/modifyPassword',
    component: () => import('@/views/login/modifyPassword'),
    hidden: true,
    name: 'modifyPassword',
    meta: { title: '修改密码' }
  },
  // 修改密码成功
  {
    path: '/modifyPasswordSuccess',
    component: () => import('@/views/login/modifyPasswordSuccess'),
    hidden: true,
    name: 'modifyPasswordSuccess',
    meta: { title: '修改密码成功' }
  },
  {
    path: '/perfectInfo',
    component: () => import('@/views/login/perfectInfo'),
    hidden: true,
    name: 'perfectInfo',
    meta: { title: '完善资料' }
  },
  {
    path: '/selectShop',
    component: () => import('@/views/login/selectShop'),
    hidden: true,
    name: 'selectShop',
    meta: { title: '选择店铺' }
  },
  //
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  //
  {
    path: '/authority',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/layout/noneTemplate/authority'),
        name: 'authority',
        meta: { title: '没有权限', icon: 'icon' }
      }
    ]
  },
  // 404页面的拦截
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  // 这是什么路径？
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { icon: 'home', 'title': 'dashboard', noCache: true }
      }
    ],
    beforeEnter: (to, from, next) => {
      const type = getLoginType()
      if (type == 1 || type == 3) {
        to.meta.title = 'home'
      } else {
        to.meta.title = 'dashboard'
      }
      next()
    }
  },
  {
    path: '/repairPassword',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/admin/components/repairPassword'),
        hidden: true,
        name: 'repairPassword',
        meta: { title: 'repairPassword' }
      }
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  base: '/root/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
/* export default new VueRouter({ // eslint-disable-line
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRouterMap
})*/

// 动态路由表。
export const asyncRouterMap = [
  { // admin客户管理
    path: '/customerManagement',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: 'customerManagement.name',
      isAdmin: true,
      icon: 'lock'
    },
    children: [
      {// 客户列表
        path: 'customerList',
        component: () => import('@/views/admin/customerManagement/customerAdminister/customerList'),
        name: 'customerList',
        meta: { title: 'customerManagement.customerAdminister.name', isAdmin: true }
      },
      {
        path: 'experienceList',
        component: () => import('@/views/admin/experienceCustomer/experienceList'),
        name: 'experienceList',
        meta: { title: 'experienceList.name', isAdmin: true }
      },
      {
        path: 'distributionCustomerList',
        component: () => import('@/views/admin/customerManagement/distributionCustomerList'),
        name: 'distributionCustomerList',
        meta: { title: 'distributionCustomerList.name', isAdmin: true }
      }
    ]
  },
  { // 客户列表子菜单 隐藏路由，编辑页那些
    path: '/customerManagement',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    meta: {
      title: 'customerManagement.name',
      icon: 'lock'
    },
    children: [
      {
        path: 'addCustomer',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/addCustomer'),
        hidden: true,
        name: 'addCustomer',
        meta: { title: 'customerManagement.customerAdminister.addCustomer', noCache: true }
      },
      {
        path: 'editCustomer/:id',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/editCustomer'),
        hidden: true,
        name: 'editCustomer',
        meta: { title: 'customerManagement.customerAdminister.editCustomer', noCache: true }
      },
      {
        path: 'againCustomerC/:id/:caId/:type/:status',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/editCustomer'),
        hidden: true,
        name: 'againCustomerC',
        meta: { title: 'customerManagement.customerAdminister.addCustomer', noCache: true }
      },
      {
        path: 'againCustomerU/:id/:caId/:type/:status',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/editCustomer'),
        hidden: true,
        name: 'againCustomerU',
        meta: { title: 'customerManagement.customerAdminister.editCustomer', noCache: true }
      }
    ]
  },
  { // 客户运营系统
    path: '/customerOperationSystem',
    component: Layout,
    meta: {
    },
    children: [
      {
        path: 'customerOperationSystem',
        meta: { title: 'customerOperationSystem', icon: 'link', iconfont: '&#xe6d6;' }
      }
    ]
  },
  { // admin工单管理
    path: '/workOrderSystem',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: 'workOrder.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'needList', // 需求工单
        component: () => import('@/views/admin/workOrder/needList/index'),
        name: 'needList',
        meta: { title: 'workOrder.needList.name', isAdmin: true }
      },
      {
        path: 'takeDetail/:crId/:status', // 需求工单详情
        component: () => import('@/views/admin/workOrder/needList/takeDetail'),
        name: 'takeDetail',
        hidden: true,
        meta: { title: 'workOrder.needList.takeDetail', noCache: true }
      },
      {
        path: 'takeOrders/:crId/:status', // 需求工单接单
        component: () => import('@/views/admin/workOrder/needList/takeOrders'),
        name: 'takeOrders',
        hidden: true,
        meta: { title: 'workOrder.needList.takeOrders', noCache: true }
      },
      {
        path: 'complainList', // 投诉工单
        component: () => import('@/views/admin/workOrder/complainList/index'),
        name: 'complainList',
        meta: { title: 'workOrder.complainList.name', isAdmin: true }
      }
    ]
  },
  { // 商家平台管理
    path: '/businessPlat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: 'businessPlat.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'opeAdv', // 开屏推送
        component: () => import('@/views/admin/businessPlat/opeAdv/index'),
        name: 'opeAdv',
        meta: { title: 'businessPlat.opeAdv.name', isAdmin: true }
      },
      {
        path: 'proDyn', // 产品动态
        component: () => import('@/views/admin/businessPlat/proDyn/index'),
        name: 'proDyn',
        meta: { title: 'businessPlat.proDyn.name', isAdmin: true }
      },
      {
        path: 'shopTemplate',
        component: () => import('@/views/admin/shopTemplate/templateList'),
        name: 'shopTemplate',
        meta: { title: 'shopTemplate.name', isAdmin: true }
      },
      {
        path: 'notice',
        component: () => import('@/views/admin/notice/index'),
        name: 'notice',
        meta: { title: 'notice.name', noCache: true, isAdmin: true }
      },
      {
        path: 'authorizeTutorials',
        component: () => import('@/views/admin/authorizeTutorials/index'),
        name: 'authorizeTutorials',
        meta: { title: 'authorizeTutorials.name', isAdmin: true }
      },
      {
        path: 'version', // 版本管理
        component: () => import('@/views/admin/businessPlat/version/index'),
        name: 'version',
        meta: { title: 'businessPlat.version.name', isAdmin: true }
      },
      { // 成功案例
        path: 'successCase',
        component: () => import('@/views/admin/successCase/successCaseList'),
        name: 'successCase',
        meta: { title: 'successCase.successCaseList.name', noCache: true, isAdmin: true }
      },
      { // 小程序
        path: 'wxapp',
        component: () => import('@/views/admin/wxapp/xcxManagement'),
        name: 'wxapp',
        meta: { title: 'wxapp.wxapp', noCache: true, isAdmin: true }
      },
      {
        path: 'iosGzhPayConfs', // 虚拟支付设置
        component: () => import('@/views/admin/businessPlat/iosGzhPayConfs/index'),
        name: 'iosGzhPayConfs',
        meta: { title: 'businessPlat.iosGzhPayConfs.name', isAdmin: true }
      },
      { // 问题反馈
        path: 'feedback',
        component: () => import('@/views/admin/feedback/feedbackList'),
        name: 'feedback',
        meta: { title: 'feedback.feedbackList.name', noCache: true, isAdmin: true }
      },
      { // 邀请卡
        path: 'inviteCard',
        component: () => import('@/views/admin/inviteCard/inviteCardList'),
        name: 'inviteCard',
        meta: { title: 'inviteCard.inviteCardList.name', noCache: true, isAdmin: true }
      },
      {
        path: 'illegalReport', // APP用户举报
        component: () => import('@/views/admin/businessPlat/illegalReport/index'),
        name: 'illegalReport',
        meta: { title: 'businessPlat.illegalReport.name', noCache: true, isAdmin: true }
      },
      { // 消息推送
        path: 'messagePush',
        component: () => import('@/views/admin/businessPlat/messagePush/index'),
        name: 'messagePush',
        meta: { title: 'businessPlat.messagePush.name', noCache: true, isAdmin: true }
      }
      // { // admin视频转码
      //   path: 'transcodeList',
      //   component: () => import('@/views/admin/businessPlat/transcodeList/index'),
      //   name: 'transcodeList',
      //   meta: { title: 'businessPlat.transcodeList.name', transcodeList: true }
      // },
    ]
  },
  { // admin内容市场管理
    path: '/distributionManagement',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: 'contentMarketManagement.name',
      isAdmin: true,
      icon: 'lock'
    },
    children: [
      {
        path: 'distributionDecorate', // 页面装修
        component: () => import('@/views/admin/contentMarketManagement/contentMarketRenovation/index'),
        name: 'distributionDecorate',
        meta: { title: 'contentMarketManagement.contentMarketRenovation.name', isAdmin: true }
      },
      {
        path: 'addSecialArea', // 增加专区
        component: () => import('@/views/admin/contentMarketManagement/contentMarketRenovation/addSecialArea'),
        hidden: true,
        name: 'addSecialArea',
        meta: { title: 'contentMarketManagement.contentMarketRenovation.addSecialArea', noCache: true }
      },
      {
        path: 'editSecialArea', // 编辑专区
        component: () => import('@/views/admin/contentMarketManagement/contentMarketRenovation/editSecialArea'),
        hidden: true,
        name: 'editSecialArea',
        meta: { title: 'contentMarketManagement.contentMarketRenovation.editSecialArea', noCache: true }
      },
      {
        path: 'checkSecialArea/:contentType/:contentId', // 专区列表查看课程
        component: () => import('@/views/admin/contentMarketManagement/contentMarketRenovation/checkSecialArea'),
        hidden: true,
        name: 'checkSecialArea',
        meta: { title: 'contentMarketManagement.contentMarketRenovation.checkSecialArea', noCache: true }
      },
      {
        path: 'distributionCategory', // 分类管理
        component: () => import('@/views/admin/contentMarketManagement/classifiedManagement/index'),
        name: 'distributionCategory',
        meta: { title: 'contentMarketManagement.classifiedManagement.name', isAdmin: true }
      },
      {
        path: 'checkDistribution/:id/:childId', // 分类的查看课程
        hidden: true,
        component: () => import('@/views/admin/contentMarketManagement/classifiedManagement/checkDistributionClassify'),
        name: 'checkDistributionClassify',
        meta: { title: 'contentMarketManagement.classifiedManagement.checkDistributionClassify', icon: 'excel' }
      },
      {
        path: 'contentReview', // 内容审核
        component: () => import('@/views/admin/contentMarketManagement/contentReviewManage/index'),
        name: 'contentReview',
        meta: { title: 'contentMarketManagement.contentReiviewList.name', isAdmin: true }
      }

    ]
  },
  // 抖音小程序管理
  {
    path: '/tikTokManagement',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: 'tikTokProgramManagement.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'toCheckContent/:categoryId',
        component: () => import('@/views/admin/tikTokManagement/components/toCheckContent'),
        name: 'toCheckContent',
        hidden: true,
        meta: { title: 'tikTokProgramManagement.content' }
      },

      {
        path: 'toSectionContent/:sectionId/:sectionType',
        component: () => import('@/views/admin/tikTokManagement/components/toCheckContent'),
        name: 'toSectionContent',
        hidden: true,
        meta: { title: 'tikTokProgramManagement.content' }
      },
      { // 内容审核
        path: 'tikTokAudit',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokAudit',
        meta: { title: 'tikTokProgramManagement.toAudit', isAdmin: true }
      },
      { // 页面装修
        path: 'tikTokDecorate',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokDecorate',
        meta: { title: 'tikTokProgramManagement.decorate', isAdmin: true }
      },
      { // 达人管理
        path: 'tikTokIntalent',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokIntalent',
        meta: { title: 'tikTokProgramManagement.intalent', isAdmin: true }
      },
      { // 分类管理
        path: 'tikTokClassification',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokClassification',
        meta: { title: 'tikTokProgramManagement.classification', isAdmin: true }
      },
      { // 数据分析
        path: 'tikTokAnalysis',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokAnalysis',
        meta: { title: 'tikTokProgramManagement.tikTokAnalysis', isAdmin: true }
      },
      { // 运营计划
        path: 'tikTokOperatingSet',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokOperatingSet',
        meta: { noCache: true, title: 'tikTokProgramManagement.tikTokOperatingSet', isAdmin: true }
      },
      { // 版本管理
        path: 'tikTokVersioning',
        component: () => import('@/views/admin/tikTokManagement/index'),
        name: 'tikTokVersioning',
        meta: { noCache: true, title: 'tikTokProgramManagement.tikTokVersioning', isAdmin: true }
      }
      // { // 版本记录
      //   path: 'tikTokVersionRecord',
      //   component: () => import('@/views/admin/tikTokManagement/index'),
      //   name: 'tikTokVersionRecord',
      //   meta: { title: 'tikTokProgramManagement.versionRecord', isAdmin: true }
      // }
    ]
  },
  // 渠道商管理
  {
    path: '/channelManagement',
    component: Layout,
    // hidden: true,
    redirect: 'noredirect',
    meta: {
      isAdmin: true
    },
    children: [
      {
        path: 'channelList',
        component: () => import('@/views/admin/channelManagement/channelList'),
        name: 'channelList',
        meta: { title: 'channelManagement.name', icon: 'component' }
      },
      {
        path: 'groupself/:groupId',
        component: () => import('@/views/admin/channelManagement/groupself'),
        name: 'groupself',
        hidden: true,
        meta: { title: 'channelManagement.name' }
      },
      {
        path: 'addChannel',
        component: () => import('@/views/admin/channelManagement/addChannel'),
        name: 'addChannel',
        hidden: true,
        meta: { title: 'channelManagement.name1' }
      },
      {
        path: 'editChannel/:editId/:isUpgrade?',
        component: () => import('@/views/admin/channelManagement/addChannel'),
        name: 'editChannel',
        hidden: true,
        meta: { title: 'channelManagement.name2' }
      }
    ]
  },
  { // admin的费用管理
    path: '/financialManagement',
    component: Layout,
    redirect: 'noredirect',
    name: 'financialManagement',
    alwaysShow: true,
    meta: {
      title: 'financialManagement.name',
      isAdmin: true,
      icon: 'international'
    },
    children: [
      {
        path: 'costSetting',
        component: () => import('@/views/admin/financialManagement/costSetting'),
        name: 'costSetting',
        meta: { title: 'financialManagement.costSetting', noCache: true, isAdmin: true }
      },
      {
        path: 'widthdrawManagement',
        component: () => import('@/views/admin/financialManagement/widthdrawManagement'),
        name: 'widthdrawManagement',
        meta: { title: 'financialManagement.widthdrawManagement', noCache: true, isAdmin: true }
      },
      {
        path: 'transaction',
        component: () => import('@/views/admin/financialManagement/transaction'),
        name: 'transaction',
        meta: { title: 'financialManagement.transaction', isAdmin: true }
      },
      {
        path: 'orderManagement',
        component: () => import('@/views/admin/financialManagement/orderManagement'),
        name: 'orderManagement',
        meta: { title: 'financialManagement.orderManagement', isAdmin: true }
      },
      {
        path: 'invoiceExamine',
        component: () => import('@/views/admin/financialManagement/invoiceExamine'),
        name: 'invoiceExamine',
        meta: { title: 'financialManagement.invoiceExamine', noCache: true, isAdmin: true }
      }

    ]
  },

  { // 客户异常
    path: '/customerAbnormal',
    component: Layout,
    redirect: 'noredirect',
    name: 'customerAbnormal',
    alwaysShow: true,
    meta: {
      title: 'customerAbnormal.name',
      isAdmin: true,
      icon: 'international'
    },
    children: [
      {
        path: 'authError',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/problem.vue'),
        name: 'authError',
        meta: { title: 'customerAbnormal.problem', noCache: true, isAdmin: true }
      },
      {
        path: 'smsWarning',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/problem.vue'),
        name: 'smsWarning',
        meta: { title: 'customerAbnormal.smsWarning', noCache: true, isAdmin: true }
      },
      { // admin视频转码
        path: 'transcodeList',
        component: () => import('@/views/admin/businessPlat/transcodeList/index'),
        name: 'transcodeList',
        meta: { title: 'businessPlat.transcodeList.name', isAdmin: true }
      },
      { // 短信记录
        path: 'smsRecord',
        component: () => import('@/views/admin/customerManagement/customerAdminister/components/smsRecord.vue'),
        name: 'smsRecord',
        meta: { title: 'businessPlat.smsRecord.name', noCache: true, isAdmin: true }
      },
      // 辅助工具
      {
        path: 'assistTool',
        component: () => import('@/views/admin/customerManagement/assistTool/index'),
        name: 'assistTool',
        meta: { title: 'customerAbnormal.assistTool', noCache: true, isAdmin: true }
      },
      // 素材迁移
      {
        path: 'materialMigration',
        component: () => import('@/views/admin/customerManagement/materialMigration/index'),
        name: 'materialMigration',
        meta: { title: 'customerAbnormal.materialMigration', noCache: true, isAdmin: true }
      }
    ]
  },
  {
    path: '/staffManagement',
    component: Layout,
    // hidden: true,
    redirect: 'noredirect',
    name: 'staffManagement',
    meta: {
      isAdmin: true
    },
    children: [
      {
        path: 'employeeManage',
        component: () => import('@/views/admin/staffManagement/index'),
        name: 'employeeManage',
        meta: { title: 'staffManagement.name', icon: 'peoples' }
      },
      {
        path: 'createAccount',
        component: () => import('@/views/admin/staffManagement/addOrEditPermission'),
        name: 'createAccount',
        hidden: true,
        meta: { title: 'staffManagement.createAccount', noCache: true }
      },
      {
        path: 'editAccount/:id/:userType?',
        component: () => import('@/views/admin/staffManagement/addOrEditPermission'),
        name: 'editAccount',
        hidden: true,
        meta: { title: 'staffManagement.editAccount', noCache: true }
      },
      {
        path: 'createRole',
        component: () => import('@/views/admin/staffManagement/addOrEditPermission'),
        name: 'createRole',
        hidden: true,
        meta: { title: 'staffManagement.createRole', noCache: true }
      },
      {
        path: 'editRole/:id',
        component: () => import('@/views/admin/staffManagement/addOrEditPermission'),
        name: 'editRole',
        hidden: true,
        meta: { title: 'staffManagement.editRole', noCache: true }
      }
    ]
  },
  { // admin店铺模板
    path: '/shopTemplate',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    meta: {
      isAdmin: true
    },
    children: [
      {
        path: 'editTemplate/:id',
        component: () => import('@/views/admin/shopTemplate/editTemplate'),
        hidden: true,
        name: 'editTemplate',
        meta: { title: 'shopTemplate.editTemplate', noCache: true }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    redirect: 'noredirect',
    name: 'feedback',
    hidden: true,
    meta: {
      title: 'feedback.feedbackList.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'feedbackDetail/:feedbackId',
        component: () => import('@/views/admin/feedback/feedbackDetail'),
        hidden: true,
        name: 'feedbackDetail',
        meta: { title: 'feedback.feedbackList.feedbackDetail', noCache: true }
      }
    ]
  },
  { // 产品动态，新增动态
    path: '/proDyn',
    component: Layout,
    redirect: 'noredirect',
    name: 'proDyn',
    hidden: true,
    meta: {
      title: 'businessPlat.proDyn.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'addUpdate',
        component: () => import('@/views/admin/businessPlat/proDyn/addUpdate'),
        hidden: true,
        name: 'addUpdate',
        meta: { title: 'businessPlat.proDyn.addUpdate', noCache: true }
      },
      {
        path: 'editUpdate/:upId',
        component: () => import('@/views/admin/businessPlat/proDyn/editUpdate'),
        hidden: true,
        name: 'editUpdate',
        meta: { title: 'businessPlat.proDyn.editUpdate', noCache: true }
      }
    ]
  },
  {
    path: '/inviteCard',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    name: 'inviteCard',
    meta: {
      title: 'inviteCard.inviteCardList.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'addBackground',
        component: () => import('@/views/admin/inviteCard/addBackground'),
        hidden: true,
        name: 'addBackground',
        meta: { title: 'inviteCard.inviteCardList.addBackground', noCache: true }
      },
      {
        path: 'editBackground/:ibId',
        component: () => import('@/views/admin/inviteCard/editBackground'),
        hidden: true,
        name: 'editBackground',
        meta: { title: 'inviteCard.inviteCardList.editBackground', noCache: true }
      }
    ]
  },
  {
    path: '/successCase',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    name: 'successCase',
    meta: {
      title: 'successCase.successCaseList.name',
      isAdmin: true,
      icon: 'component'
    },
    children: [
      {
        path: 'addCase',
        component: () => import('@/views/admin/successCase/addCase'),
        hidden: true,
        name: 'addCase',
        meta: { title: 'successCase.successCaseList.addCase', noCache: true }
      },
      {
        path: 'editCase/:caseId',
        component: () => import('@/views/admin/successCase/editCase'),
        hidden: true,
        name: 'editCase',
        meta: { title: 'successCase.successCaseList.editCase', noCache: true }
      }

    ]
  },
  // 此路由写在最后面，不然会被404页面给拦截掉
  // 动态路由表。
  { path: '*', redirect: '/404', hidden: true }
]
