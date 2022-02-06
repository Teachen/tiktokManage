<template>
  <div class="c-bg-F4F7F9 c-height100 c-overflow-auto padding-b50 login-container">
    <div class="padding-t15 padding-l120 mp-ph0 mp-pb0 mp-textAlign-c mp-mb20">
      <a href="http://www.ckjr001.com" target="blank"><img src="@/assets/logo/logo.svg" width="140" alt="" srcset=""></a>
    </div>
    <div class="c-bg-white width600 margin-0auto c-box-shadow4 border-radio10 c-pv40 mp-w100">
      <div class="c-width60 margin-0auto mp-w80">
        <p class="c-textAlign-c c-fs-16 c-fc-333 c-fw-600 margin-b30">{{$t('register.subTitle')}}</p>
        <el-form class="loginForm" autoComplete="on" :model="registerForm" :rules="registerRules" ref="registerForm"
          label-position="left">
          <el-form-item prop="mobile">
            <el-input class="el-input" name="mobile" type="tel" v-model.trim="registerForm.mobile" autoComplete="off"
                      placeholder="请输入手机号码"/>
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="captcha-container">
              <el-input class="el-input"  name="captcha" type="text" maxlength="14" v-model="captcha" placeholder="请输入验证码" />
              <img v-show="captchaImg!=null" :src="captchaImg" @click="loadCaptcha" title="点击图片重新获取验证码" style="cursor: pointer;">
            </div>
          </el-form-item>
          <el-form-item class="input" prop="code">
            <div class="captcha-container">
              <el-input  autocomplete="off" class="el-input" name="code" type="text" maxlength="16" v-model="registerForm.code"
                        placeholder="请输入验证码"/>
              <el-button :disabled="isClick||captcha.length<4" class="getcode" type="text" @click="getYzcode" style="cursor: pointer;">
                {{yzText}}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item class="input" prop="password">
            <password-input role="input" placeholder="请输入密码" @keyup.enter.native="register"  @changeValue="getOptionPassword" @makeSure="makeSure"></password-input>
          </el-form-item>
          <div class="loginBtn padding-t8">
            <el-button class="c-width100 c-box-shadow6"
                      :class="{active: registerForm.mobile&&registerForm.password&&registerForm.code}"
                      type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click.native.prevent="register">
              {{$t('register.register')}}
            </el-button>
          </div>
          <div class="center c-fs-14 c-fc-666 margin-t30">已有账号？<b class="register weight" @click="linkToLogin">立即登录</b></div>
        </el-form>
      </div>
    </div>
    <div class="c-textAlign-c c-fc-c0c4cc c-fs-14">
      <p class="padding-b23">{{$t('systemDesc')}}</p>
      <p>{{$t('systemCopyright')}}</p>
    </div>
  </div>
</template>

