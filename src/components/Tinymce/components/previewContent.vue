<template>
  <div>
    <el-button v-if="from == 'tinymce'" size="mini" class="el-btn" @click="preview">预览
    </el-button>
    <!-- 分销试看样式 -->
    <span v-else-if="from == 'distributionCourse'" class="c-bd1-blue c-fc-blue c-fs-12 c-pv2 c-ph2 pointer" @click="preview">{{tipText}}</span>
    <span v-else-if="from == 'distributionCourseAdmin'" class="c-bd1-blue c-fc-blue c-fs-12 c-pv2 c-ph2 pointer" @click.stop="preview">{{tipText}}</span>
    <el-button v-else-if="from=='picture'" type="primary" size="mini" plain @click.stop="preview">{{tipText}}</el-button>
    <b v-else @click="preview">{{tipText}}</b>

    <el-dialog append-to-body
      :visible.sync="dialogVisible"
      :fullscreen="false"
      :show-close="false"
      width="320px"
      top="3%"
      custom-class="dialog-box">
      <div class="phone-container">
        <div class="phone-header"></div>
        <div class="phone-content">
          <h1>默认菜单</h1>
          <div class="content-div" :id="'previewDiv'+previewId" v-loading="loading">
            <div class="c-ph10" :id="previewId" v-html="content"></div>
          </div>
        </div>
        <div class="footer-circle"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCapital } from '@/utils/index'
export default {
  name: 'previewContent',
  props: {
    content: {
      type: String,
      default: '暂无内容，快去添加吧~'
    },
    keyVal: {
      type: [Number, String],
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    tipText: {
      type: String,
      default: '预览'
    }
  },
  watch: {
    content() {
    }
  },
  filters: {
  },
  mounted() {
    // this.cssAdjust()
  },
  data() {
    return {
      dialogVisible: false,
      previewId: this.keyVal || 'preview-' + +new Date(),
      loading: false
    }
  },
  methods: {
    cssAdjust() {
      // var _this = this
      if (this.from == 'tinymce') {
        var imgs = document.getElementById(this.previewId).getElementsByTagName('img')
        if (imgs) {
          for (var i = 0; i < imgs.length; i++) {
            imgs[i].setAttribute('referrerpolicy', 'no-referrer')
            imgs[i].style.maxWidth = '100%'
            imgs[i].style.height = 'auto'
            imgs[i].style.display = 'block'
          }
        }
      } else {
        var imgArr = document.getElementById('previewDiv' + this.previewId).getElementsByTagName('img')
        if (imgArr) {
          for (let j = 0; j < imgArr.length; j++) {
            imgArr[j].style.maxWidth = '100%'
            imgArr[j].style.height = 'auto'
            imgArr[j].style.display = 'block'
          }
        }
      }
    },
    getCapital,
    getOption(data, index) {
      console.log(data, 'data')
      if (data.isHandAudio == 1) {
        return `
        <div>音频：${data.localAudio[index + 1].audioName}
        </div>`
      } else {
        return data['option' + String.fromCharCode(65 + ~~index)]
      }
    },
    preview() {
      // 点击预览
      this.dialogVisible = true
      var _this = this
      setTimeout(function() {
        _this.cssAdjust()
      }, 0)
    }
  }
}
</script>
<style scoped>
.el-btn {
  color: #409eff;
  border: 1px solid #409eff;
}

.phone-container {
  width: 300px;
  /* border: 1px solid #eee; */
  margin: 0 auto;
  /* border-radius: 18px; */
  position: relative;
  /* padding-bottom: 90px; */
  background-color: #fff;
  height: 609px;
  background: url("/images/phoneDefault/iphone.png") no-repeat center center;
  background-size: cover;
}

.phone-header {
  width: 100%;
  height: 60px;
  /* background: url("../../../assets/phoneDefault/iphone_head.jpg") no-repeat center center; */

}

.phone-content {
  margin: 14px 19px 0;
  position: relative;
}

.phone-content h1 {
  background: url("/images/phoneDefault/titlebar.jpg") no-repeat;
  margin: 0;
  /* padding: 18px 60px 0 60px; */
  height: 52px;
  line-height: 68px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  left: -1px;
  right: -1px;
  background-size: cover;
}
.footer-circle{
  /* position: absolute;
    bottom: 20px;
    left: 145px;
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 100%; */
}
.content-div{
  height: 410px;
  overflow: auto;
  /* border: 1px solid #ccc; */
  background: #fff;
  position: relative;
}
.img-max-w100{
  max-width: 100% !important;
}
.defaultItemImg{
  width: 200px !important;
  height: 120px !important;
}
</style>


