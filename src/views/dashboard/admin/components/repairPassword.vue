<template>
  <div>
    <el-tabs class="el-tabs" type="border-card">
      <el-tab-pane label="登录密码">
        <el-form ref="form" :model="loginForm" label-width="100px">
          <el-form-item label="原登录密码:">
            <el-input type="password" class="c-width50" v-model="loginForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新登录密码:">
            <el-input  type="password" class="c-width50" v-model="loginForm.newPassword"></el-input>
            <span>6-20位，必须是数字、字母和特殊字符(# @ ! ~ % ^ & *)组合</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(1)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="操作密码" v-if="companyData.companyId == 0">
        <el-form ref="form" :model="operationForm" label-width="100px">
          <el-form-item label="原操作密码:">
            <el-input type="password" class="c-width50" v-model="operationForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新操作密码:">
            <el-input type="password" class="c-width50" v-model="operationForm.newPassword"></el-input>
            <span>6-20位，必须是数字跟字母组合</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(2)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="管理密码" v-if="companyData.companyId == 0">
        <el-form ref="form" :model="manageForm" label-width="100px">
          <el-form-item label="原管理密码:">
            <el-input type="password" class="c-width50" v-model="manageForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新管理密码:">
            <el-input type="password" class="c-width50" v-model="manageForm.newPassword"></el-input>
            <span>6-20位，必须是数字跟字母组合</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(3)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="授权密码" v-if="companyData.companyId == 0">
        <el-form ref="form" :model="authorizeForm" label-width="100px">
          <el-form-item label="原授权密码:">
            <el-input type="password" class="c-width50" v-model="authorizeForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新授权密码:">
            <el-input type="password" class="c-width50" v-model="authorizeForm.newPassword"></el-input>
            <span>6-20位，必须是数字跟字母组合</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(4)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { toGetCompanyInfo } from '@/api/common'
  import { toUpdatePwd } from '@/api/wechatPublic'
  import { removeLoginType, removeCompanyName } from '@/utils/auth'
  import store from '@/store'

  export default {
    data() {
      return {
        loginForm: {
          oldPassword: '',
          newPassword: ''
        },
        operationForm: {
          oldPassword: '',
          newPassword: ''
        },
        manageForm: {
          oldPassword: '',
          newPassword: ''
        },
        authorizeForm: {
          oldPassword: '',
          newPassword: ''
        },
        companyData: []
      }
    },
    created() {
      this.getCompanyInfo()
    },
    methods: {
      getCompanyInfo() {
        toGetCompanyInfo().then(res => {
          this.companyData = res.data.data
        })
          .catch(err => {
            console.log(err)
          })
      },
      onSubmit(type) {
        var data
        if (type == 1) {
          //  !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
          if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#@!~%^&*.])[a-zA-Z\d#@!~%^&*.]{6,}$/.test(this.loginForm.newPassword)) {
            this.$message.error('密码必须是6-20位数字、字母和特殊字符(!@#~%^&*)组合！')
            return
          }
          data = { 'adminUserId': store.getters.adminUserId, 'type': type, 'oldPwd': this.loginForm.oldPassword, 'newPwd': this.loginForm.newPassword }
        } else if (type == 2) {
          data = { 'adminUserId': store.getters.adminUserId, 'type': type, 'oldPwd': this.operationForm.oldPassword, 'newPwd': this.operationForm.newPassword }
        } else if (type == 3) {
          data = { 'adminUserId': store.getters.adminUserId, 'type': type, 'oldPwd': this.manageForm.oldPassword, 'newPwd': this.manageForm.newPassword }
        } else if (type == 4) {
          data = { 'adminUserId': store.getters.adminUserId, 'type': type, 'oldPwd': this.authorizeForm.oldPassword, 'newPwd': this.authorizeForm.newPassword }
        }
        toUpdatePwd(data).then(res => {
          if (res.data.data.status == 0) {
            this.$message({
              message: '旧密码验证错误！',
              type: 'error'
            })
          } else if (res.data.data.status == 2) {
            this.$message({
              message: '修改后的密码与原密码一致或系统错误，保存失败！',
              type: 'error'
            })
          } else if (res.data.data.status == 1) {
            if (type != 1) {
              this.$message({
                type: 'success',
                message: ' 保存成功! '
              })
              this.close()
            } else {
              this.$message({
                type: 'success',
                message: ' 修改成功，需要重新登录！ '
              })
              removeLoginType()
              removeCompanyName()
              this.$store.dispatch('LogOut').then(() => {
                location.reload()// In order to re-instantiate the vue-router object to avoid bugs
              })
            }
          }
        })
          .catch(err => {
            console.log(err)
          })
      },
      close() {
        this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
          const latestView = views.slice(-1)[0]
          console.log(latestView)
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        })
      }
    }
  }
</script>
<style scoped>
.el-tabs {
  border: none;
  box-shadow: none;
}
</style>
