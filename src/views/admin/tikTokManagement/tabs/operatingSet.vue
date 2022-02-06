<template>
  <div class="bg-fff" v-loading="formLoading">
    <el-tabs v-model="activeName" @tab-click="handleTabClick" class="margin-b15">
      <el-tab-pane label="产品动态" name="prodDynamics"></el-tab-pane>
      <el-tab-pane label="开屏广告" name="openAdvertising"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 'prodDynamics'">
      <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="标题：" prop="name">
          <el-input maxlength="17" v-model="postForm.name" clearable placeholder='请输入标题限17个字' class="width500"></el-input>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <div class="clearfix">
            <img class="fl margin-r" :src="postForm.cover || require('@/assets/defult270.png')" width="240" height="120" alt="">
            <el-upload
              class="fl"
              ref="avatarUpload"
              name="avatar"
              :action="imageUploadUrl"
              list-type="picture"
              :before-upload="handleBeforeUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              :auto-upload="true"
              style="width: 420px">
              <el-button class="el-btn c-bd1-blue" slot="trigger" size="small">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">建议尺寸540*180，只能上传jpg/png文件，且不超过3m</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="链接：" prop="link">
          <el-input v-model="postForm.link" clearable placeholder='请输入链接' class="width500"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="activeName == 'openAdvertising'">
      <el-form key="openr" label-width="250px" label-position="right" class="c-mv30">
        <el-form-item label="是否开启：">
          <el-switch
            v-model="operationalForm.status"
            :inactive-value="0"
            :active-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="标题：" v-show="operationalForm.status">
          <el-input  class="width300" v-model="operationalForm.name" show-word-limit maxlength="10"
          placeholder="请输入标题限10个字"></el-input>
        </el-form-item>
        <el-form-item label="背景图："  v-show="operationalForm.status">
          <div class="relative fl">
            <el-image  :width="180" :height="120" :src="operationalForm.cover"></el-image>

            <i v-if="operationalForm.cover" @click="handleDelImage"
            class="c-fc-sgray absolute c-pa-t0 pointer c-fs-16 el-icon-circle-close"
            style="left: 172px; top: -5px;"></i>
          </div>

          <el-upload
            class="fl margin-l15 c-verticalAlign-t"
            name="avatar"
            :action="imageUploadUrl"
            list-type="picture"
            :before-upload="handleBeforeUpload"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            :auto-upload="true">
            <el-button type="primary" plain>更换照片</el-button>

            <div slot="tip" class="el-upload__tip">建议尺寸720*480，只能上传jpg/png文件，且不超过3m</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容：" v-show="operationalForm.status">

        <tinymce ref="tinymce" :height="436"
          v-model="operationalForm.content"
          @loadingStatus="loadingStatus"
          :isShowTip="false"
          :isshowPreview="false"
          style="width: 722px;"  :key="operationalForm.id + $route.name"></tinymce>
        </el-form-item>
      </el-form>
    </div>

    <!-- 开屏广告预览 -->
    <preview-operating
      v-if="isshowPreview"
      :operationalForm="operationalForm"
      :isshowPreview.sync="isshowPreview"
      >
    </preview-operating>

    <div v-show="activeName == 'openAdvertising'" class="fixed bottom_action_bar c-pa-b0 box-sizing c-flex-row c-aligni-center c-justify-center c-box-shadow10 c-bg-white height60">
      <el-button size="small" v-if="operationalForm.status" type="primary" @click="previewPostForm">预览</el-button>
      <el-button size="small" type="primary"  v-loading="btnLoading" @click="savePostForm">保存</el-button>
    </div>

  </div>
</template>
<script>
import { validateURL } from '@/utils/validate'

