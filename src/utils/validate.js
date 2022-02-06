/**
 * Created by jiachenpan on 16/11/18.
 */
/* 用户名正则，6到18位（字母，数字，下划线，减号）*/
export function validateAccount(str) {
  const reg = /^[a-zA-Z0-9_-]{6,18}$/
  return reg.test(str)
}
/* 密码正则，6到16位字必须数字，字母组合*/
export function validatePassword(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
  return reg.test(str)
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 图片只能是JPG 或 PNG 格式
// export function validateImgFormal(file) {
//   const isImg = file.type == 'image/jpeg' || file.type == 'image/png'
//   if (!isImg) {
//     this.$message.warning('上传图片只能是 JPG 或 PNG 格式')
//   }
//   return isImg
// }
// 图片只能是JPG 或 PNG 格式或gif
export function validateImgFormal(file, that, gif) {
  var isImg
  console.log(gif)
  if (gif) {
    isImg = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif'
  } else {
    isImg = file.type == 'image/jpeg' || file.type == 'image/png'
  }
  if (!isImg) {
    console.log(that)
    if (gif) {
      that.$message.warning('上传图片只能是 JPG 、 PNG 或 GIF 格式！')
    } else {
      that.$message.warning('上传图片只能是 JPG 或 PNG 格式')
    }
  }
  return isImg
}
/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 纯数字验证
 *
 */
export function validateNumber(str) {
  return str.replace(/[^\d]/g, '')
}

/**
 *  排序数字验证，只能是大于0的整数
 */
export function validateSortNumber(str) {
  if (!str) { return true }
  if (Number(str) < 0 || /\./g.test(str)) {
    return false
  }
  return true
}

/**
 * 价格验证
 * 允许一个小数点或者整数
 *
 */
export function validatePrice(str) {
  return str.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : str.match(/\d{1,}\.{0,1}\d{0,}/)[0]
}
/**
 * 验证手机号
 *
 */
export function isPhoneNumber(phoneStr) {
  // var mobile = /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
  var mobile = /^(1\d{10})$/
  return mobile.test(phoneStr)
}
/**
 * 获取字符串长度（一个中文等于2个字符）
 *
 */
export function getChineseStrLength(str) {
  const chStr = str
  const reg = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g
  return chStr.replace(reg, 'aa').length
}
/**
 * 获取字符串长度（
 * 一个中文或中文标点算1个字符（2字节），
 * 1个英文或英文标点或数字算1字节，
 * 奇数时多出来的1个字节也占1字符。）
 *
 */
export function getLength(str) {
  // 如果传入的是undefined 则不进行正则判断
  if (!str) {
    return 0
  }
  const chStr = str
  const reg = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\x00-\xff])/g
  // 中文及字符的长度
  var Ch = chStr.length - chStr.replace(reg, '').length
  // 非中文字符的长度 2个非中文算一个长度  3个取1个长度
  var En = Math.floor(chStr.replace(reg, '').length / 2)
  return (Ch + En)
}
export function getChLength(str) {
  // 如果传入的是undefined 则不进行正则判断
  if (!str) {
    return
  }

  var chStr = str
  const spec = /<p><img/
  let arr = null
  // 只有图片没有文字 chStr
  if ((arr = spec.exec(str)) != null) {
    chStr = arr.length > 1 ? removeFontFamily(str) : str
  } else {
    chStr = removeFontFamily(str)
  }

  const reg = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\x00-\xff])/g

  var Ch = chStr.length - chStr.replace(reg, '').length
  return Ch
}
// 校验非负整数包含0
export function validateInteger(str) {
  const reg = /^[0-9]+$/
  return reg.test(str)
}
// 输入框不能填入空
export function validEmpty(str) {
  if (!(typeof (str) === 'string')) {
    throw new Error('类型错误，请输入字符串')
  }
  if (str.trim().length === 0) {
    return true
  } else {
    return false
  }
}
/* 链接*/
export function validateUrl(str) {
  var regex = new RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/)
  return regex.test(str)
}
export function twoPointInput(item) {
  item = item.replace(/[^\d.]/g, '') // 仅保留数字和"."
  item = item.replace(/\.{2,}/g, '.') // 两个连续的"."仅保留第一个"."
  item = item
    .replace('.', '$#*')
    .replace(/\./g, '')
    .replace('$#*', '.') // 去除其他"."
  item = item.replace(/^(\d+)\.(\d\d).*$/, '$1.$2') // 限制只能输入两个小数
  if (item.indexOf('.') < 0 && item != '') {
    // 首位是0的话去掉
    item = parseFloat(item)
  }
  return item
}

// 去除掉font-family: xxxx;
function removeFontFamily(contnet) {
  // remove repeat
  var unique = function(arr) {
	    var result = [], hash = {}
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem)
	            hash[elem] = true
	        }
	    }
	    return result
  }

  var arr = contnet.match(/(font-family:[^><;"]*(;)?)/ig)
  arr = unique(arr)
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i])
    var reg = new RegExp(arr[i], 'ig')
    contnet = contnet.replace(reg, '')
  }
  return contnet
}

