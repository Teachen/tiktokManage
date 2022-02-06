import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

export default function install(Vue, options) {
  // Vue.prototype.getMethod = function(url, params = {}, headers, responseType) {
  //   if (!url) {
  //     return Message({
  //       message: '请求地址错误',
  //       type: 'error',
  //       duration: 3 * 1000
  //     })
  //   }
  //   axios.get(url).then(res => {
  //     if (res.status == 200) {
  //       return Promise.resolve(res)
  //     }
  //   }).catch(err => {
  //     return Promise.reject(err)
  //   })
  // }
  Vue.prototype.postMethod = function(url, params = {}, headers = {}, responseType) {
    return new Promise((resolve, reject) => {
      if (!url) {
        return Message({
          message: '请求地址错误',
          type: 'error',
          duration: 3 * 1000
        })
      }
      // 数据分析请求头
      const userId = this.$store.getters.adminUserId
      const companyIdVal = this.$store.getters.encodeCompanyId
      const channel = 'admro'
      const pathUrl = encodeURIComponent(window.location.pathname)
      const defaultHeaders = {
        'Authorization': 'Bearer ' + getToken(),
        'X-Requested-Version': '20220125', // 抖店版本
        'X-DMP': `u=${userId}&c=${companyIdVal}&url=${pathUrl}&chl=${channel}`
      }
      axios.post(url, params, {
        headers: { ...defaultHeaders, ...headers },
        responseType: responseType || 'blob'
      }).then(res => {
        if (res.status == 200) {
          if (res.data && [500, 1001, 6008, 503].includes(res.data.statusCode)) {
            reject(res.data ? res.data.msg : '系统异常')
          } else {
            resolve(res.data)
          }
        } else {
          reject(res.data ? res.data.msg : '系统异常')
        }
      }).catch(err => {
        const resData = err.response ? err.response.data : err
        reject(resData.msg || resData.data || err.message || '系统异常')
      })
    })
  }
}
