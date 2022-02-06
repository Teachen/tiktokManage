<template>
  <div class="upload-container">
    <!-- <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button> -->
    <div :style="{color:color}" @click=" dialogVisible=true">上传图片</div>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <p class="c-fc-red margin-b10">
        提示：上传图片大小不能超过5M
      </p>
      <el-upload name="file" class="editor-slide-upload margin-b10"
        :action="url"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :data="uploadData"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <div class="padding-t40">
          <i class="el-icon-plus c-db"></i>
          <div class="c-textAlign-c height36">上传图片</div>
        </div>
      </el-upload>

      <div class="c-flex-row c-justify-end">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { encodeCompanyId } from '@/utils/permission'
export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      imageUploadUrl: process.env.VUE_APP_BASE_API + '/common/editor/imageUpload',
      uploadData: {},
      url: '',
      FideDir: '',
      keysData: []
    }
  },
  created() {
    this.getImageSign({ type: 2 }).then(res => {
      const curData = res.data
      this.url = curData.host
      this.uploadData = {
        'key': '',
        'policy': curData.policy,
        'OSSAccessKeyId': curData.accessid,
        'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
        'callback': curData.callback,
        'signature': curData.signature
      }
      this.FideDir = curData.dir
    })
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      console.log(arr)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      // const objKeyArr = Object.keys(this.listObj)
      const { url, width, height } = response.data
      var fileObj = this.listObj[uid || file.raw.uploadKey]
      fileObj.url = url
      fileObj.hasSuccess = true
      !fileObj.width && (fileObj.width = width)
      !fileObj.height && (fileObj.height = height)

      console.log(this.listObj, 'listObj')
      this.$forceUpdate()
      // for (var i = 0; i < objKeyArr.length; i++) {
      //   console.error(objKeyArr[i], this.listObj[objKeyArr[i]], file.uid, '2222222')
      //   if ((this.listObj[objKeyArr[i]].uid === uid) || (this.listObj[objKeyArr[i]].uploadKey == file.raw.uploadKey)) {
      //     this.listObj[objKeyArr[i]].url = response.data.url
      //     this.listObj[objKeyArr[i]].hasSuccess = true
      //   }
      // }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (var i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const isImg = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif'
      if (!isImg) {
        this.$message.warning('上传图片只能是 JPG 、 PNG 或 GIF 格式！')
        return false
      }
      const isLt5M = (file.size / 1024 / 1024) < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      // if (isImg || isLt5M) {
      //   return isImg && isLt5M
      // } else {
      const index = file.name.lastIndexOf('.')
      // const preFilename = file.name.slice(0, index) // 图片名字
      const filetype = file.name.slice(index) // 图片类型
      this.uploadData.key = this.FideDir + 'root_admin-fe_' + encodeCompanyId() + '_tinymceUpload_' + this.randomString(20) + filetype
      this.uploadData.name = file.name
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName || this.uploadData.key] = {}
      return (function() {
        new Promise((resolve, reject) => {
          try {
            const nameKey = _self.randomString(15)
            file.uploadKey = nameKey
            _self.listObj[fileName || nameKey] = { hasSuccess: false, uid: file.uid, width: '', height: '', uploadKey: nameKey }
            const img = new Image()
            img.src = _URL.createObjectURL(file)
            img.onload = function() {
              _self.listObj[fileName || nameKey].width = this.width
              _self.listObj[fileName || nameKey].height = this.height
            }
            resolve(true)
          } catch (error) {
            console.error(error)
            reject(error)
          }
        })
      })(_self)
      // }
    },
    randomString(len) {
      // 随机字符串
      len = len || 32
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const maxPos = chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.upload-container {
  .editor-slide-upload {
    margin-bottom: 20px;
  }
}
  .editor-slide-upload .el-upload--picture-card { line-height: 37px!important;}

</style>
