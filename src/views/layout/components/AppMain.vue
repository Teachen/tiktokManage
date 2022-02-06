<template>
  <section class="app-main c-flex-column" style="min-height: 100%">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
      <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    </transition>
    <div :class="bgCss"></div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  data() {
    return {
      bgCss: ''
    }
  },
  watch: {
    $route: function(to, from) {
      this.$nextTick(() => {
        this.bgCss = ['liveData', 'tikTokAnalysis'].includes(to.name) ? 'c-bg-f5 padding-t15' : 'c-pv25 c-bg-fff'
      })
      // console.log(this.bgCss, 'a', to.name)
    }
  }
}
</script>
