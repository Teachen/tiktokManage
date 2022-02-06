<!--大图预览-->
<template>
  <div v-if="showPreview" class="fixed c-pa-t0 c-pa-l0 zIndex3000 c-width100 c-height100">
    <div class="absolute c-pa-t0 c-pa-r0 zIndex1 c-fs-32 c-fc-white margin-t15 pointer" @click="showPreview = false" style="right: 20px"><i class="el-icon-circle-close"></i></div>
    <el-carousel trigger="click" :autoplay="false" :initial-index="active" class="c-height100 c-width100 padding-30 fixed-cover">
      <el-carousel-item v-for="(item,index) in pictures" :key="index" class="scroll-bar c-height100 c-width100">
        <img  v-if="(typeof item) === 'string'" :src="item || defultImg" alt="" class="border-radio4 c-max-width1000">
        <img v-else-if="(typeof item) === 'object'" :src="item.url || defultImg" alt="" class="border-radio4 c-max-width1000">
      </el-carousel-item>
    </el-carousel>
    <div class="cover-bg" @click="showPreview = false"></div>
  </div>
    <!--<div v-if="showPreview" class="filter c-flex-row c-justify-center c-aligni-center" style="z-index: 10000">-->
      <!--<img class="c-pa c-translate-center c-textAlign-c" :src="url" alt="" style="max-height: 90%"/>-->
      <!--<div class="btns fixed c-pa-t12 c-pa-r30">-->
        <!--<i class="el-icon-circle-close c-fs-24 c-fc-white pointer" @click="showPreview=false; url = ''" style="z-index:9"></i>-->
      <!--</div>-->
    <!--</div>-->
</template>

<script>
  import defultImg from '@/assets/defult270.png'
  export default {
    name: 'imgArray',
    data() {
      return {
        defultImg,
        pictures: [],
        showPreview: false,
        url: '',
        active: 0
      }
    },
    mounted() {
      // this.url = this.list[0]
    },
    methods: {
      /**
       *  预览图片
       * @param param 为一个对象，包含如下属性：
       * array -- 图片列表
       * current -- 当前预览的图片序号，默认为0
       */
      show(param) {
        this.pictures = param.array
        if (!param.current) {
          param.current = 0
        }
        this.active = param.current
        this.showPreview = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .zIndex3000 {
    z-index: 3000;
  }
  .cover-bg {
    position: absolute;
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    z-index: -1;
  }
  /deep/ .fixed-cover .el-carousel__container {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
  }
  /deep/ .el-carousel__item {
    height: 100%;
    overflow: auto;
    display: grid;
    justify-content: center;
    align-items: center;
  }
</style>
