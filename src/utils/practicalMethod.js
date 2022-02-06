// 一个组件复用 多个请求变为一个请求
class DefinedDeferred {
  constructor() {
    // 存放回调函数的数组
    this.tuple = []
    this.success = null
    this.err = null
  }
  resolve(data) {
    // 成功回调
    this.success = data
    // 发布
    this.tuple.map((item) => {
      item()
    })
    this.tuple = []
    return this
  }
  reject(err) {
    this.err = err
    // 发布
    this.tuple.map((item) => {
      item()
    })
    this.tuple = []
    return this
  }
  then(fn) {
    const _this = this
    this.tuple.push(
      function() {
        fn.call(this, _this.success)
      }
    )
    return this
  }
  catch(fn) {
    const _this = this
    this.tuple.push(
      function() {
        fn.call(this, _this.err)
      }
    )
    return this
  }
}
// 单例
let result
const singlePattern = function(fn) {
  return function() {
    console.log(fn)
    return result || (result = fn.apply(this, arguments))
  }
}

export {
  DefinedDeferred,
  singlePattern
}
