<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container">

    </sidebar>

    <div class="main-container">
      <div class="nav-box">
        <!-- 导航logo -->
        <router-link to="/dashboard" tag="div" class="nav-box-logo pointer">
            <img src="../../assets/logo/logo-icon.svg" alt="">
            创客匠人
        </router-link>

        <!-- 导航信息 -->
        <div class="nav-box-info" :class="sidebar.opened?'':'open'">
          <navbar></navbar>
          <tags-view></tags-view>
        </div>
      </div>

      <div ref="appScroll" id="appScroll" style="height:calc(100% - 84px);overflow:auto;position:relative;" :style="sidebar.opened?'margin-left:180px;':'margin-left:0px;'">
        <app-main id="appMain" :class="bgCss" style="overflow:hidden;"></app-main>
        <div class="c-pv25" v-if="withOutBottomSpace" :class="bgCss"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain, TagsView } from './components'
  import { mapGetters } from 'vuex'
  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView
    },
    created() {
      // console.log(this.$refs, 9997)
    },
    watch: {
      $route(to) {
        $('#appScroll').scrollTop(0) // eslint-disable-line
        // console.log(to.path, 'tt')
        // this.SET_TO_URL_PATH

        this.$store.commit('SET_TO_URL_PATH', to.path)

        this.$refs.appScroll.scrollTop = 0
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      ...mapGetters([
        'noviceGuidance',
        'toUrlPath'
      ]),
      bgCss() {
      // 背景色要改为
        var routeArr = ['messagePush']
        if (routeArr.indexOf(this.$route.name) != -1) {
          return 'c-bg-F8F9FB'
        }
      },

      withOutBottomSpace() {
        return ![
          'messagePush'
        ].includes(this.$route.name)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
      min-width: 1024px;
      >.nav-box {
        @include clearfix;
        >.nav-box-logo{
          width: 180px;
          height: 50px;
          line-height: 50px;
          // text-align: center;
          padding-left: 20px;
          text-align: left;
          // float: left;
          position: absolute;
          z-index: 10;
          background: #fff;
          &::after{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            height: 10px;
            width: 1px;
            background: #EDEDED;
          }
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
          >img{
            display: inline-block;
            vertical-align: middle;
            width: 24px;
            height: 24px;
          }
        }
        >.nav-box-info{
          width: calc(100% - 180px);
          position: relative;
          z-index: 11;
          // float: right;
          float: right;
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
        }
        >.nav-box-info.open{
          width: 100%;
          // float: right;
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
        }
      }

    }
  }

  // .app-wrapper .main-container {
  //   min-width: 1024px;
  // }
</style>
