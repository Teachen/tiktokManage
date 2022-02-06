import store from '@/store'
export function reportError(requestUrl, errors, type) {
  var href = window.location.host
  var map = new Map()
  map.set('localhost:9528', 'kpapi-cs.ckjr001.com')
  map.set('lecturercs.myckjr.com', 'kpapi-cs.ckjr001.com')
  map.set('lecturercs2.myckjr.com', 'kpapi-cs2.ckjr001.com')
  map.set('formaladmin.51ckjr.com', 'formalapi.51ckjr.com')
  map.set('formaladmin.ckjr001.com/', 'formalapi.ckjr001.com')
  map.set('admin.ckjr001.com', 'kpapiop.ckjr001.com')
  var apiurl = map.get(href) || 'kpapiop.ckjr001.com'
  var baseUrl = 'https://' + apiurl + '/api/'
  $.ajax({ // eslint-disable-line
    url: baseUrl + 'common/reportError',
    type: 'post',
    dataType: 'json',
    data: {
      fromApp: 'admin-fe',
      res: JSON.stringify(errors),
      token: store.getters.token,
      userId: store.getters.adminUserId, // id
      companyId: store.getters.enableModules.companyId,
      type: type || '',
      sourceUrl: requestUrl,
      curUrl: window.location.href
    },
    success: function(result) {
      return true
    }
  })
  // const requestConfig = {
  //   url: 'common/reportError',
  //   method: 'post',
  //   data: {
  //     res: JSON.stringify(errors),
  //     token: store.getters.token,
  //     userId: '',
  //     companyId: store.getters.enableModules.companyId,
  //     type: '',
  //     curUrl: requestUrl
  //   },
  //   baseURL: apiurl, // api的base_url
  //   timeout: 0 // request timeout

  // }
  // axios.request(requestConfig).then((res) => { // eslint-disable-line
  //   return true
  // })
  return false
}
