<template>
  <div class="slideshow">
    <div class="c-fs-14 c-fc-sgray padding-b10">建议尺寸大小为(宽750*高375)；图片格式支持png、jpg格式，大小不超过3M。最多<b>6</b>张图片</div>
    <div>
      <el-button type="primary" @click="linkToCreate">添加轮播图</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              row-key="id" fit highlight-current-row
              v-loading="listLoading"
              style="width: 100%;margin-top: 20px;color:#222;font-size: 12px;font-family: PingFangSC-Regular;">
      <el-table-column align="center" label="排序">
        <template slot="header" slot-scope="scope">
          <tip-header-label :tipsData="tipsHeader.sort"></tip-header-label>
        </template>
        <template slot-scope="scope">

        <span v-show="!scope.row.isEdit"  class="tdedit"  @click="editSort(scope.$index)">{{scope.row.sort}}</span>

              <input @blur="handleSaveSort(scope.row.id,scope.row.sort)"
                    v-focus="scope.row.isEdit"
                    v-show="scope.row.isEdit"
                    class="editInput" min=0 type="number" name="" id=""
                     v-model.number="scope.row.sort"/>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" width="200" height="100"/>
        </template>
      </el-table-column>

      <el-table-column width="300" align="center" label="名称">
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column width="250" align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.prodName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <b @click="linkToEdit(scope.row.id, scope.$index)">编辑</b>
          <span class="color-409">|</span>
          <b @click="deletePic(scope.$index, scope.row.id)">删除</b>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="轮播图设置" :visible.sync="dialogFormVisible" @close="closeDialog" width="750px">
      <el-form v-loading="formLoading" :model="postForm" :rules="rules" ref="postForm" label-width="180px"
               label-position="right">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="postForm.name" maxlength="50" show-word-limit placeholder="请输入名称" class="width300"></el-input>
        </el-form-item>
        <el-form-item label="链接：" prop="link">
          <el-button type="primary" @click="handleLinkAddress" plain size="small">选择跳转内容</el-button>
          <p class="" v-if="postForm.prodName && postForm.link">
            <span class="line-block c-bg-F8F9FB c-ph10 margin-r10">{{postForm.prodName}}</span>
            <b @click="delLink">删除</b>
          </p>
          <!-- <el-input v-model="postForm.link" placeholder="请输入图片链接http://" class="width300"></el-input> -->
        </el-form-item>
        <el-form-item label="图片(宽750*高375)：" prop="image">
          <div class="clearfix">
            <img class="fl margin-r border" :src="postForm.imgPath||defultImg" @error="setDefultImg" width="240" height="120" alt="">
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
              style="width: 220px">
              <el-button class="el-btn c-bd1-blue" slot="trigger" size="small">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3m</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading="btnLoading"  @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 选择跳转内容 -->
    <slides-link
     v-if="showSlidesLink"
     :slideShow="showSlidesLink"
     @close="handleClose"
     @confirm="handleConfirm"
    ></slides-link>

  </div>
</template>
<script>

import { getCarouselImgList, getCarouselImg, deleteCarouseImg, saveCarouselImg, saveSort } from '@/api/tiktok'
import slidesLink from '../components/slidesLink.vue'
import defultImg from '@/assets/defult270.png'
import tipHeaderLabel from '@/views/templatePage/tipHeaderLabel/index.vue'
// import { validateUrl } from '@/utils/validate'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  name: 'slideShow',
  components: {
    slidesLink,
    tipHeaderLabel
  },
  data() {
    return {
      tableData: [],
      listLoading: false,
      showSlidesLink: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      postForm: {
        sort: 0,
        name: '',
        link: '', // 图片链接
        imgPath: '',
        type: -100
      },
      editId: '',
      defultImg,
      btnLoading: false,
      formLoading: false,
      imageUploadUrl: process.env.VUE_APP_BASE_API + '/common/none/imageUpload',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        imgPath: [{ required: true, message: '请上传图片', trigger: 'submitForm' }]
      },
      tipsHeader: {
        sort: {
          key: '排序',
          value: '数字越大排在越前面'
        }
      }
    }
  },
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 排序编辑
    editSort(index) {
      this.tableData[index].isEdit = true
      this.$set(this.tableData, index, this.tableData[index])
    },
    handleLinkAddress() {
      this.showSlidesLink = true
    },
    handleSaveSort(id, sort) {
      if (sort >= 9999999) {
        sort = 9999999
      }
      if (sort >= 0) {
        var data = { sort: sort, id }
        saveSort(data).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.initData()
        })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message({
          type: 'error',
          message: '排序值不能为负数'
        })
        return
      }
    },
    setDefultImg(e) {
      e.target.src = defultImg
    },
    initData() {
      this.listLoading = true
      getCarouselImgList(this.listQuery).then(res => {
        if (res.data.statusCode == 200) {
          this.listLoading = false
          this.tableData = res.data.data.records
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    linkToCreate() {
      if (this.tableData.length < 6) { // 不能超过6张图
        this.dialogFormVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: '轮播图最多6张图片！'
        })
      }
    },
    linkToEdit(id, index) {
      this.dialogFormVisible = true
      this.editId = id
      this.formLoading = true
      getCarouselImg(id).then(res => {
        this.formLoading = false
        this.postForm = res.data.data
      }).catch(() => {
        this.formLoading = false
      })
    },
    deletePic(index, id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCarouseImg(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initData()
        })
      }).catch(() => {
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        this.$set(this.postForm, 'imgPath', response.data.imageUrl)
        this.$message({
          message: '上传成功!',
          type: 'success'
        })
      } else {
        this.$message({
          message: '上传失败，请稍候再试!',
          type: 'warning'
        })
      }
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
    // 保存
    submitForm() {
      if (!this.postForm.name) {
        this.$message.error('请输入名称')
        return
      }
      if (!this.postForm.imgPath) {
        this.$message.error('请上传图片')
        return
      }
      // if (this.postForm.link && !validateUrl(this.postForm.link)) {
      //   this.$message.error('链接地址不合法')
      //   return
      // }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.btnLoading) {
            return
          }
          this.btnLoading = true
          this.formLoading = true
          const data = Object.assign({}, this.postForm, { id: this.editId || 0 })
          if (this.editId) {
            this.btnLoading = false
            this.formLoading = false
            saveCarouselImg(data).then(res => {
              this.btnLoading = false
              this.formLoading = false
              if (res.data.statusCode == 200) {
                this.$message.success('保存成功')
                this.closeDialog()
                this.initData()
              }
            }).catch(() => {
              this.btnLoading = false
              this.formLoading = false
            })
          } else {
            this.btnLoading = false
            this.formLoading = false
            saveCarouselImg(data).then(res => {
              this.btnLoading = false
              this.formLoading = false
              if (res.data.statusCode == 200) {
                this.$message.success('创建成功')
                this.closeDialog()
                this.initData()
              }
            }).catch(() => {
              this.btnLoading = false
              this.formLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.postForm.name = ''
      this.postForm.link = ''
      this.postForm.imgPath = ''
      this.editId = ''
    },
    handleConfirm(val, type, selectData) {
      this.postForm.link = val
      this.postForm.type = ~~type
      this.postForm.prodName = selectData ? (selectData.name || selectData.text) : ''
    },
    delLink() {
      this.postForm.link = ''
      this.postForm.type = -100
      this.postForm.prodName = ''
    },
    handleClose() {
      this.showSlidesLink = false
    }
  }
}
</script>
<style scoped>

</style>

