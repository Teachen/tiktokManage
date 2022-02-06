<template>
  <div id="app">
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view></router-view>
    <div id="mask-defect" class="maskMoudle" :class="noviceGuidance.exit>0?'mask-show':''"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { getLoginType, removeLoginType, removeCompanyName } from '@/utils/auth'
  // import store from '@/store'
  export default{
    name: 'App',
    data() {
      return {
        isMoney: 1
      }
    },
    computed: {
      ...mapGetters([
        'noviceGuidance'
      ])
    },
    beforeCreate() {
      /* if (this.$store.getters.token && (getLoginType() == 1 || getLoginType() == 3)) {
        if (this.$route.path != "/login") {
          removeLoginType();
          removeCompanyName();
          this.$store.dispatch('LogOut').then(() => {
            location.reload();// In order to re-instantiate the vue-router object to avoid bugs
          })
        }
      }*/
    },
    // 表头样式
    provide() {
      return {
        tableHeadStyle: { 'font-family': 'PingFangSC-Semibold', 'backgroundColor': '#f5f7fa', 'color': '#5c6065' },
        tableCss: 'c-width100 c-fc-333 family-PingFangSC-Regular c-fs-12'
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>
<style scoped>
.maskMoudle {
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  opacity: .2;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.mask-show {
  display: block;
}
</style>

<style>
  .el-message-box__message > p {
    white-space: normal !important;
    word-break: break-all !important;
  }

  .el-message-box__wrapper {
    z-index: 100000 !important;
  }
</style>


