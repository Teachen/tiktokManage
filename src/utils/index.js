/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 *获取当前星期几
 *
 */
export function getWeekDate(row = '') {
  const now = new Date(row)
  const day = now.getDay()
  // eslint-disable-next-line no-array-constructor
  const weeks = new Array('日', '一', '二', '三', '四', '五', '六')
  const week = weeks[day]
  return week
}
// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function dateFormat(timestamp) {
  const dateTime = new Date(timestamp)
  const dateYear = dateTime.getFullYear()
  let dateMouth = dateTime.getMonth() + 1
  let dateDay = dateTime.getDate()
  dateMouth = dateMouth < 10 ? `0${dateMouth}` : dateMouth
  dateDay = dateDay < 10 ? `0${dateDay}` : dateDay
  return `${dateYear}-${dateMouth}-${dateDay}`
}
// dateStr = 2018-08-25 23:59:59"
export function getTimeByDate(dateStr) {
  if (dateStr == null) {
    return ''
  }
  let time = 0
  const timeHead = dateStr.split(' ')[0].split('-')
  var timeEnd
  if (dateStr.split(' ').length > 1) {
    timeEnd = dateStr.split(' ')[1].split(':')
  } else {
    timeEnd = ['00', '00', '00']
  }
  const date = new Date(timeHead[0], (parseInt(timeHead[1]) - 1), timeHead[2], timeEnd[0], timeEnd[1], timeEnd[2])
  time = date.getTime()
  return time
}
/*
求两个时间的天数
 //sDate1和sDate2是2006-12-18格式
*/
export function getDayDifference(sDate1, sDate2) {
  var dateSpan,
    iDays
  sDate1 = Date.parse(sDate1)
  sDate2 = Date.parse(sDate2)
  dateSpan = sDate2 - sDate1
  dateSpan = Math.abs(dateSpan)
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
  return iDays
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function getTimeString(time, type) {
  const t = time ? new Date(time) : new Date()
  const year = t.getFullYear()
  const month = t.getMonth() + 1
  const day = t.getDate()
  const hour = t.getHours()
  const minute = t.getMinutes()
  const second = t.getSeconds()
  if (type === 'date') return [year, month, day].map(formatNumber).join('-')
  else if (type === 'time') return [hour, minute, second].map(formatNumber).join(':')
}
export function getYmdhmsTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
export function getYm(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('-')
}
export function getYmd(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
export function getLastMonth() { // 获取上个月日期
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth()
  if (month == 0) {
    year = year - 1
    month = 12
  }
  return [year, month].map(formatNumber).join('-')
}
/* 获取指定天数 正数为后面的而日期 0为当前日期 负数为前面日期*/
export function getAssignDays(row) {
  const day = new Date()
  day.setTime(day.getTime() + row * 24 * 60 * 60 * 1000)
  const getMonth = parseInt((day.getMonth() + 1)) >= 10 ? (day.getMonth() + 1) : '0' + (day.getMonth() + 1)
  const getDate = parseInt(day.getDate()) >= 10 ? day.getDate() : '0' + day.getDate()
  return day.getFullYear() + '-' + getMonth + '-' + getDate
}
export function mGetDate(year, month) { // 获取一个月有多少天
  var d = new Date(year, month, 0)
  return d.getDate()
}
export function getNextMonth(date) { // 获取下个月日期
  var arr = date.split('-')
  var year = arr[0] // 获取当前日期的年份
  var month = parseInt(arr[1]) + 1 // 获取当前日期的月份
  if (month == 13) {
    year = parseInt(year) + 1
    month = 1
  }
  return [year, month].map(formatNumber).join('-')
}
export function getBeforeTwoMonth(date) { // 获取前两个月日期
  var arr = date.split('-')
  var year = arr[0] // 获取当前日期的年份
  var month = parseInt(arr[1]) - 2 // 获取当前日期的月份
  if (month == 0) {
    year = parseInt(year) - 1
    month = 12
  } else if (month == -1) {
    year = parseInt(year) - 1
    month = 11
  }
  return [year, month].map(formatNumber).join('-')
}
// 时间格式化
export function timeFormat(s) {
  if (!s) {
    return ''
  }
  var t
  var hour = Math.floor(s / 3600)
  var min = Math.floor(s / 60) % 60
  var sec = s % 60
  if (hour < 10) {
    t = ''
  } else {
    t = hour + ':'
  }

  if (min < 10) { t += '0' }
  t += min + ':'
  if (sec < 10) { t += '0' }
  t += sec.toFixed(0)
  return t
}
// 文件大小转换成MB GB
export function byteTransform(limit) {
  let size = ''
  if (limit < 1 * 1024) { // 小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 1 * 1024 * 1024) { // 小于1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 1 * 1024 * 1024 * 1024) { // 小于1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else { // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  var sizeStr = size + '' // 转成字符串
  var index = sizeStr.indexOf('.') // 获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou == '00') { // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
// js浮点数计算bug
export function caculate(type, a, b) {
  // 加法
  function add(a, b) {
    let c
    let d
    try {
      c = a.toString().split('.')[1].length
    } catch (f) {
      c = 0
    }
    try {
      d = b.toString().split('.')[1].length
    } catch (f) {
      d = 0
    }
    const e = Math.pow(10, Math.max(c, d))
    return (mul(a, e) + mul(b, e)) / e
  }
  // 减法
  function sub(a, b) {
    var c, d, e
    try {
      c = a.toString().split('.')[1].length
    } catch (f) {
      c = 0
    }
    try {
      d = b.toString().split('.')[1].length
    } catch (f) {
      d = 0
    }
    e = Math.pow(10, Math.max(c, d))
    return (mul(a, e) - mul(b, e)) / e
  }
  // 乘法
  function mul(a, b) {
    let c = 0
    const d = a.toString()
    const e = b.toString()
    try {
      c += d.split('.')[1].length
    } catch (f) {
      console.log('')
    }
    try {
      c += e.split('.')[1].length
    } catch (f) {
      console.log('')
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
  }
  // 除法
  function div(a, b) {
    let e = 0
    let f = 0
    try {
      e = a.toString().split('.')[1].length
    } catch (g) {
      console.log('')
    }
    try {
      f = b.toString().split('.')[1].length
    } catch (g) {
      console.log('')
    }
    const c = Number(a.toString().replace('.', ''))
    const d = Number(b.toString().replace('.', ''))
    return mul(c / d, Math.pow(10, f - e))
  }
  const excute = {
    adds(a, b) {
      return add(a, b)
    },
    subs(a, b) {
      return sub(a, b)
    },
    muls(a, b) {
      return mul(a, b)
    },
    divs(a, b) {
      return div(a, b)
    }
  }
  return excute[type](a, b)
}
export function getDays(time) {
  // var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
  var day = time.getDay()
  var week = '7123456'
  var first = 0 - week.indexOf(day)
  var f = new Date()
  f.setDate(f.getDate() + first)
  var last = 6 - week.indexOf(day)
  var l = new Date()
  l.setDate(l.getDate() + last)
  var a = [
    f, l
  ]
  var formatD = formatDate(a[0])
  var formatendD = formatDate(a[1])
  // var EndDate = [formatD, new Date(formatD).getDay(), weekArray[new Date(formatD).getDay()], formatendD, new Date(formatendD).getDay(), weekArray[new Date(formatendD).getDay()]];
  var EndDate = [formatD, formatendD]
  return EndDate
}
function formatTen(num) {
  return num > 9 ? (num + '') : ('0' + num)
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + '-' + formatTen(month) + '-' + formatTen(day)
}

export function informatDate(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}
// url转义
export function encodeUrl(str) {
  return encodeURIComponent(str)
}
// url解码
export function decodeUrl(str) {
  return decodeURIComponent(str)
}
function isNativeStringType(type) {
  return type === 'string' ||
    type === 'url' ||
    type === 'hex' ||
    type === 'email' ||
    type === 'pattern'
}

export function isEmptyValue(value, type = 'string') {
  if (value === undefined || value === null) {
    return true
  }
  if (type === 'array' && Array.isArray(value) && !value.length) {
    return true
  }
  if (isNativeStringType(type) && typeof value === 'string' && !value) {
    return true
  }
  return false
}
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}
export function getDownloadParams(filterParams = {}, target = {}, filterFn = null) {
  // filterParams 不需要的参数 type contain 包含 except 除外 data:[要过滤的键名]
  // {
  //   type:'contain',
  //   data:[]
  // }
  // target 目标对象
  // filterFn 二次过滤条件 目标对象键名 目标对象键值
  let form = ''

  const defaultCondition = function(target, item) {
    return target[item]
  }
  const condition = typeof filterFn === 'function' ? filterFn : defaultCondition

  const filterCondition = filterParams.type == 'contain' ? (item) => filterParams.data.includes(item) : (item) => !filterParams.data.includes(item)
  const parmsArr = Object.keys(target).filter(item => filterCondition(item))

  parmsArr.map(item => {
    if (condition(target, item)) {
      form += `&${item}=${target[item]}`
    }
  })
  return form
}
// 索引转换成大写字母 从1开始
export function getCapital(index) {
  return String.fromCharCode(65 + ~~index)
}
// 排列字母 （测评选项中使用）
export function sortLetter(arr) {
  if (arr == undefined) {
    return arr
  }
  const data = JSON.parse(JSON.stringify(arr))
  const result = data.sort((a, b) => {
    console.log(data, 'data')
    return a.charCodeAt() - b.charCodeAt()
  })
  return result
}
// 深复制对象数组 不包括函数
export function getCopyData(data) {
  return JSON.parse(JSON.stringify(data))
}

// 客户列表时间筛选按月份的数据
export function getTimeData() {
  const getTime = getYm(new Date()).substr(0, 4)
  const timeData = []
  const oldDate = (parseInt(getTime) + 5) - 2016
  const lisDate = parseInt(getTime) + 5
  for (var j = 0; j <= oldDate; j++) {
    timeData.unshift({ value: lisDate - j, label: lisDate - j, children: [] })

    for (var l = 1; l < 13; l++) {
      timeData[0].children.push({ value: (lisDate - j) + '-' + l, label: l + '月' })
    }
  }
  return timeData
}
const file_mime_type = { '.3gp': 'video/3gpp',
  '.apk': 'application/vnd.android.package-archive',
  '.asf': 'video/x-ms-asf',
  '.avi': 'video/x-msvideo',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.c': 'text/plain',
  '.class': 'application/octet-stream',
  '.conf': 'text/plain',
  '.cpp': 'text/plain',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.exe': 'application/octet-stream',
  '.gif': 'image/gif',
  '.gtar': 'application/x-gtar',
  '.gz': 'application/x-gzip',
  '.h': 'text/plain',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.jar': 'application/java-archive',
  '.java': 'text/plain',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/x-javascript',
  '.log': 'text/plain',
  '.m3u': 'audio/x-mpegurl',
  '.m4a': 'audio/mp4a-latm',
  '.m4b': 'audio/mp4a-latm',
  '.m4p': 'audio/mp4a-latm',
  '.m4u': 'video/vnd.mpegurl',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.mp2': 'audio/x-mpeg',
  '.mp3': 'audio/x-mpeg',
  '.mp4': 'video/mp4',
  '.mpc': 'application/vnd.mpohun.certificate',
  '.mpe': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.mpg4': 'video/mp4',
  '.mpga': 'audio/mpeg',
  '.msg': 'application/vnd.ms-outlook',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.pps': 'application/vnd.ms-powerpoint',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.prop': 'text/plain',
  '.rc': 'text/plain',
  '.rmvb': 'audio/x-pn-realaudio',
  '.rtf': 'application/rtf',
  '.sh': 'text/plain',
  '.tar': 'application/x-tar',
  '.tgz': 'application/x-compressed',
  '.txt': 'text/plain',
  '.wav': 'audio/x-wav',
  '.wma': 'audio/x-ms-wma',
  '.wmv': 'audio/x-ms-wmv',
  '.wps': 'application/vnd.ms-works',
  '.xml': 'text/plain',
  '.z': 'application/x-compress',
  '.zip': 'application/x-zip-compressed' }
const file_mime_type_keys = Object.keys(file_mime_type)
export function checkFileInfo({ fileType = [], file, size, checkTypeTxt, checkSizeTxt }) {
  fileType.map(item => {
    if (!file_mime_type_keys.includes(item)) {
      throw new Error('不存在的类型')
    }
  })
  let correctType = false
  correctType = fileType.some(item => {
    if (file.type === file_mime_type[item]) {
      return true
    }
  })
  if (!correctType) {
    this.$message.error(checkTypeTxt)
  }
  const correctSize = file.size / 1024 / 1024 < size
  if (!correctSize) {
    this.$message.error(checkSizeTxt)
  }
  return correctType && correctSize
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
      return e.target.result
    }
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
