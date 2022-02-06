<template>
  <div class="tags-view-container" style="display:block;">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in visitedViews"
        :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{generateTitle(tag.title)}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
import { generateTitle } from '@/utils/i18n'
import { companyId } from '@/utils/permission'
import { getLoginType } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import { visitStat } from '@/api/common'
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      isAuth: false,
      companyId: null,
      loginType: false
    }
  },
  computed: {
    visitedViews() {
      if (!Array.from) {
        Array.from = function(el) {
          return Array.apply(this, el)
        }
      }
      return Array.from(this.$store.state.tagsView.visitedViews)
    }
  },
  watch: {
    $route(to, from) {
      this.addViewTags()
      this.moveToCurrentTag()
      if (this.loginType == null || this.loginType == 1 || this.loginType == 3) {
        return false
      }
      // console.log('tagsView路由监听：', to, from, new Date().getTime())
      var beforeTime = sessionStorage.getItem(this.companyId + 'beforeTime') ? sessionStorage.getItem(this.companyId + 'beforeTime') : 0
      this.sendVisitState(`/root${from.path}`, Number(beforeTime), `/root${to.path}`, new Date().getTime())
      // 记录下时间  切换路由的上一个时间就是这取
      sessionStorage.setItem(this.companyId + 'beforeTime', new Date().getTime())
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  /**
  * 每日老师在后台管理系统操作，第 N 次访问路由 a 时:
  1. 记录当前路由信息：路由 a，当前时刻Ta；
  2. 发送以下信息到后台：a, Ta, 上一次路由信息（p，Tp），及 Ta-Tp 的差（以秒计算）

  说明：
  * 要判断是否当天的第一个路由（防止用户前一天没关浏览器的情况）
  * 每天的第一次发送，字段为空/0）
  */
  mounted() {
    this.companyId = companyId()
    this.loginType = getLoginType() //
    this.addViewTags()
    // console.log(this.isRoot)
    // if (this.isRoot) { // 管理员
    //   return
    // }
    if (this.loginType == null || this.loginType == 1 || this.loginType == 3) {
      return false
    }
    if (sessionStorage.getItem(this.companyId + 'FirstLogin') == parseTime(new Date().getTime(), '{y}-{m}-{d}')) { // 找到说明不是第一次登陆

    } else {
      sessionStorage.setItem(this.companyId + 'FirstLogin', parseTime(new Date().getTime(), '{y}-{m}-{d}'))
      this.sendVisitState('', 0, `/root${this.$route.path}`, new Date().getTime())
      // 记录下时间  切换路由的上一个时间就是这取
      sessionStorage.setItem(this.companyId + 'beforeTime', new Date().getTime())
    }
  },
  methods: {
    generateTitle, // generateTitle by vue-i18n
    generateRoute() {
      if (this.$route.name) {
        // console.log(this.$route)
        // if(this.$route.name == 'editCourse') {
        //   this.$route.meta.title = 'course.edit.' + this.$route.params.courseType
        //   console.log(this.$route.meta.title)
        //   generateTitle(this.$route)
        // }
        return this.$route
      }
      return false
    },
    sendVisitState(beforeRouter, beforeTime, currentRoute, currentTime) {
      var data = {
        r0: beforeRouter,
        t0: beforeTime,
        r1: currentRoute,
        t1: currentTime
      }
      visitStat(data).then(res => {

      }).catch(() => {

      })
    },
    isActive(route) {
      return route.path === this.$route.path // || route.name === this.$route.name
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (view.name == 'topics') {
            localStorage.removeItem('testBar')
          }
          if (view.name == 'promoters') {
            localStorage.removeItem('commissionBar')
          }
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX - 180
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    z-index: 10;
    // border-bottom: 1px solid #d8dce5;
    box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
    // border-top: 1px solid rgba(0, 0, 0, .12);
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      // border: 1px solid #d8dce5;
      color: #3F474E;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &::before{
        position: absolute;
        content: '|';
        font-size: 10px;
        right: 0px;
        color: #EDEDED;
      }

      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        // background-color: #42b983;
        // color: #fff;
        color: #559EF8;
        // border-color: #42b983;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
        &::after {
          content: '';
          background: #fff;
          height: 2px;
          background: #559EF8;
          width: 23px;
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          bottom: -2px;
          transform: translateX(-10px);
          // display: inline-block;
          // width: 8px;
          // height: 8px;
          // border-radius: 50%;
          // position: relative;
          // margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 12;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
