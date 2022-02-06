<template>
  <div class="c-bg-F4F7F9 c-height100 c-overflow-auto padding-b50 login-container">
    <div class="padding-t15 padding-l120 mp-ph0 mp-pb0 mp-textAlign-c">
      <a href="http://www.ckjr001.com" target="blank"><img src="@/assets/logo/logo.svg" width="140" alt="" srcset=""></a>
    </div>
    <div class="width1000 margin-0auto c-flex-row c-box-shadow3 border-radio10 c-overflow-h mp-w100 mp-mt20">
      <div class="c-width40 mp-hide">
        <img v-for="(item, index) in loginBanner" :key="index" :src="item.imgUrl" class="c-width100 c-height100" alt="" srcset="">
      </div>
      <!-- <el-carousel height="500px" class="c-width40">
        <el-carousel-item v-for="(item, index) in loginBanner" :key="index">
          <img :src="item.imgUrl" class="c-width100 c-height100" alt="" srcset="">
        </el-carousel-item>
      </el-carousel> -->
      <div class="c-bg-white c-width60 padding-t30 padding-b25 mp-w100">
        <div class="margin-0auto c-width60 mp-w80">
          <div class="c-flex-row">
            <div v-for="(item,index) in loginTypeOption" :key="index" class="c-width50 c-fw-600 c-pv15 c-textAlign-c c-fs-16 pointer"
              :class="loginType == item.type ? ' c-bm2-blue c-fc-blue' : 'c-fc-333 c-bm2-xsgray'"
              @click="changeLoginType(item)">
              {{item.title}}
            </div>
          </div>
          <el-form autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" class="loginForm">
            <template v-if="loginType == 'password'">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入账号或手机号码" class="padding-t23"></el-input>
              </el-form-item>
              <input style="display:none" type="text" name="remembered"/>
              <input style="display:none" type="password" name="remembered"/>
              <el-form-item class="relative" prop="password">
                <div v-if="isAdminLogin">
                  <el-input v-if="invisible" 
                    @compositionend.native="compositionend"
                    @compositionstart.native="compositionstart" 
                    @input.native="inputVal" 
                    class="el-input" 
                    type="text" placeholder="请输入密码"
                    v-model="passwordValue"/>
                  <el-input v-else class="el-input" type="text" v-model="pwd" placeholder="请输入密码" />
                </div>
                <el-input v-else class="el-input" name="password" :type="passwordType" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码" />
                <span class="show-pwd pointer" @click="showPwd">
                  <svg-icon v-if="invisible" icon-class="eye" />
                  <i v-else class="el-icon-view"></i>
                </span>
              </el-form-item>
              <el-form-item prop="captcha" class="captcha-form-item">
                <div class="captcha-container">
                  <el-input class="el-input" name="captcha" type="text" maxlength="14" v-model="loginForm.captcha" placeholder="请输入验证码" @keyup.enter.native="handleLogin" />
                  <img v-show="captchaImg!=null" :src="captchaImg" @click="loadCaptcha" title="点击图片重新获取验证码" style="cursor: pointer;">
                </div>
              </el-form-item>
              <div class="c-flex-row c-justify-sb c-aligni-center margin-t15">
                <div class="c-flex-row c-aligni-center" v-if="(!isAdminLogin) || !loginForm.username">
                  <el-checkbox v-model="checked"><div class="c-fs-12 c-fc-333 c-fw-400 c-flex-row c-aligni-center">记住密码</div></el-checkbox>
                </div>
                <div v-else></div>
                <span class="c-fs-12 c-fc-333 pointer" @click="modifyPassword">忘记密码</span>
              </div>
            </template>
            <template v-else>
              <el-form-item class="" prop="mobile">
                <el-input class="el-input margin-t23"  name="mobile" type="tel" v-model.trim="loginForm.mobile" autoComplete="off"
                          placeholder="请输入手机号码"/>
              </el-form-item>
              <el-form-item class="input" prop="captcha">
                <div class="captcha-container">
                  <el-input class="el-input" name="captcha" type="text" maxlength="14" v-model="loginForm.captcha" placeholder="请输入验证码" />
                  <img v-show="captchaImg!=null" :src="captchaImg" @click="loadCaptcha" title="点击图片重新获取验证码" style="cursor: pointer;">
                </div>
              </el-form-item>
              <el-form-item class="input" prop="code">
                <div class="captcha-container">
                  <el-input  autocomplete="off" class="el-input" name="code" type="text" maxlength="16" v-model="loginForm.code"
                    @keyup.enter.native="handleLogin" placeholder="请输入验证码"/>
                  <el-button :disabled="isClick||loginForm.captcha.length<4" class="getcode" type="text" @click="getYzcode" style="cursor: pointer;">
                    {{yzText}}
                  </el-button>
                </div>
              </el-form-item>
            </template>
            <div class="loginBtn" :class="loginType == 'password' ? 'c-pv30' : 'padding-t8 padding-b30'">
              <el-button class="c-width100 c-box-shadow6" :class="{active: loginForm.username&&loginForm.password&&loginForm.captcha}" type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
            </div>
            <div class="c-textAlign-c c-fs-12 c-fc-666">没有账号？<span class="c-fs-12 c-fc-blue pointer" @click="linkToRegister">立即注册</span></div>
          </el-form>
        </div>
        
      </div>
    </div>
    <div class="c-textAlign-c c-fc-sgray c-fs-14">
      <p class="padding-b23">{{$t('systemDesc')}}</p>
      <p>{{$t('systemCopyright')}}</p>
    </div>
  </div>
