import { getLength } from '@/utils/validate'
var validateFormUtils = {
  // 验证各个模块的长度 根据maxs判断 必填的 需要判断空格
  validateContentLength(rule, value, callback) {
    if (value && value.trim().length === 0) {
      callback('请输入内容，内容不能只有空格')
      return
    }
    if (getLength(value) > rule.maxs) {
      callback(`长度在 0 到 ${rule.maxs} 个字`)
    } else {
      callback()
    }
  },
  // 验证各个模块的长度 根据maxs判断 不必填的
  validateLengthNoRequired(rule, value, callback) {
    if (getLength(value) > rule.maxs) {
      callback(`长度在 0 到 ${rule.maxs} 个字`)
    } else {
      callback()
    }
  },
  // 验证必填项，不能只为空格
  validateContent(rule, value, callback) {
    if (value && value.trim().length === 0) {
      callback('请输入内容，内容不能只有空格')
      return
    }
    callback()
  },
  validatePercent(rule, value, callback) {
    if (value && isNaN(value)) {
      callback('请输入正确的数值')
    } else {
      if (value < 0) {
        callback('数值必须大于等于0')
      }
      if ((value - 100) > 0) {
        callback('数值必须小于100')
      }
      callback()
    }
  },
  validateNumber(rule, value, callback) {
    if (value && isNaN(value)) {
      callback('请输入正确的数值')
    } else {
      if (value < 0) {
        callback('数值必须大于等于0')
      }
      callback()
    }
  },
  validateSort(rule, value, callback) {
    if (value && isNaN(value) || value < 0) {
      callback('请输入正确的数值, 数值必须大于等于0')
    } else {
      callback()
    }
  }
}
export {
  validateFormUtils
}
