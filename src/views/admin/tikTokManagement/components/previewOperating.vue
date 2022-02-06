<template>
  <div :class="operationalForm.cover ? 'operat':''">
    <el-dialog
      :title="operationalForm.name"
      custom-class="relative width720 "
      :before-close="handleClose"
      :visible.sync="isshowPreview"
      :show-close="false"
      center>

      <div class="c-scroll height305 overflow-y-auto" v-html="operationalForm.content"></div>

      <img v-if="operationalForm.cover" class="hasBg c-width100 absolute c-pa-t0 c-pa-r0 zIndex-1" :src="operationalForm.cover" alt=""/>

      <span slot="footer" class="dialog-footer">
        <div class="previewBtn pointer" v-if="operationalForm.cover"  @click="handleClose"></div>
        <el-button type="primary" v-else @click="handleClose">我知道了</el-button>

      </span>
    </el-dialog>


  </div>
</template>
<script>
export default {
  props: {
    isshowPreview: Boolean,
    operationalForm: {
      type: Object,
      default: {

      }
    }
  },
  mounted() {
    console.log(this.operationalForm)
  },
  methods: {
    handleClose() {
      this.$emit('update:isshowPreview', false)
    }
  }

}
</script>
<style lang="scss">
  .operat .el-dialog {

      width: 720px;
      box-shadow: none;
      background: transparent;
  }


</style>
<style lang="scss" scoped>
  .height305 {
    height: 305px;
  }
  .previewBtn{
    width: 98px;
    height: 36px;
    margin: 0 auto;
  }
  .hasBg {
    width: 720px;
    height: 480px;

    .title {
      color: #333;
      font-weight: 600;
      font-size: 22px;
    }
  }
</style>
