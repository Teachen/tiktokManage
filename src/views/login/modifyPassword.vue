<template>
  <div class="c-bg-F4F7F9 c-height100 c-overflow-auto padding-b50  login-container">
   <div class="padding-t15 padding-l120 mp-ph0 mp-pb0 mp-textAlign-c mp-mb20">
      <a href="http://www.ckjr001.com" target="blank"><img src="@/assets/logo/logo.svg" width="140" alt="" srcset=""></a>
    </div>
    <div class="c-bg-white width600 margin-0auto c-box-shadow4 border-radio10 c-pv40 mp-w100">
      <div class="c-width60 margin-0auto mp-w80">
        <p class="c-textAlign-c c-fs-16 c-fc-333 c-fw-600 margin-b30">{{$t('modifyPassword.subTitle')}}</p>
        <template v-if="successStatus == -1">
          <el-form class="loginForm" autoComplete="on" :model="modifyPasswordForm" :rules="modifyPasswordRules" ref="modifyPasswordForm"
            label-position="left">
            <el-form-item prop="mobile">
              <el-input class="el-input" name="mobile" type="tel" v-model.trim="modifyPasswordForm.mobile" autoComplete="off"
                        placeholder="请输入手机号码"/>
            </el-form-item>
            <el-form-item prop="captcha">
              <div class="captcha-container">
                <el-input class="el-input"  name="captcha" type="text" maxlength="14" v-model="captcha" placeholder="请输入验证码" />
                <img v-show="captchaImg!=null" :src="captchaImg" @click="loadCaptcha" title="点击图片重新获取验证码" style="cursor: pointer;">
              </div>
            </el-form-item>
            <el-form-item prop="code">
              <div class="captcha-container">
                <el-input  autocomplete="off" class="el-input" name="code" type="text" maxlength="16" v-model="modifyPasswordForm.code"
                          placeholder="请输入验证码"/>
                <el-button :disabled="isClick||captcha.length<4" class="getcode" type="text" @click="getYzcode" style="cursor: pointer;">
                  {{yzText}}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <password-input role="input" :autofocus="false" placeholder="请输入密码" @changeValue="getOptionPassword($event, 'password')" @makeSure="makeSure"></password-input>
              <!-- <el-input class="el-input" name="password" :type="passwordType" v-model="modifyPasswordForm.password"
                        autoComplete="on" placeholder="请输入密码"/> -->
            </el-form-item>
            <el-form-item prop="confirmPwd">
              <password-input role="input" :autofocus="false" placeholder="请输入确认密码" @changeValue="getOptionPassword($event, 'confirmPwd')" @makeSure="makeSure"></password-input>
              <!-- <el-input type="password" name="confirmPwd" v-model="modifyPasswordForm.confirmPwd" auto-complete="off"
                        placeholder="请输入确认密码"></el-input> -->
            </el-form-item>
          </el-form>
          <div class="loginBtn padding-t8">
            <el-button class="c-width100 c-box-shadow6"
                      :class="{active: modifyPasswordForm.mobile&&modifyPasswordForm.password&&modifyPasswordForm.code&&modifyPasswordForm.confirmPwd}"
                      type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click.native.prevent="modifyPassword">
              {{$t('modifyPassword.confirm')}}
            </el-button>
          </div>
          <div class="c-textAlign-c margin-t10"><el-button type="text" @click="linkLogin">返回登录</el-button></div>
        </template>
        <!-- 密码修改成功 -->
        <div v-else class="c-flex-column c-aligni-center c-pv40">
          <i class="c-fc-2ad66e el-icon-success c-fs-92"></i>
          <div class="c-fs-16 margin-t40 c-fc-333">恭喜您，重置密码成功</div>
          <div class="loginBtn c-width100 padding-t40">
            <el-button class="c-width100 c-box-shadow6" type="primary" @click.native.prevent="linkLogin">
              立即登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="c-textAlign-c c-fc-c0c4cc c-fs-14">
      <p class="padding-b23">{{$t('systemDesc')}}</p>
      <p>{{$t('systemCopyright')}}</p>
    </div>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/login'
