<template>
  <!-- 新建分类弹窗 -->
  <super-dialog
      width="720px"
      confirmText='保存'
      :title="titleType"
      :appendToBody="true"
      :closeOnClickModel="false"
      :showButton="true"
      :show="dialogCategory"
      @confirm="handleConfirm"
      @close="closeCat"
      >
    <template slot="content">
      <el-form v-loading="formLoading"
               ref="postForm"
               label-width="120px"
               label-position="right"
              :model="postForm" :rules="rules">


      <el-form-item v-if="cateData.level == 2" label="选择所属分类：" prop="id">
        <el-select :disabled="cateData.isEdit"
          v-model="postForm.id" placeholder="请选择"
          class="width350">
          <el-option v-for="item in parentOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

        <el-form-item label="名称：" prop="name">
          <div class="relative ib c-line1">
            <el-input v-model="postForm.name" placeholder="建议不超过10个字，最多输入20个字"
              class="width350 word-limit-input"></el-input>
            <span class="word-limit-tips">{{postForm.name?postForm.name.length:0}}/{{rules.name[1].max}}</span>
          </div>
        </el-form-item>

        <el-form-item v-if="cateData.level == 1" label="分类图片：" prop="image">
          <div class="clearfix">
            <img class="fl margin-r15" :src="postForm.image || require('@/assets/defult270.png')" @error="setDefultImg" width="180" height="120" alt="">

            <el-upload
              class="fl width360"
              ref="avatarUpload"
              name="avatar"
              :action="imageUploadUrl"
              list-type="picture"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess"
              :show-file-list="false"
              :auto-upload="true"
              >
              <el-button slot="trigger" size="small" class="el-btn  c-bd1-blue">上传图片</el-button>

              <div slot="tip" class="el-upload__tip c-line-20">建议尺寸750*500px，仅支持png、jpg格式，且不超过3M</div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="抖音一级分类：" prop="dyCategoryId">
          <el-select
            @change="handleDyCategoryChange"
            v-model="postForm.dyCategoryId" placeholder="请选择"
            class="width350">
            <el-option v-for="item in dycategoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="cateData.level == 2" label="抖音二级分类：" prop="dyCategoryChildId">

          <el-select
            v-model="postForm.dyCategoryChildId" placeholder="请选择"
            class="width350">
            <el-option v-for="item in dycategorychildList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </super-dialog>
</template>
<script>
import superDialog from '@/views/templatePage/superDialog/index.vue'
import { getDyAllCategoryList, getCategoryData, getAllCategoryList, saveCategory } from '@/api/tiktok'
import defultImg from '@/assets/defult270.png'

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { max: 20, message: '最多不超过20个字', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传图片', trigger: 'submitForm' }
  ],
  dyCategoryId: [{ required: true, message: '请选择抖音一级分类', trigger: ['blur', 'submitForm'] }],
  dyCategoryChildId: [{ required: true, message: '请选择抖音二级分类', trigger: ['blur', 'submitForm'] }]
}

const postForm = {
  name: null, // 分类名称
  image: '', // 图片链接
  sort: 0, // 排序值
  level: 1, // 分类级别 1：1级 2：2级
  id: '', // 分类ID，新建时请传0
  pid: '', // 父级ID，如果创建的是1级目录，该值 请传0
  dyCategoryId: '', // 抖音目录id
  dyCategoryChildId: '' // 抖音二级目录id
}

export default {
  components: {
    superDialog
  },
  props: {
    dialogCategory: {
      type: Boolean,
      default: false
    },
    titleType: String,
    cateData: {
      type: Object,
      default: {
        level: 1
      }
    }
  },
  data() {
    return {
      imageUploadUrl: process.env.VUE_APP_BASE_API + '/common/none/imageUpload',
      formLoading: false,

      parentOptions: [], // 名称下拉
      dycategoryList: [], // 抖音分类下拉
      dycategorychildList: [], // 抖音二级分类下拉
      rules,
      postForm: Object.assign({}, postForm)
    }
  },
  created() {
    Promise.all([
      // 获取选择分类目录
      this.handlegetAllCategoryList(),
      this.handleGetDyAllCategoryList(0)
    ]).then(() => {
      let catId
      // 新增二级分类 或 编辑一级分类
      if (this.cateData.isAdd || this.cateData.level == 1) {
        catId = this.cateData.catId
        this.postForm.id = catId
      } else { // 编辑二级分类
        catId = this.cateData.catId.id
        this.postForm.id = this.cateData.catId.pid
      }

      if (this.cateData.isEdit) {
        this.initData(catId)
      }
    })
  },
  methods: {

    initData(catId) {
      getCategoryData(catId).then(res => {
        const resData = res.data.data
        this.postForm.level = resData.level
        this.postForm.dyCategoryId = resData.dyCategoryId
        this.$set(this.postForm, 'image', resData.image)

        if (!this.cateData.isAdd) { // 编辑进来
          this.postForm.name = resData.name
        }
        // 要根据抖音一级目录id获取二级目录
        this.postForm.dyCategoryId && this.handleGetDyAllCategoryList(this.postForm.dyCategoryId).then(() => {
          this.$set(this.postForm, 'dyCategoryChildId', resData.dyCategoryChildId)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleDyCategoryChange() {
      this.handleGetDyAllCategoryList(this.postForm.dyCategoryId)
    },
    handlegetAllCategoryList() {
      getAllCategoryList(0).then(res => {
        this.parentOptions = res.data.data
      })
    },

    async handleGetDyAllCategoryList(id) {
      await getDyAllCategoryList(id).then(res => {
        const resData = res.data.data
        // 如果 postForm.dyCategoryId 值不为空， 说明返回二级分类目录，否则是返回一级分类目录
        if (this.postForm.dyCategoryId) {
          this.dycategorychildList = resData
        } else {
          this.dycategoryList = resData
        }
      })
    },
    handleBeforeUpload(file) {
      const isImg = file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isImg) {
        this.$message.warning('上传图片只能是 JPG 或 PNG 格式')
      }
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      return isImg && isLt3M
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        this.postForm.image = response.data.imageUrl
        this.$message.info('上传成功!')
      } else {
        this.$message.info('上传失败，请稍候再试!')
      }
    },
    handleConfirm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.formLoading = true

          this.handleSaveCategory()
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    handleSaveCategory() {
      if (this.cateData.level == 1 && this.cateData.isAdd) {
      // 新增一级分类
        this.postForm.pid = 0
        this.postForm.id = 0
      } else if (this.cateData.level == 1 && this.cateData.isEdit) {
        // 编辑一级分类
        this.postForm.id = this.cateData.catId
        this.postForm.pid = 0
      }
      if (this.cateData.level == 2 && this.cateData.isAdd) {
        // 新增二级分类
        this.postForm.pid = this.cateData.catId
        this.postForm.id = 0
        this.postForm.dyCategoryId = this.postForm.dyCategoryChildId
      } else if (this.cateData.level == 2 && this.cateData.isEdit) {
        // 编辑二级分类
        this.postForm.id = this.cateData.catId.id
        this.postForm.pid = this.cateData.catId.pid
        this.postForm.dyCategoryId = this.postForm.dyCategoryChildId
      }
      this.postForm.level = this.cateData.level

      saveCategory(this.postForm).then(_ => {
        this.closeCat()
        this.formLoading = false
      })
        .catch(_ => this.closeCat())
    },
    closeCat() {
      // this.dialogCategory = false
      this.$emit('closeCat', false)
    },
    setDefultImg(e) {
      e.target.src = defultImg
    }
  }
}
</script>

<style lang="scss" scoped>
  .padding-r28 {padding-right: 28px}
</style>
