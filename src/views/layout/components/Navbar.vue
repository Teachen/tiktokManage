<template> 
  <el-menu class="navbar" mode="horizontal">
    <breadcrumb v-if="showLeftMenu" class="breadcrumb-container" :style="sidebar.opened?'':'margin-left:134px;'"></breadcrumb>
    <div class="right-menu clearfix">
      <hamburger class="hamburger-container mobile-show"
               :toggleClick="toggleSideBar" :isActive="!!sidebar.opened"></hamburger>
        <div class="right-menu-item fl">
          <el-dropdown class="avatar-container initDrownStyle" trigger="hover">
            <div class="avatar-wrapper">
              <img class="user-avatar height30 width30 c-br-50 margin-r10" :src="avatar">
              {{companyName}}
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/">
                <el-dropdown-item>
                  {{$t('navbar.dashboard')}}
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided v-if="loginType == 1 || loginType == 3 && userType == 0">
                <div @click="goBack" style="display:block;">{{$t('navbar.goBack')}}</div>
              </el-dropdown-item>
              <router-link to="/repairPassword/index">
                <el-dropdown-item divided>
                  {{$t('navbar.password')}}
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <div @click="logout" style="display:block;">{{$t('navbar.logOut')}}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { removeLoginType, getLoginType, setLoginType, removeCompanyName } from '@/utils/auth'
  import { companyId, isRoot } from '@/utils/permission'
  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    props: {
      showLeftMenu: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        userType: 1,
        companyName: null,
        isDashboard: false,
        isRoot: isRoot(), // 是否是总部管理员
        companyId: null
      }
    },
    watch: {
      $route: function(to, from) {
        if (to.name == 'dashboard') {
          // console.log(11111111, '执行')
          this.getCompanyVersion()
          this.isDashboard = true
        } else {
          this.isDashboard = false
        }
      }
    },
    created() {
      // const companyName = getCompanyName()
      // this.companyName = companyName == null || companyName == '' ? this.name : companyName
      this.companyName = this.name
      this.userType = getLoginType()
      this.getCompanyVersion()
      if (this.$route.name == 'dashboard') {
        this.getCompanyVersion()
        this.isDashboard = true
      } else {
        this.isDashboard = false
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'loginType',
        'noviceGuidance'
      ])
    },
    methods: {
      getCompanyVersion() {
        this.companyId = companyId()
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        removeLoginType()
        removeCompanyName()
        // 退出登录清空关闭提示的session
        sessionStorage.removeItem(this.companyId + 'closeExpire')
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
          sessionStorage.removeItem(companyId() + 'reportDialog')
        })
      },
      goBack() {
        this.$store.dispatch('LoginProxy', 0).then(res => {
          setLoginType(this.loginType)
          // setCompanyName('总部管理员')
          document.location.href = 'http://' + window.location.host + '/root/dashboard'
          // document.location.href = '/dashboard'
          // 退出登录清空关闭提示的session
          sessionStorage.removeItem(this.companyId + 'closeExpire')
          sessionStorage.removeItem(companyId() + 'reportDialog')
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mobile-show {
    display: none;
  }
  @media screen and (max-width: 960px)  {
    .mobile-show {
      display: block
    }
  }

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      color: #303945;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        // margin: 0 8px;
        padding: 0 20px;
        position: relative;
        font-size: 14px;
        &+.right-menu-item:before{
          content: '|';
          font-size: 10px;
          position: absolute;
          left: 0;
          color: #EDEDED;

        }
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          cursor: pointer;
          // margin-top: 5px;
          position: relative;
          >img{
            display: inline-block;
            vertical-align: middle;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 20px;
            font-size: 12px;
          }

        }
      }
    }
  }
</style>