</template>

<script>
import { getCaptcha, appSendCode } from '@/api/login'
import { isPhoneNumber } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginTypeOption: [
        { type: 'password', title: '密码登录' },
        { type: 'code', title: '验证码登录' }
      ],
      loginType: 'password', // 密码还是验证码登录
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        captchaKey: null,
        mobile: '',
        code: ''
      },
      checked: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }],
        mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        code: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      passwordType: 'password',
      fullscreenLoading: false,
      captchaImg: null,
      invisible: true,
      passwordValue: '',
      pwd: '',
      chineseStatus: false,
      isClick: false,
      yzText: '获取验证码',
      num: 60,
      loginBanner: [
        { imgUrl: require('@/assets/loginBanner/banner.png'), value: 1 }
      ]
    }
  },
  computed: {
    isAdminLogin() { // 是否是总部管理员账号登录
      return this.loginForm.username && this.loginForm.username.trim().includes('admin')
    }
  },
  watch: {
    'loginForm.username': {
      handler(val) {
        if (val && val.trim().includes('admin')) {
          this.passwordValue = this.loginForm.password
          this.replacePwd(this.passwordValue)
        }
      },
      deep: true
    },
    passwordValue(newVal, oldVal) {
      // if (this.pwd == '' && newVal && newVal.indexOf('●') == -1) {
      //   // console.log('1')
      //   this.pwd = newVal
      // }
      // // console.log('444', this.pwd.trim().length, this.pwd.trim().length != newVal.trim().length)
      // if (this.pwd && this.pwd.trim().length > 0 && this.pwd.trim().length != newVal.trim().length) {
      //   var data = newVal.split('')
      //   for (var i = 0; i < data.length; i++) {
      //     // console.log('22222:', data, this.pwd)
      //     if (data[i] == '●') {
      //       data[i] = this.pwd[i]
      //     }
      //   }
      //   newVal = data.join('')
      //   this.pwd = newVal
      //   // console.log('ped:', this.pwd)
      // }
      // var str = ''
      // for (var j = 0; j < newVal.length; j++) {
      //   str += '●'
      // }
      // this.passwordValue = str
    },
    pwd(val) {
      this.passwordValue = this.pwd
      this.loginForm.password = this.pwd
      this.replacePwd(val)
    }
  },
  mounted() {
    this.loadCaptcha()
    this.getCookie()
    console.log('从注册成功过来的this.$route', this.$route)
    if (this.loginForm.username && this.loginForm.password) {
      this.checked = true
    }
    if (sessionStorage.getItem('registMobile') || sessionStorage.getItem('registPassword')) {
      this.loginForm.username = sessionStorage.getItem('registMobile')
      this.loginForm.password = sessionStorage.getItem('registPassword')
    }
  },
  methods: {
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
        this.loginForm.password = this.pwd
      }
      var str = ''
      for (var j = 0; j < newVal.length; j++) {
        str += '●'
      }
      this.passwordValue = str
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
    },
    modifyPassword() {
      this.$router.push({ name: 'modifyPassword', params: { mobile: this.loginForm.username, password: this.loginForm.password }})
    },
    loadCaptcha() {
      getCaptcha().then(res => {
        this.captchaImg = res.data.data.img
        this.loginForm.captchaKey = res.data.data.key
      }).catch(err => {
        console.log(err)
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.invisible = false
      } else {
        this.passwordType = 'password'
        this.invisible = true
      }
    },
    changePasswordType(val) { // 输入用户名为admin时密码直接明示
      if (this.isAdminLogin) {
        this.passwordType = ''
        this.invisible = false
        // this.$refs.passwordInput.focus()
      }
      //  else {
      //   this.passwordType = 'password'
      //   this.invisible = true
      // }
    },
    validateForm() {
      if (this.loginType == 'code') { // 验证码登录
        if (!isPhoneNumber(this.loginForm.mobile)) {
          this.$message.warning('请填写正确的手机号')
          return false
        }
        return true
      }
      return true
    },
    handleLogin() {
      if (!this.validateForm()) {
        return
      }
      if (this.isAdminLogin) { // 情空勾选了记住密码
        this.checked = false
      }
      // 判断复选框是否被勾选 勾选则调用配置cookie方法
      if (this.checked == true) {
        console.log('checked == true')
        // 传入账号名，密码，和保存天数3个参数
        this.setCookie(this.loginForm.username, this.loginForm.password, 7)
      } else {
        console.log('清空Cookie')
        // 清空Cookie
        this.clearCookie()
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.fullscreenLoading) {
            return
          }
          // this.passwordValue = this.loginForm.password
          // var data = {
          //   username: this.loginForm.username,
          //   password: this.passwordValue,
          //   captcha: this.loginForm.captcha,
          //   captchaKey: this.loginForm.captchaKey
          // }
          // if (this.isAdminLogin) {
          //   this.passwordType = 'text'
          //   this.invisible = false
          //   this.loginForm.password = ''
          // }
          this.fullscreenLoading = true
          if (this.loginType == 'code') { // 验证码登录
            this.$store.dispatch('LoginByMobile', this.loginForm).then((res) => {
              sessionStorage.removeItem('registMobile')
              sessionStorage.removeItem('registPassword')
              this.fullscreenLoading = false
              if (res.type == 'login') {
                this.$router.push({ path: '/' })
              } else { // 多个店铺的就跳转到选择店铺
                this.$router.push({ name: 'selectShop' })
              }
            }).catch(() => {
              this.loadCaptcha()
              this.fullscreenLoading = false
            // this.loginForm.password = this.passwordValue
            })
            return
          }
          this.loginForm.mobile = ''
          this.$store.dispatch('Login', this.loginForm).then((res) => {
            sessionStorage.removeItem('registMobile')
            sessionStorage.removeItem('registPassword')
            this.fullscreenLoading = false
            if (res.type == 'login') {
              this.$router.push({ path: '/' })
            } else { // 多个店铺的就跳转到选择店铺
              this.$router.push({ name: 'selectShop' })
            }
          }).catch(() => {
            this.loadCaptcha()
            this.fullscreenLoading = false
            // this.loginForm.password = this.passwordValue
          })
          // this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
          //   sessionStorage.removeItem('registMobile')
          //   sessionStorage.removeItem('registPassword')
          //   this.fullscreenLoading = false
          //   this.$router.push({ path: '/' })
          //   this.fullscreenLoading = false
          // }).catch(() => {
          //   this.loadCaptcha()
          //   this.fullscreenLoading = false
          //   // this.loginForm.password = this.passwordValue
          // })
        } else {
          this.loadCaptcha()
          this.fullscreenLoading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      var isSecure = document.location.protocol == 'https:'
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString() + `${isSecure ? ';secure=true' : ''}`
      window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString() + `${isSecure ? ';secure=true' : ''}`
    },
    // 读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.loginForm.username = arr2[1] // 保存到保存数据的地方
          } else if (arr2[0] == 'userPwd') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    },
    linkToRegister() {
      console.log('是否选择', this.checked)
      this.$router.push({ name: 'register' })
    },
    changeLoginType(item) {
      this.loadCaptcha()
      this.loginType = item.type
      this.$refs.loginForm.clearValidate() // 清空表单验证
    },
    getYzMethod: function() {
      this.num -= 1
      this.yzText = this.num + '秒后重新获取'
      if (this.num == 0) {
        this.isClick = false
        clearInterval(this.interval)
        this.yzText = '获取验证码'
        this.num = 60
      }
    },
    getYzcode() {
      if (!this.loginForm.mobile) {
        this.$message.warning('请输入手机号')
        return false
      }
      if (!isPhoneNumber(this.loginForm.mobile)) {
        this.$message.warning('请填写正确的手机号')
        return false
      }
      if (this.isClick) {
        return
      }
      this.isClick = true
      this.yzText = '正在发送短信'
      appSendCode(this.loginForm).then(res => {
        if (res.data.statusCode == 200) {
          this.interval = setInterval(this.getYzMethod, 1000)
          this.$message({
            message: '短信发送成功！',
            type: 'success'
          })
        }
      }).catch(error => {
        this.isClick = false
        this.yzText = '获取验证码'
        console.log(error)
      })
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>
<style scoped>
   .el-checkbox_label {
    display: inline-block;
    padding-left: 6px !important;
    line-height: 19px;
    font-size: 12px !important;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container{
  position: absolute;
  min-height: 730px;
  width: 100%;
  height: 100%;
  left: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // align-items: center;
}
$bg:#4a9beb;
/*$dark_gray:#889aa4;*/
/*$light_gray:#eee;*/
.login-div{
  margin: 0 auto;
  margin-top: 50px;
}
.show-pwd {
  height: 100%;
  line-height: 44px;
  position: absolute;
  right: 15px;
  top: 0px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.captcha-container {
  /*display:flex;*/
  /*justify-content: space-between;*/
  position: relative;
  img {
    position: absolute;
    width: 120px;
    height: 32px;
    bottom: 6px;
    right: 15px;
    text-align: center;
    line-height: 38px;
  }
}
.ckjr-footer{
  position: absolute;
  width: 100%;
  bottom: 57px;
}
.loginForm /deep/ .el-input__inner {
  height: 44px;
}
.loginBtn /deep/ .el-button{
  height: 44px;
}
.yzcode {
  width: 200px;
}
.getcode {
  position: absolute;
  width: 100px;
  height: 20px;
  bottom: 12px;
  right: 15px;
  text-align: center;
  line-height: 1px;
  // border-left: 1px solid #ccc;
  border-radius: 0;
}
.info{
  width: 100%;
  text-align: center;
  margin: 30px auto 0;
  color: #fff;
  font-size: 12px;

}
.loginBtn .loginBtn.active{
  background-color: #529fee;
}
.modifyPassword {
  width: 300px;
  margin: 15px auto 0;
}
.modifyPassword .el-checkbox_label {
  display: inline-block;
  padding-left: 6px !important;
  line-height: 19px;
  font-size: 12px !important;
}
</style>
