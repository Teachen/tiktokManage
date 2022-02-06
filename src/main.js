/* import Vue from 'vue' */
// import VueLazyload from 'vue-lazyload'

require('es6-promise').polyfill()

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import getImageSign from './utils/getImageSign'
Vue.use(getImageSign)
import axiosMethods from './utils/axiosMethods'
Vue.use(axiosMethods)
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data
import './config'

import * as filters from './filters' // global filters
import elImage from './components/img/index'
Vue.use(elImage)
import elEye from '@/views/templatePage/showEyeCom/index'
Vue.use(elEye)
/*  Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})*/

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.replaceMpLink = function(val) {
  if (!val) {
    return ''
  }
  const ckjrAdddress = ['kptest.ckjr001.com', 'formal.ckjr001.com', 'wx.ckjr001.com']
  val = val.replace(/<a [^>]*href=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
    // console.log('a的链接:', match, capture)
    var oldLink = capture
    if (ckjrAdddress.some(el => capture.includes(el))) { // 存在创客匠人移动端域名
      // isNeedSet.push(capture)
      capture = capture.replace('/#/', '/?#/')
    }
    match = match.replace(oldLink, capture)
    return match
  })
  return val
}
Vue.prototype.imgWebUrl = 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image'

// Vue.use(VueLazyload, {
//   error: require('./assets/defult270.png'),
//   loading: require('./assets/defaultBanner.png'),
//   attempt: 1
// })

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  methods: {
    handleSearch(curPageObj, curPageName, fn) {
      const page = curPageObj[curPageName]
      console.log(page, 'page')
      curPageObj[curPageName] = 1
      if (page == 1) {
        fn()
      }
    },
    // 导出excel表格。
    exportExcel(url) { // 导出
      const hasParams = (data) => {
        if (data.indexOf('?') >= 0) {
          return true
        }
        return false
      }
      const connector = hasParams(url) ? '&' : '?'
      window.open(url + connector + 'token=' + this.$store.getters.token)
    }
  },
  components: { App }
})