<script>
  import { getAreaList } from '@/api/common'
  import { getCaptcha } from '@/api/login'
  import { childTypeListR, companyTypeListR } from '@/api/wechatPublic'
  import { sendMessage, confirmRegister } from '@/api/login'
  import passwordInput from '@/components/newPasswordInput/index.vue'
  import { isPhoneNumber } from '@/utils/validate'
  export default {
    name: 'register',
    components: { passwordInput },
    data() {
      const validateTel = (rule, value, callback) => {
        if (!value || value.trim() == '') {
          callback(new Error('请输入手机号码'))
        } else {
          // if (!/^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/.test(value)) {
          //   callback(new Error('请输入正确的手机号码'))
          // }
          if (!isPhoneNumber(value)) {
            callback(new Error('请输入正确的手机号码'))
          }
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!value || value.trim() == '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/(?=.*\d)(?=.*[A-z])^[0-9A-z]{6,}$/.test(value)) {
            callback(new Error('请输入至少6位的数字与字母的组合密码'))
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (!value || value.trim() == '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
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
      const validateCompanyName = (rule, value, callback) => {
        if (!value || value.trim() == '') {
          callback(new Error('请输入店铺名称'))
        } else {
          callback()
        }
      }
      return {
        isYz: true,
        isClick: false,
        yzText: '获取验证码',
        num: 30,
        childType: [],
        companyParentType: [],
        provinceList: [],
        cityList: [],
        registerForm: {
          mobile: '',
          password: '',
          confirmPwd: '',
          code: '',
          companyName: '',
          channel: null,
          companyParentTypeId: null,
          companyChildrenTypeId: null,
          baseProvinceId: null,
          baseCityId: null
        },
        captchaKey: null,
        captcha: '',
        registerRules: {
          mobile: [{ required: true, trigger: 'blur', validator: validateTel }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          confirmPwd: [{ required: true, trigger: 'blur', validator: validatePass2 }],
          code: [{ required: true, trigger: 'blur', validator: validateCaptcha }],
          companyName: [{ required: true, trigger: 'blur', validator: validateCompanyName }],
          companyParentTypeId: [{ required: true, message: '请选择行业分类', trigger: 'change' }],
          baseProvinceId: [{ required: true, message: '请选择公司地址', trigger: 'change' }]

        },
        passwordType: 'password',
        fullscreenLoading: false,
        captchaImg: null,
        timer: null
      }
    },
    mounted() {
      this.loadCaptcha()
    },

    methods: {
      handleLogin() {
        this.loadCaptcha()
      },
      getOptionPassword(value) {
        this.registerForm.password = value
      },
      loadCaptcha() {
        getCaptcha().then(res => {
          this.captchaImg = res.data.data.img
          this.captchaKey = res.data.data.key
        }).catch(err => {
          console.log(err)
        })
      },
      getAreaList() {
        getAreaList().then(res => {
          this.provinceList = res.data.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      areaChange(val, isfre = true) {
        if (!val) {
          this.cityList = []
          this.registerForm.baseCityId = null
          return false
        }
        getAreaList(val).then(res => {
          if (res.data.data.level == 2) {
            if (isfre) {
              this.registerForm.baseCityId = null
            }
            this.cityList = res.data.data.data
          } else if (res.data.data.level == 3) {
            this.areaList = res.data.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getcompanyTypeListR() {
        companyTypeListR({ type: 2 }).then(res => {
          this.companyParentType = res.data.data
        })
      },
      getchildTypeListR(id) {
        childTypeListR(id).then(res => {
          this.childType = res.data.data
        })
      },
      selectParent(val) {
        this.childType = []
        this.registerForm.companyChildrenTypeId = ''
        if (!val) {
          return
        }
        this.getchildTypeListR(val)
      },
      selectChild() {
        this.$forceUpdate()
      },
      getYzMethod() {
        this.isClick = true
        this.isYz = false
        this.num -= 1
        this.yzText = this.num + '秒后重新获取'
        if (this.num == 0) {
          clearInterval(this.timer)
          this.yzText = '获取验证码'
          this.num = 30
          this.isClick = false
          this.isYz = true
        }
      },
      getYzcode() {
        clearInterval(this.timer)
        if (this.registerForm.mobile == null || this.registerForm.mobile == '' || this.registerForm.mobile.trim() == '') {
          this.$message({
            message: '请先填写手机号码再获取验证码',
            type: 'error'
          })
          return
        }
        // !/^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/.test(this.registerForm.mobile)
        if (!isPhoneNumber(this.registerForm.mobile)) {
          this.$message({
            message: '请先填写正确的手机号码再获取验证码',
            type: 'error'
          })
          return
        }

        var data = { mobile: this.registerForm.mobile, type: 1, captcha: this.captcha, captchaKey: this.captchaKey }
        this.yzText = '正在发送短信'
        sendMessage(data).then(res => {
          console.log('验证码', res)
          if (res.data.statusCode == 200) {
            this.getYzMethod()
            this.timer = setInterval(this.getYzMethod, 1000)
            this.$message({
              message: '验证码发送成功',
              type: 'success'
            })
          } else if (res.data.statusCode == 500) {
            this.loadCaptcha()
            this.$message({
              message: 'res.msg',
              type: 'info'
            })
          }
        }).catch((error) => {
          this.yzText = '获取验证码'
          console.log(error)
          this.loadCaptcha()
        })
      },
      register() {
        var data = {
          mobile: this.registerForm.mobile,
          code: this.registerForm.code,
          password: this.registerForm.password,
          confirmPwd: this.registerForm.confirmPwd,
          channel: this.channel // 来源
          // companyName: this.registerForm.companyName,
          // companyParentTypeId: this.registerForm.companyParentTypeId,
          // companyChildrenTypeId: this.registerForm.companyChildrenTypeId,
          // baseProvinceId: this.registerForm.baseProvinceId,
          // baseCityId: this.registerForm.baseCityId
        }
        this.$refs.registerForm.validate(valid => {
          // if (!this.registerForm.companyParentTypeId) {
          //   this.$message({
          //     message: '请选择一级行业类别',
          //     type: 'info'
          //   })
          //   return
          // }
          // if (!this.registerForm.companyChildrenTypeId) {
          //   this.$message({
          //     message: '请选择二级行业类别',
          //     type: 'info'
          //   })
          //   return
          // }
          // if (!this.registerForm.baseProvinceId) {
          //   this.$message({
          //     message: '请选择省',
          //     type: 'info'
          //   })
          //   return
          // }
          // if (!this.registerForm.baseCityId) {
          //   this.$message({
          //     message: '请选择市',
          //     type: 'info'
          //   })
          //   return
          // }
          if (valid) {
            if (this.fullscreenLoading) {
              return
            }
            this.fullscreenLoading = true
            confirmRegister(data).then(res => {
              console.log('注册', res)
              if (res.data.statusCode == 200) {
                this.fullscreenLoading = false
                this.$message({
                  message: '恭喜您，注册成功',
                  type: 'success'
                })
              }
              sessionStorage.setItem('registMobile', this.registerForm.mobile)
              sessionStorage.setItem('registPassword', this.registerForm.password)
              const { companyName, companyId } = res.data.data
              this.$router.push({
                name: 'perfectInfo',
                params: {
                  companyId,
                  companyName
                }
              })
              // this.$router.push({
              //   path: '/creatSuccess'
              // })
            }).catch(() => {
              this.fullscreenLoading = false
            })
          } else {
            return false
          }
        })
      },
      // 设置cookie
      setCookie(channel, exdays) {
        var exdate = new Date() // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
        var isSecure = document.location.protocol == 'https:'
        // 字符串拼接cookie
        window.document.cookie = 'channel' + '=' + channel + ';path=/;expires=' + exdate.toGMTString() + `${isSecure ? ';secure=true' : ''}`
      },
      // 读取cookie
      getCookie() {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
          for (let i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=') // 再次切割
            // 判断查找相对应的值
            if (arr2[0] == 'channel') {
              return arr2[1] // 保存到保存数据的地方
            }
          }
          return ''
        }
      },
      // 清除cookie
      clearCookie() {
        this.setCookie('', -1) // 修改2值都为空，天数为负1天就好了
      },
      linkToLogin() {
        this.$router.push({ name: 'login' })
      }
    },
    created() {
      // this.getcompanyTypeListR()
      // this.getAreaList()
      this.channel = this.$route.query.ch ? this.$route.query.ch : ''
      if (!this.channel) {
        if (this.getCookie() != '') {
          this.channel = this.getCookie()
        } else {
          this.channel = ''
        }
      } else {
        this.setCookie(this.$route.query.ch, 7)
      }
    },
    destroyed() {

    }
  }
</script>

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
}
.loginForm /deep/ .el-input__inner {
  height: 44px;
}
.loginBtn /deep/ .el-button{
  height: 44px;
}

.loginBtn .loginBtn.active {
  background-color: #529fee;
}
</style>

