<template>
  <!-- 选择店铺页面，登录账号，若有多个店铺，则先到这个页面 -->
  <div class="c-height100 c-overflow-auto padding-b50 relative c-min-height500 c-flex-column" v-loading="fullscreenLoading">
    <div class="c-box-shadow5">
      <div class="c-max-width1230 margin-0auto c-ph15 c-pv15 c-flex-row c-justify-sb c-aligni-center mp-w100 mp-ph20 mp-textAlign-c mp-mb20">
        <p class="c-flex-row c-aligni-center">
          <a href="http://www.ckjr001.com" target="blank"><img src="@/assets/logo/logo.svg" width="140" alt="" srcset=""></a>
          <span class="padding-l18 margin-l20 c-bl1-xsgray c-fs-14 c-fc-333 mp-hide">账号主页</span>
        </p>
        <p class="c-flex-row c-aligni-center">
          <span class="margin-r20 c-fs-14 c-fc-333" v-if="userInfo.mobile">+86 {{userInfo.mobile}}</span>
          <span class="margin-r20 c-fs-14 c-fc-333" v-else-if="userInfo.username">{{userInfo.username}}</span>
          <el-button type="text" @click="logout">退出</el-button>
        </p>
      </div>
    </div>
    <div class="c-w0 c-flex-grow1 c-flex-column c-justify-sb">
      <div class="c-max-width1230 margin-0auto c-width100">
        <div class="c-mh15 c-fs-24 c-fc-333 c-fw-600 c-line-36  padding-t40 padding-b20">知识店铺</div>
        <div class=" c-flex-row c-flexw-wrap mp-w100 mp-ph20">
          <div v-for="(item, index) in shopList" :key="index" @click="enterShop(item)"
          class="shop-item pointer c-flex-row width380 height130 margin-b30 border-radio10 c-box-shadow4 c-mh15">
            <div class="width6 c-br-bl10 c-br-tl10" :class="item.isMaster ? 'c-bg-blue' : 'c-bg-e6'"></div>
            <div class="c-width0 c-flex-grow1 c-ph20 padding-t25 padding-b15">
              <el-popover v-if="getLength(item.companyName) > 20"
                placement="top-start"
                width="300"
                trigger="hover">
                <div class="c-fs-333">{{item.companyName}}</div>
                <p slot="reference" class="c-fs-16 c-fc-333 c-fw-600 margin-b20 c-text-ellipsis1">{{item.companyName}}</p>
              </el-popover>
              <p v-else class="c-fs-16 c-fc-333 c-fw-600 margin-b20 c-text-ellipsis1">{{item.companyName}}</p>
              <p class="c-fs-12 c-fc-sgray margin-b16">{{versionMap[item.version]}}</p>
              <div class="c-flex-row c-justify-sb c-aligni-center">
                <p class="c-fs-12 c-fc-sgray">有效期至：{{item.expireTime}}</p>
                <span :class="item.isMaster ? 'c-fc-blue c-bd1-blue' : 'c-fc-ccc c-bd1-ccc'" class="c-fs-12 c-pv5 c-ph5 border-radio13">{{roleType(item)}}</span>
              </div>
            </div>
          </div>
        </div>
        <template v-if="isShowQx">
          <div class="c-mh15 c-fs-24 c-fc-333 c-fw-600 c-line-36  padding-t15 padding-b20">
            企业培训 <span class="c-fs-14 c-line-24 c-fc-sgray">企业培训是面向组织培训提供的在线学习平台，可支持企业内部培训及对渠道代理商培训等多种培训场景。</span>
          </div>
          <div class="c-flex-row c-flexw-wrap mp-w100 mp-ph20">
            <div v-if="qxAccountData && qxAccountData.companyName" @click="enterQxShop"
              class="shop-item pointer c-flex-row width380 height130 margin-b30 border-radio10 c-box-shadow4 c-mh15">
              <div class="width6 c-br-bl10 c-br-tl10" :class="'c-bg-blue'"></div>
              <div class="c-width0 c-flex-grow1 c-ph20 padding-t25 padding-b15">
                <el-popover v-if="getLength(qxAccountData.companyName) > 20"
                  placement="top-start"
                  width="300"
                  trigger="hover">
                  <div class="c-fs-333">{{qxAccountData.companyName}}</div>
                  <p slot="reference" class="c-fs-16 c-fc-333 c-fw-600 margin-b20 c-text-ellipsis1">{{qxAccountData.companyName}}</p>
                </el-popover>
                <p v-else class="c-fs-16 c-fc-333 c-fw-600 margin-b20 c-text-ellipsis1">{{qxAccountData.companyName}}</p>
                <p class="c-fs-12 c-fc-sgray margin-b16">{{versionMap[qxAccountData.version]}}</p>
                <div class="c-flex-row c-justify-sb c-aligni-center">
                  <p class="c-fs-12 c-fc-sgray">有效期至：{{qxAccountData.expireTime}}</p>
                  <span :class="'c-fc-blue c-bd1-blue'" class="c-fs-12 c-pv5 c-ph5 border-radio13">{{'高级管理员'}}</span>
                </div>
              </div>
            </div>
            <div v-else class=" c-flex-row c-flexw-wrap mp-w100">
              <div @click="clickShowCreateAccount" class="width380 height130 c-mh15 pointer c-fw-600 c-flex-row c-aligni-center c-justify-center c-fs-16 c-fc-blue c-line-24 c-bdashed-blue border-radio10">
                <span class="el-icon-plus c-fs-16 margin-r5"></span> <span>创建企学院</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="c-fc-14 c-fc-ccc c-textAlign-c padding-t30">{{$t('systemDesc')}}</div>
    </div>
    <!-- 创建企业培训账号 -->
    <super-dialog v-if="showCreateAccount" :show="showCreateAccount" width="600px" class="no-padding"
      @close="closeDialog" :closeOnClickModel="false">
      <template slot="content" v-if="createStep == 0">
        <div class="c-fs-18 c-fc-333 c-textAlign-c">
          <p class="c-fw-600">创建企学院</p>
          <p class="c-fs-14 c-fc-sgray margin-t10 margin-b25">最多可创建一个试用期企学院</p>
        </div>
        <el-form :model="postForm" label-position="right" label-width="130px">
          <el-form-item label="企学院名称：">
            <el-input v-model="postForm.companyName" placeholder="企学院名称，不超过20个字" class="width400" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="成员数量：">
            <el-select clearable v-model="postForm.memberCount" placeholder="请选择成员数量">
              <el-option v-for="item in numberOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <div slot="content" class="c-textAlign-c" v-else>
        <i class="el-icon-success c-fs-50 c-fc-green"></i>
        <p class="c-mv15">企学院创建成功</p>
        <p>wow，优秀的你已完成一大步，请前往后台搭建专属企学院</p>
      </div>
      <div slot="footerBtn" class="c-textAlign-c padding-t20">
        <el-button v-if="createStep == 0" :disabled="formLaoding" @click="submitForm" type="primary">确定</el-button>
        <el-button v-else :disabled="formLaoding" @click="closeDialog('save')" type="primary">关闭</el-button>
      </div>
    </super-dialog>
  </div>
