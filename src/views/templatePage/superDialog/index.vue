<template>
  <el-dialog class="super-dialog" :class="title ? 'c-bm1-mwhite-dialog' : ''"
      :visible.sync="show"
      :width="width"
      :top="top"
      :show-close="showClose"
      :close-on-click-modal="closeOnClickModel"
      :custom-class="customClass"
      :modal-append-to-body="modalAppendToBody"
      :append-to-body="appendToBody"
      :before-close="handleClose">
    <div slot="title" v-if="title">
      <slot name="title">
        <span class="c-fs-16 c-fc-333">{{title}}</span>
      </slot>
    </div>
    <div>
      <slot name="content"></slot>
    </div>
    <div slot="footer" v-if="showButton">
      <slot name="footerBtn">
        <el-button v-if="showCloseButton" @click="handleClose">{{cancelText}}</el-button><el-button v-if="showConfirmButton" @click="handleConfirm" :disabled="btnLoading" v-loading.fullscreen="btnLoading" type="primary">{{confirmText}}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>
<script>
export default {
  inheritAttrs: true,
  name: 'superDialog',
  props: {
    show: { // 是否显示
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: { // 宽度
      type: String,
      default: '50%'
    },
    closeOnClickModel: { // 是否点击遮罩层关闭
      type: Boolean,
      default: true
    },
    top: { // 距离顶部距离
      type: String,
      default: '15vh'
    },
    showClose: { // 显示关闭按钮
      type: Boolean,
      default: true
    },
    customClass: { // 自定义样式类名
      type: String,
      default: ''
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    confirmText: { // 确定按钮文字
      type: String,
      default: '确定'
    },
    cancelText: { // 取消按钮文字
      type: String,
      default: '关闭'
    },
    showButton: { // 是否显示按钮
      type: Boolean,
      default: true
    },
    showConfirmButton: { // 显示确定按钮
      type: Boolean,
      default: true
    },
    showCloseButton: { // 显示取消按钮
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    btnLoading: {
      get() {
        return this.loading
      },
      set(newVal) {
        return newVal
      }
    }
  },
  watch: {
    loading() {
      this.btnLoading = this.loading
    }
  },
  created() {

  },
  methods: {
    handleClose(done) {
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
  .super-dialog /deep/ .el-dialog__header{
    padding: 15px 15px;
  }
  .super-dialog /deep/ .el-dialog{
    margin-bottom: 50px;
  }
  .super-dialog /deep/ .el-dialog__footer {
    padding: 0 20px 20px;
  }
  .super-dialog /deep/ .el-dialog__headerbtn {
    top: 15px;
  }

.super-dialog /deep/ .position-center {
  // position: absolute;
  // top: 50%;
  // left: 50%;
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  // transform: translate(-50%, -50%);

  .el-dialog__body {
    flex: 1;
    overflow-y: hidden;
  }
}
</style>