import Tinymce from '@/components/Tinymce'
import { getOsDataForAd, saveOperationalSettingsForAd, getOsData, saveOperationalSettings } from '@/api/tiktok'
import PreviewOperating from '../components/previewOperating.vue'
export default {
  name: 'tikTokOperatingSet',
  components: { Tinymce, PreviewOperating },
  data() {
    return {
      activeName: 'prodDynamics',
      isshowPreview: false,
      formLoading: false,
      btnLoading: false,
      postForm: {
        id: '',
        name: '', // 标题
        cover: '', // 图片
        link: '' // 链接
      },
      operationalForm: {
        id: '',
        content: '',
        cover: '',
        status: 0, // 0 关闭 1开启
        name: ''
      },
      rules: {
        name: [{ required: false, message: '请输入标题', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传图片', trigger: 'submitForm' }],
        link: [{ required: true, message: '请输入链接', trigger: 'blur' }]
      },
      imageUploadUrl: process.env.VUE_APP_BASE_API + '/common/tiktokProdDynamics/imageUpload'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.formLoading) { return }
      this.formLoading = true
      getOsData().then(res => {
        this.formLoading = false
        const { data } = res.data
        this.postForm = data || this.postForm
      }).catch(() => {
        this.formLoading = false
      })
    },
    handleDelImage() {
      this.operationalForm.cover = ''
    },
    handleTabClick() {
      if (this.activeName == 'openAdvertising') {
        this.handleGetOsDataForAd()
      }
    },
    handleGetOsDataForAd() {
      getOsDataForAd().then(res => {
        if (res.data.statusCode == 200 && res.data.data) {
          this.operationalForm = res.data.data
        }
      })
    },
    handleSaveOperationalSettingsForAd() {
      this.btnLoading = true
      saveOperationalSettingsForAd(this.operationalForm).then(res => {
        this.btnLoading = false
        if (res.data.statusCode == 200) {
          this.$message.success('保存成功！')
        }
      })
    },
    savePostForm() {
      if (!this.handleOpenValidate()) return
      this.handleSaveOperationalSettingsForAd()
    },
    loadingStatus(msg) {
      // 编辑器图片是否上传完 loading状态
      this.btnLoading = msg
    },
    handleAvatarSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        if (this.activeName == 'openAdvertising') {
          this.operationalForm.cover = response.data.imageUrl
        } else {
          this.postForm.cover = response.data.imageUrl
        }
        this.$message({
          message: '上传成功!',
          type: 'success'
        })
      } else {
        this.$message({
          message: '上传失败，请稍候再试!',
          type: 'info'
        })
      }
    },
    handleOpenValidate() {
      if (this.operationalForm.status && !this.operationalForm.name && !this.operationalForm.cover && !this.operationalForm.content) {
        this.$message.warning('请先填写内容或上传背景图')
        return false
      }

      if (this.operationalForm.status && !this.operationalForm.cover) {
        if (!this.operationalForm.name) {
          this.$message.warning('请先填写标题')
          return false
        }

        if (!this.operationalForm.content) {
          this.$message.warning('请先填写内容或上传背景图')
          return false
        }
      }
      return true
    },
    previewPostForm() {
      if (!this.handleOpenValidate()) return
      this.isshowPreview = true
    },
    handleBeforeUpload(file) {
      const isImg = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isImg) {
        this.$message.warning('上传图片只能是 JPG 或 PNG 格式')
      }
      if (!isLt3M) {
        this.$message.warning('上传图片大小不能超过 3MB')
      }
      return isImg && isLt3M
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (!valid || this.formLoading) {
          return
        }
        if (this.postForm.link.length > 255) {
          return this.$message.warning('链接长度不超过255个字')
        }
        if (!validateURL(this.postForm.link)) { return this.$message.warning('请输入正确的链接') }
        this.formLoading = true
        saveOperationalSettings(this.postForm).then(res => {
          this.formLoading = false
          this.$message.success('保存成功！')
          this.initData()
        }).catch(() => {
          this.formLoading = false
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .bottom_action_bar {
    z-index: 15;
    left: 180px;
    width: calc(100% - 180px);
  }
  .c-box-shadow10 {
    box-shadow: 0px -5px 20px 0px rgba(0,0,0,0.05)
  }
</style>
