<template>
  <img @error="setDefultImg" v-if="src!='hide' && isImg" :key="keyVal" :src="src||setDefultImg" :width="width" :height="height" alt=""/>
  <div v-else-if="src!='hide' && !isImg">
    <div v-if="src == '' || src == null" :style="{width: width+'px', height: height+'px'}" class="border-radio2 c-bg-sblue c-flex-row c-aligni-center c-justify-center">
      <img src="@/assets/img.png" :width="width/5" alt="">
    </div>
    <img v-else :src="src" class="border-radio2" :width="width" :height="height" alt="">
  </div>
</template>
<script>
import defultImgVal from '@/assets/defult270.png'
import headImg from '@/assets/default_head.png'
export default {
  name: 'initImg',
  props: {
    keyVal: String,
    defultImg: {
      default: defultImgVal
    },
    defaultType: { // 和默认图defultImg不能同时传
      type: String,
      default: '' // headImg 头像
    },
    src: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 180
    },
    height: {
      type: [Number, String],
      default: 120
    },
    isImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headImg,
      defultImgVal
    }
  },
  created() {
    // 以类型为主
    if (this.defaultType) {
      this.setDefultImg = this[this.defaultType]
    } else {
      this.setDefultImg = this.defultImg
    }
    console.log(this.defultImg, 999)
  },
  methods: {
    setDefultImg(e) {
      e.target.src = this.defultImg
    }
  }
}
</script>
