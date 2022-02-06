<template>
  <div class="login-container">
    <div class="loginForm-container">
      <el-form class="login-form" autoComplete="on"
               label-position="left">
        <div class="title-container c-fc-fff">
          <div class="width290 margin-0auto">
            <p class="margin-r10 fl">
              <svg-icon icon-class="logo" style="vertical-align: middle;" class="margin-l c-fs-28 c-mt-f3"/>
            </p>
            <p class="fl">{{$t('modifyPasswordSuccess.title')}}</p>
          </div>

        </div>
        <div class="center padding-t60 margin-t">
          <i class="c-fc-2ad66e el-icon-success c-fs-92 padding-t60"></i>
          <div class="c-fs-16 margin-t40">恭喜您，重置密码成功</div>
        </div>

        <div class="login padding-t60">
          <el-button class="loginBtn"type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click.native.prevent="linkLogin">

            立即登录
          </el-button>
        </div>
      </el-form>
      <div class="info">创客匠人版权所有 闽ICP备16007622号-1</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modifyPasswordSuccess',
    data() {
      return {
        companyId: '',
        companyName: '',
        fullscreenLoading: false
      }
    },
    mounted() {

    },
    methods: {
      linkLogin() {
        this.$router.push({ name: 'login', params: { mobile: this.$route.query.mobile, password: this.$route.query.password }})
      }
    },
    created() {

    },
    destroyed() {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  /* reset element-ui css */
  .login-container {

  .el-input {
    display: inline-block;
    height: 42px;
    width: 300px;
    border: 0;
    border-bottom: 1px solid #ccc;

  input {
    height: 42px;
    width: 300px;
    border: 0;
    border-bottom: 1px solid #ccc;
    -webkit-appearance: none;
    border-radius: 0px;
    /*padding: 6px 5px 6px 0px;*/
    padding-left: 0;
    color: #353535;

  &
  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    /*-webkit-text-fill-color: #fff !important;*/
  }

  }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

  /*$dark_gray:#889aa4;*/
  /*$light_gray:#eee;*/

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #3b96e9;
    background-image: url(../../assets/login_bg.jpg);
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;

  .login-form {
    position: relative;
    width: 400px;
    height: 480px;
    /*padding: 35px 35px 15px 35px;*/
    padding-left: 0;
    background-color: #fff;
    border-radius: 10px;

  .input {
    color: #353535;
    height: 30px;
    width: 300px;
    margin: 0px auto 30px;
    font-size: 14px;
    border: 0;
    border-bottom: 1px solid #ccc;
  }

  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

  span {


  :first-of-type {
    margin-right: 16px;
  }

  }
  }

  .title-container {
    position: absolute;
    width: 270px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    left: 50%;
    top: -30px;
    margin-left: -135px;
    background-color: #529fee;
    border-radius: 10px;
    font-size: 18px;
    color: #fff;
    box-shadow: 0px 3px 3px rgba(82, 159, 238, .5);

  .set-language {
    color: #fff;
    position: absolute;
    top: 5px;
    right: 0px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #fff;
    vertical-align: middle;
    width: 36px;
    display: inline-block;
  }

  }
  .title {
    font-size: 16px;
    font-weight: 400;
    color: #529fee;
    margin: 50px auto 10px auto;
    text-align: center;
    padding-top: 50px;
  }

  .login {
    width: 300px;
    height: 44px;
    margin: 50px auto 30px;
    font-size: 14px;

  .loginBtn {
    display: inline-block;
    width: 300px;
    height: 44px;
    background-color: rgb(82, 159, 238);
    border: 0;
  }

  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }

  .captcha-container {
    position: relative;
  .getcode {
    position: absolute;
    width: 120px;
    height: 20px;
    bottom: 12px;
    right: 0;
    text-align: center;
    line-height: 1px;
    border-left: 1px solid #ccc;
    border-radius: 0;
  }

  }
  }
  .info {
    width: 100%;
    text-align: center;
    margin: 30px auto 0;
    color: #fff;
    font-size: 12px;

  }

  .login .loginBtn.active {
    background-color: #529fee;
  }

  .login-form .input .el-input {
    padding: 0;
  }

  .register {
    color: #529fee;
  }

  .login-container .loginForm-container {
    width: 400px;
    position: absolute;
    left: 50%;
    top: 5%;
    margin-left: -200px;

  }

  .yzcode {
    width: 200px;
  }
</style>
