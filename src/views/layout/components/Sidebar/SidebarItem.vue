<template>
  <div class="menu-wrapper">
    <template v-for="(item, i) in routes" v-if="!item.hidden&&item.children">
      <template v-if="hasOneShowingChildren(item.children) && item.children[0].path.split('/')[0] == 'customerOperationSystem'">
        <el-menu-item :key="i" @open="open" :id="item.children[0].meta.tId || ''" :index="item.path+'/'" @click="linkToDataPlatform(item.children[0])"
        :class="{'submenu-title-noDropdown':!isNest}">
          <!-- <i class="iconfont menu-icon" v-if="iconVal(item, 'iconfont')" v-html="iconVal(item, 'iconfont')"></i> -->
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                    :icon-class="item.children[0].meta.icon"></svg-icon>
          <span>{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </template>
      <router-link  v-else-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
                   :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item @open="open" :id='item.children[0].meta.tId' :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                    :icon-class="item.children[0].meta.icon"></svg-icon>
          <span
            v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>

        </el-menu-item>
      </router-link>
      <!-- :id="{'width50': generateTitle(item.meta.title)=='知识产品'}" -->
      <el-submenu v-else :index="item.name||item.path" :key="item.name" >
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
        </template>

        <!-- <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item  :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link :class="{'width50': generateTitle(item.meta.title)=='知识产品'}"  v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :class="{'width100': generateTitle(item.meta.title)=='知识产品'}" :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template> -->

        <template v-for="(child,index) in item.children"
                  v-if="!child.hidden && (generateTitle(item.meta.title)=='知识产品')">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                        :routes="[child]" :key="child.path"></sidebar-item>

          <router-link :class="{'width50': generateTitle(item.meta.title)=='知识产品'&&sidebar.opened}" v-else
                       :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :id="child.meta.tId?child.meta.tId:''" @click="nextGuide" :class="{'width100': generateTitle(item.meta.title)=='知识产品'}"
                          :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>

          <router-link :class="{'width50': generateTitle(item.meta.title)=='知识产品'&&sidebar.opened}" to="" :key="index+1"
                       v-if="((index+1) == item.children.length) && item.children.length%2 != 0">
            <el-menu-item  :class="{'width100': generateTitle(item.meta.title)=='知识产品'}" index="" :key="index+1">

            </el-menu-item>
          </router-link>

        </template>


        <template v-for="(child, i) in item.children" v-if="!child.hidden && !(generateTitle(item.meta.title)=='知识产品')">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                        :routes="[child]" :key="child.path"></sidebar-item>

          <router-link :class="{'width50': generateTitle(item.meta.title)=='知识产品'&&sidebar.opened}" v-else
                       :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :id="child.meta.tId?child.meta.tId:''" :class="{'width100': generateTitle(item.meta.title)=='知识产品'}"
                          :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" :title="generateTitle(child.meta.title)">
                <!-- {{generateTitle(child.meta.title)}} -->
                {{limitWordLen(generateTitle(child.meta.title))}}
               </span>
            </el-menu-item>
          </router-link>
        </template>


      </el-submenu>

    </template>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      ...mapGetters([
        'noviceGuidance',
        'toUrlPath'
      ])
    },
    created() {
      // console.log(this.routes, 888)
    },
    methods: {
      open() {},
      hasOneShowingChildren(children) {
        const showingChildren = children.filter(item => {
          return !item.hidden
        })
        if (showingChildren.length === 1) {
          return true
        }
        return false
      },
      generateTitle,
      limitWordLen(val) {
        let dot = ''
        if (val.length > 6) {
          dot = '...'
        }
        return val.substr(0, 6) + dot
      },
      nextGuide() {
        // console.log(this.noviceGuidance.exit, 'exit')
        if (this.noviceGuidance.exit != 0) {
          const curUrl = this.toUrlPath
          this.$store.commit('SET_CURRENT_LINK', '')
          this.$store.commit('SET_CURRENT_LINK', curUrl)
        }
      },
      linkToDataPlatform(data) { // 跳转去教务系统
        var host = window.location.host
        // 有权限跳主页，没权限跳购买页
        const jwUrl = '/dataPlatform/'
        var url = 'http://' + window.location.host + jwUrl
        if (host.includes('localhost')) {
          url = 'http://lecturercs.myckjr.com' + jwUrl
        }
        var tempwindow = window.open('_blank')
        tempwindow.location = url
      }
    }
  }
</script>
<style scoped>
  .width50 {
    padding: 0 !important;
    width: 50% !important;
    min-width: 50% !important;
    float: left;
  }

  .width100 {
    padding: 0 !important;
    width: 100% !important;
    min-width: 50% !important;
    text-align: center;
  }
</style>


