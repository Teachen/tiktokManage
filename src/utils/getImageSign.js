
let result
const dtd = jQuery.Deferred()
export default function install(Vue, options) {
  Vue.prototype.getImageSign = function(params = {}) {
    getSingle(function() {
      $.ajax({
        url: process.env.VUE_APP_BASE_API + '/assets/imageSign',
        type: 'GET',
        dataType: 'json',
        headers: {
          'Authorization': 'Bearer ' + getCookie('Admin-Token')
        },
        data: params,
        success: function(results) {
          //   callback(results.data)
          dtd.resolve(results)
        }
      })
      return 1
    })()
    return dtd
  }

  function getCookie(name) {
    var arr = ''
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (arr = document.cookie.match(reg)) { return unescape(arr[2]) } else { return null }
  }
}
// 单例模式
function getSingle(fn) {
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}

