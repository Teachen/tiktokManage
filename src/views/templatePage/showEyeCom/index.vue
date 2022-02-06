<template>
  <div class="c-flex-row relative">
    <p :style="{width: width+'px'}" :class="wordLimitLine" class="'c-fs-14 c-fc-333 c-textAlign-l'">
      <span v-if="isVhtml"><span v-html="formatHtml(value)" ref="nameContainer"></span></span>
      <span v-else ref="nameContainer"><slot name="value">{{value}}</slot></span>
    </p>
    <el-popover width="360" v-if="isShowEye() || showEye"
      placement="left"
      trigger="hover">
      <div v-if="isVhtml" v-html="formatHtml(value)"></div>
      <div v-else class="c-ws-pw">{{value}}</div>
      <i slot="reference" class="el-icon-view c-fc-blue"
      :class="wordLimitLine != 'c-text-ellipsis1' ? 'eyebottom' : ''"></i>
    </el-popover>
  </div>
</template>
<script>
// c-ws-pw
export default {
  name: 'showEyeCom',
  props: {
    value: { // 显示的value值
      type: String,
      default: []
    },
    width: { // 限制宽度
      type: [Number, String],
      default: 150
    },
    limitLen: Number, // 限制限制的字符长度
    wordLimitLine: { // 省略号行数限制
      type: String,
      default: 'c-text-ellipsis1'
    },
    // nameClass: { // 名称样式
    //   type: String,
    //   default: ''
    // },
    isVhtml: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showEye: false
    }
  },
  computed: {
  },
  watch: {
    value(val) { // 是否显示小眼睛
      this.$nextTick(() => {
        this.validateLen()
      })
    }
  },
  methods: {
    isShowEye() { // 是否显示小眼睛
      this.$nextTick(() => {
        this.validateLen()
      })
    },
    validateLen() {
      if (this.$refs.nameContainer) {
        if (this.isVhtml) {
          this.showEye = true
          return
        }
        if (this.wordLimitLine == 'c-text-ellipsis1') {
          this.showEye = this.$refs.nameContainer.offsetWidth >= Number(this.width)
        } else {
          this.showEye = this.value && (this.limitLen <= this.value.length)
        }
        return
      }
      this.showEye = false
    },
    formatHtml(value) {
      // 过滤图片
      value = value.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
        match = '<b>[图片]</b>'
        return match
      })
      value = value.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/, function(match, capture) {
        match = ''
        return match
      })
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
  .eyebottom {

    background: #fff;
    border-radius: 8px;
    position: absolute;
    right: 12px;
    bottom: 5px;
  }
</style>
