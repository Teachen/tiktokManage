<template>
  <div>
    <el-input ref="pwdInput"
      @compositionend.native="compositionend"
      @compositionstart.native="compositionstart" 
      @input.native="inputVal" 
      :class="defineClass" 
      clearable 
      :autofocus="autofocus" 
      type="text"
      :placeholder="placeholder"
      auto-complete="new-password" 
      @keyup.enter.native="makeSure" 
      v-model="passwordValue"></el-input>
  </div>
</template>
<script>
export default {
  name: 'newPasswordInput',
  props: {
    showInput: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    defineClass: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      passwordValue: '',
      pwd: '',
      strValue: '',
      chineseStatus: false
    }
  },
  computed: {
  },
  watch: {
    showInput(val) {
      if (val) {
        this.clearValue()
      }
    },
    passwordValue(newVal, oldVal) {
      // if (this.pwd == '' && newVal && newVal.indexOf('●') == -1) {
      //   this.pwd = newVal
      // }
      // if (this.pwd && this.pwd.trim().length > 0 && this.pwd.trim().length != newVal.trim().length) {
      //   var data = newVal.split('')
      //   for (var i = 0; i < data.length; i++) {
      //     if (data[i] == '●') {
      //       data[i] = this.pwd[i]
      //     }
      //   }
      //   newVal = data.join('')
      //   this.pwd = newVal
      // }
      // var str = ''
      // for (var j = 0; j < newVal.length; j++) {
      //   str += '●'
      // }
      // this.passwordValue = str
      // this.$emit('changeValue', this.pwd)
    }
  },
  created() {
    this.passwordValue = ''
    this.pwd = ''
    this.$nextTick(() => {
      if (this.autofocus) {
        this.$refs.pwdInput.focus()
      }
    })
  },
  methods: {
    makeSure() {
      this.$emit('makeSure')
    },
    clearValue() {
      this.passwordValue = ''
      this.pwd = ''
    },
    replacePwd(newVal) {
      if (this.pwd == '' && newVal && newVal.indexOf('●') == -1) {
        this.pwd = newVal
      }
      if (this.pwd && this.pwd.trim().length > 0 && this.pwd.trim().length != newVal.trim().length) {
        var data = newVal.split('')
        var count = 0
        for (var i = 0; i < data.length; i++) {
          if (data[i] == '●') {
            data[i] = this.pwd[i - count]
          } else {
            count += 1
          }
        }
        newVal = data.join('')
        this.pwd = newVal
      }
      var str = ''
      for (var j = 0; j < newVal.length; j++) {
        str += '●'
      }
      this.passwordValue = str
      this.$emit('changeValue', this.pwd)
    },
    compositionend() { // 中文输入法输入结束执行事件
      this.chineseStatus = false
      this.replacePwd(this.passwordValue)
    },
    compositionstart() { // 中文输入法开始输入执行事件
      this.chineseStatus = true
      this.replacePwd(this.pwd)
    },
    inputVal() { // 英文输入法执行事件
      if (!this.chineseStatus) {
        this.replacePwd(this.passwordValue)
      }
    }
  },
  destroyed() {
  }
}
</script>
<style lang="scss" scoped>
  
</style>