// confirmModifyPassword
import { sendCodeByForget } from '@/api/login'
import { isPhoneNumber } from '@/utils/validate'
import passwordInput from '@/components/newPasswordInput/index.vue'
export default {
  name: 'modifyPassword',
  components: { passwordInput },
  data() {
    const validateTel = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        callback(new Error('请输入手机号码'))
      } else {
        // !/^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/.test(value)
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
        if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#@!~%^&*.])[a-zA-Z\d#@!~%^&*.]{6,}$/.test(value)) {
          callback(new Error('请输入至少6位的数字、字母和特殊字符(#@!~%^&*)的组合密码'))
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyPasswordForm.password) {
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
    return {
      isYz: true,
      isClick: false,
      yzText: '获取验证码',
      num: 30,
      modifyPasswordForm: {
        mobile: '',
        password: '',
        confirmPwd: '',
        code: ''
      },
      modifyPasswordRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateTel }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPwd: [{ required: true, trigger: 'blur', validator: validatePass2 }],
        code: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      passwordType: 'password',
      fullscreenLoading: false,
      captchaImg: null,
      captchaKey: null,
      captcha: '',
      timer: null,
      successStatus: -1 // 密码修改成功状态 -1没成功 1 成功
    }
  },
  mounted() {
    this.loadCaptcha()
  },
  methods: {
    getOptionPassword(value, type) {
      if (type == 'password') {
        this.modifyPasswordForm.password = value
      } else {
        this.modifyPasswordForm.confirmPwd = value
      }
    },
    makeSure() {},
    handleLogin() {
      this.loadCaptcha()
    },
    loadCaptcha() {
      getCaptcha().then(res => {
        this.captchaImg = res.data.data.img
        this.captchaKey = res.data.data.key
      }).catch(err => {
        console.log(err)
      })
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
      if (this.modifyPasswordForm.mobile == null || this.modifyPasswordForm.mobile == '' || this.modifyPasswordForm.mobile.trim() == '') {
        this.$message({
          message: '请先填写手机号码再获取验证码',
          type: 'error'
        })
        return
      }
      // !/^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/.test(this.modifyPasswordForm.mobile)
      if (!isPhoneNumber(this.modifyPasswordForm.mobile)) {
        this.$message({
          message: '请先填写正确的手机号码再获取验证码',
          type: 'error'
        })
        return
      }

      var data = { mobile: this.modifyPasswordForm.mobile, type: 2, captcha: this.captcha, captchaKey: this.captchaKey }
      this.yzText = '正在发送短信'
      sendCodeByForget(data).then(res => {
        if (res.data.statusCode == 200) {
          this.getYzMethod()
          this.timer = setInterval(this.getYzMethod, 1000)
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          })
        } else if (res.data.statusCode == 500) {
          this.loadCaptcha()
          this.yzText = '获取验证码'
          this.$message({
            message: 'res.msg',
            type: 'info'
          })
        }
      }).catch((error) => {
        this.loadCaptcha()
        this.yzText = '获取验证码'
        console.log(error)
      })
    },
    modifyPassword() {
      var data = {
        mobile: this.modifyPasswordForm.mobile,
        code: this.modifyPasswordForm.code,
        password: this.modifyPasswordForm.password,
        confirmPwd: this.modifyPasswordForm.confirmPwd,
        from: 'resetPwd'
      }
      this.$refs.modifyPasswordForm.validate(valid => {
        if (valid) {
          if (this.fullscreenLoading) {
            return
          }
          // 重置密码多店铺更改，成功之后要跳转到多店铺选择，选择店铺才能保存成功，单个店铺还是直接保存
          this.fullscreenLoading = true
          this.$store.dispatch('ResetPwd', data).then((res) => {
            this.fullscreenLoading = false
            if (res.type == 'success') {
              this.successStatus = 1 // 状态置为1
            } else { // 多店铺
              this.$router.push({ name: 'selectShop' })
            }
          }).catch(() => {
            this.fullscreenLoading = false
            this.successStatus = -1 // 状态置为1
          })
          // confirmModifyPassword(data).then(res => {
          //   console.log('注册', res)
          //   if (res.data.statusCode == 200) {
          //     this.fullscreenLoading = false
          //     this.$message({
          //       message: '恭喜你，密码修改成功',
          //       type: 'success'
          //     })
          //     this.successStatus = 1 // 状态置为1
          //   } else if (res.data.statusCode == 500) {
          //     this.$message({
          //       message: res.data.data.info,
          //       type: 'warning'
          //     })
          //     this.successStatus = -1 // 状态置为1
          //   }
          //   // this.$router.push({ path: '/modifyPasswordSuccess', query: { mobile: this.modifyPasswordForm.mobile, password: this.modifyPasswordForm.password }})
          // }).catch(() => {
          //   this.fullscreenLoading = false
          //   this.successStatus = -1 // 状态置为1
          //   this.loadCaptcha()
          // })
        } else {
          return false
        }
      })
    },
    linkLogin() {
      this.$router.push({ name: 'login', params: { mobile: this.$route.params.mobile, password: this.$route.params.password }})
    }
  },
  created() {

  },
  destroyed() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container{
  position: absolute;
  min-height: 750px;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
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