</template>
<script>
import superDialog from '@/views/templatePage/superDialog/index.vue'
import { removeLoginType, removeCompanyName } from '@/utils/auth'
import { companyId } from '@/utils/permission'
import { getLength } from '@/utils/validate'
import { createEtAccount, getEtAccount, getEtAccountToken } from '@/api/login'
// import { getToken } from '@/utils/auth'
export default {
  name: 'selectShop',
  components: { superDialog },
  data() {
    return {
      phone: '',
      companyId: companyId(),
      versionMap: {
        1: '企业版',
        2: '标准版',
        3: '体验版'
      },
      roleTypeMap: {
        1: '高级管理员',
        2: '普通管理员',
        3: '财务',
        8: '子账号'
      },
      numberOptions: [
        { value: 1, key: '1', label: '1-50人' },
        { value: 2, key: '2', label: '51-100人' },
        { value: 3, key: '3', label: '101-300人' },
        { value: 4, key: '4', label: '301-500人' },
        { value: 5, key: '5', label: '501-1000人' },
        { value: 6, key: '6', label: '1001-2000人' },
        { value: 7, key: '7', label: '2001-5000人' },
        { value: 8, key: '8', label: '5001及以上' }
      ],
      fullscreenLoading: false,
      showCreateAccount: false, // 显示创建账号弹框
      qxAccountData: {}, // 企业内训账号信息
      postForm: { // 创建账号form
        companyName: '',
        memberCount: ''
      },
      formLaoding: false, // 创建企学院loading
      createStep: 0 // 创建步骤
    }
  },
  computed: {
    shopList() {
      return JSON.parse(sessionStorage.getItem('allShopList')) || []
    },
    userInfo() {
      return JSON.parse(sessionStorage.getItem('loginUserInfo')) || {
        mobile: '',
        code: ''
      }
    },
    roleType() {
      return function(item) {
        if (item.roleType) {
          return this.roleTypeMap[item.roleType] || '子账号'
        } else {
          return item.isMaster ? '创建者' : '子账号'
        }
      }
    },
    isShowQx() { // 是否显示企业内训 不是忘记密码，并且有主账号存在
      return !(this.userInfo.from && this.userInfo.from == 'resetPwd') && this.shopList.filter(i => i.isMaster).length > 0
    }
  },
  created() {
    if (!sessionStorage.getItem('loginUserInfo')) { // 没拿到登录信息，直接退出
      this.logout()
    }
    this.isShowQx && this.getQxAccount()
  },
  methods: {
    getLength(str) {
      return getLength(str)
    },
    getQxAccount() { // 获取企业内训的账号
      if (this.formLoading) { return }
      this.formLoading = true
      const data = {
        username: this.userInfo.username || this.userInfo.mobile,
        password: this.userInfo.password,
        code: this.userInfo.code
      }
      getEtAccount(data).then(res => {
        this.formLoading = false
        this.qxAccountData = res.data.data
      }).catch(() => {
        this.formLoading = false
      })
    },
    logout(type) {
      // // 退出登录清空关闭提示的session
      this.$store.dispatch('LogOutNoApi').then(() => {
        removeLoginType()
        removeCompanyName()
        sessionStorage.removeItem('allShopList')
        sessionStorage.removeItem('loginUserInfo')
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        if (type && type == 'expireTime') {
          this.$message.error('验证码验证失败，请重新登录')
        }
      })
    },
    enterShop(item) { // 进入店铺
      // 不是修改密码的，要判断交付状态，若是未交付，不可以进入店铺
      if (!(this.userInfo.from && this.userInfo.from == 'resetPwd')) {
        if (item.deliverStatus && item.deliverStatus != 2) { // 0 待交付，1 交付中，2 交付完成
          return this.$message.error('该用户不存在，请联系您的服务经理！')
        }
      }
      if (this.userInfo.from && this.userInfo.from == 'resetPwd') {
        this.resetShopPwd(item)
      } else if (this.userInfo.mobile) {
        this.enterShopMobile(item)
      } else {
        this.enterShopUsername(item)
      }
    },
    enterShopUsername(item) { // 进入店铺通过用户名
      var data = this.userInfo
      data.companyId = item.companyId
      data.loginSuccessful = 1
      this.fullscreenLoading = true
      this.$store.dispatch('Login', data).then((res) => {
        this.fullscreenLoading = false
        if (res.type == 'login') {
          this.$store.commit('SET_ROLES', [])
          document.location.href = '/dashboard'
          // location.reload()
        } else { // 多个店铺的就跳转到选择店铺
          this.$router.push({ name: 'selectShop' })
        }
      }).catch(() => {
        this.fullscreenLoading = false
      })
    },
    enterShopMobile(item) { // 进入店铺通过手机号
      var data = {
        mobile: this.userInfo.mobile,
        code: this.userInfo.code,
        companyId: item.companyId,
        loginSuccessful: 1
      }
      this.fullscreenLoading = true
      this.$store.dispatch('LoginByMobile', data).then((res) => {
        this.fullscreenLoading = false
        if (res.type == 'login') {
          this.$store.commit('SET_ROLES', [])
          document.location.href = '/dashboard'
          // location.reload()
        } else { // 多个店铺的就跳转到选择店铺
          this.$router.push({ name: 'selectShop' })
        }
      }).catch(() => {
        this.fullscreenLoading = false
        this.$alert('切换店铺，验证码登录已过期，请重新登录', '提示', {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            this.logout('expireTime')
          }
        })
      })
    },
    resetShopPwd(item) { // 修改选择店铺的密码 请求修改密码的接口
      var data = this.userInfo
      data.companyId = item.companyId
      this.fullscreenLoading = true
      this.$store.dispatch('ResetPwd', data).then((res) => {
        this.fullscreenLoading = false
        if (res.type == 'success') { // 弹框提示修改成功，跳转登录
          this.$alert('恭喜您，重置密码成功', '提示', {
            confirmButtonText: '立即登录',
            showClose: false,
            center: true,
            callback: action => {
              this.logout()
            }
          })
        } else { // 多个店铺的就跳转到选择店铺
          this.$router.push({ name: 'selectShop' })
        }
      }).catch(() => {
        this.fullscreenLoading = false
      })
    },
    clickShowCreateAccount() { // 点击新建账号
      this.showCreateAccount = true
    },
    closeDialog(type) { // 关闭新建账号弹框
      this.showCreateAccount = false
      this.createStep = 0 // 清除步骤
      this.postForm = { // 创建账号form
        companyName: '',
        memberCount: ''
      }
      this.getQxAccount()
    },
    submitForm() { // 提交创建账号表单
      if (!this.postForm.companyName || this.postForm.companyName.length > 20) {
        this.$message.warning('企学院名称必填，且不超过20个字')
        return
      }
      if (!this.postForm.memberCount) {
        this.$message.warning('成员数量必填')
        return
      }
      if (this.formLaoding) { return }
      this.formLaoding = true
      this.postForm.username = this.userInfo.username || this.userInfo.mobile // 账号/手机号
      this.postForm.password = this.userInfo.password // 密码登录的密码
      this.postForm.code = this.userInfo.code // 验证码登录的验证码
      createEtAccount(this.postForm).then(res => {
        if (this.createStep == 0) {
          this.createStep++
        }
        this.formLaoding = false
      }).catch(() => {
        this.formLaoding = false
      })
    },
    enterQxShop() { // 进入内训系统
      const data = {
        username: this.userInfo.username || this.userInfo.mobile,
        password: this.userInfo.password,
        code: this.userInfo.code
      }
      if (this.formLaoding) { return }
      this.formLaoding = true
      getEtAccountToken(data).then(res => {
        const { token } = res.data.data
        if (!token) {
          this.$message.error('获取失败，请稍后再试')
          return
        }
        this.linkToQx('/login?token=' + token)
        this.formLaoding = false
      }).catch(() => {
        this.formLaoding = false
      })
    },
    linkToQx(linkUrl) {
      const apiUrl = process.env.VUE_APP_BASE_API
      var url = 'https://etradmin.qxckjr.com'
      if (apiUrl.includes('kpapi-cs')) { // 测试
        url = 'http://etradmin-new-cs.tjyx001.com'
      } else if (apiUrl.includes('formalapi.ckjr001.com')) { // formal
        url = 'https://etradmin-new-formal.tjyx001.com'
      }
      // var tempwindow = window.open('_blank')
      // tempwindow.location = url + linkUrl
      window.location = url + linkUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.shop-item:hover {
  box-shadow: 2px 5px 20px 0px rgba(16, 92, 251, 0.12);
  transform: translateY(-8px);
  transition: all ease 0.2s;
}
</style>
