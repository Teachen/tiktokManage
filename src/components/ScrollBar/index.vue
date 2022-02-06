<template>
  <div class="scroll-container"  ref="scrollContainer" @mouseover.prevent>
    <div class="scroll-box" id="scroll-box" style="">
      <div style="width:190px;padding-bottom: 50px;">
          <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
            <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const delta = 15

export default {
  name: 'scrollBar',
  data() {
    return {
      top: 0
    }
  },
  computed: {

    ...mapGetters([
      'noviceGuidance'
    ])
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerHeight = $container.offsetHeight
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperHeight = $wrapper.offsetHeight
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta)
      } else {
        if ($containerHeight - delta < $wrapperHeight) {
          if (this.top < -($wrapperHeight - $containerHeight + delta)) {
            this.top = this.top
          } else {
            this.top = Math.max(this.top + eventDelta, $containerHeight - $wrapperHeight - delta)
          }
        } else {
          this.top = 0
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';

#app .sidebar-container {
  margin-top: 50px;
  height: calc(100% - 50px);
  // overflow: hidden !important;
}
.scroll-box::-webkit-scrollbar{
  width: 4px;
  height: 6px;
}
// 轨道
.scroll-box::-webkit-scrollbar-track-piece
{
  background-color: #303945;
  // -webkit-border-radius: 6px;
}
// 滚动条
.scroll-box::-webkit-scrollbar-thumb:vertical{
  height: 3px;
  background-color: #303945;
  // background-color: rgba(126, 132, 139, 0.6);
  // -webkit-border-radius: 6px;
}
// 滚动条
.scroll-box::-webkit-scrollbar-thumb:horizontal{
  width: 5px;
  background-color: transparent;
  -webkit-border-radius: 6px;
}
.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
  .scroll-box {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    box-sizing: content-box;
    width: 100%;
    // padding-right: 20px;
  }
  .noScroll {
    overflow: hidden;
  }
  .scroll-wrapper {
    // position: absolute;
     width: 100% !important;
  }
}
</style>
