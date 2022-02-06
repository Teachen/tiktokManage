<template>
  <super-dialog class="no-padding" :show="showDialog"
    :title="~~deployType == 1 ? '添加客户' : ~~deployType == 2 ? '编辑客户' : '详情'" width="650px" :appendToBody="true"
    :closeOnClickModel="false" :loading="formLoading"
    top="9vh"
    :showButton="~~deployType != 3"
    @confirm="submitForm" @close="coloseDialog">
    <div slot="content" class=" overflow-y-auto overflow-x mxHeight812 c-scroll">
      <el-form class="c-mv20 elform"
        :model="postForm" :rules="rules" ref="postForm" label-width="117px">

        <div class="form-title c-fs-16" style="margin: 0 0 16px;"><i class="square"></i>基础信息 </div>
        <el-form-item label="平台名称"  prop="companyName">
          <el-input  placeholder="请输入老师的名称" :disabled="[3].includes(~~deployType)" v-model="postForm.companyName" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="联系人"  prop="contacts">
          <el-input  placeholder="请输入联系人" :disabled="[3].includes(~~deployType)" v-model="postForm.contacts" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="手机号"  prop="username">
          <span slot="label">
            <el-popover
              placement="top-start"
              width="320"
              trigger="hover">
              <div class="c-fc-333">提示：建议不轻易更改手机号，更改后达人老师需要重新绑定抖音号，提现金额只能在前手机号提现</div>
              <span slot="reference">
                手机号
                <i class="el-icon-info c-fc-ccc"></i>
              </span>
            </el-popover>
          </span>
          <el-input  placeholder="请输入手机号" :disabled="[3].includes(~~deployType)" v-model="postForm.username" class="width300"></el-input>
        </el-form-item>

        <!-- 去部署时校验登录密码 -->
        <el-form-item label="登入密码"  prop="password" v-if="~~deployType == 1">
          <span slot="label">
            <el-popover
              placement="top-start"
              width="320"
              trigger="hover">
              <div class="c-fc-333">提示：6-20位，必须是数字、字母和特殊字符(# @ ! ~ % ^ & *)组合</div>
              <span slot="reference">
                登录密码
                <i class="el-icon-info c-fc-ccc"></i>
              </span>
            </el-popover>
          </span>
          <el-input  placeholder="请修改登录密码" v-model="postForm.password" class="width300"></el-input>
        </el-form-item>

        <!-- 编辑出现密码不校验 -->
        <el-form-item label="登入密码"  prop="editpassword" v-else>
          <span slot="label">
            <el-popover
              placement="top-start"
              width="320"
              trigger="hover">
              <div class="c-fc-333">提示：6-20位，必须是数字、字母和特殊字符(# @ ! ~ % ^ & *)组合</div>
              <span slot="reference">
                登录密码
                <i class="el-icon-info c-fc-ccc"></i>
              </span>
            </el-popover>
          </span>
          <el-input  placeholder="请修改登录密码" :disabled="[3].includes(~~deployType)" v-model="postForm.editpassword" class="width300"></el-input>
        </el-form-item>

        <div class="form-title c-fs-16 padding-t10" style="margin: 0 0 16px;"><i class="square"></i>附加信息</div>

        <el-form-item label="达人名称" prop="talentName">
          <el-input  placeholder="请输入当前账号的达人名称" :disabled="[3].includes(~~deployType)" v-model="postForm.talentName" class="width300"></el-input>
        </el-form-item>

        <!-- <el-form-item label="抖音号">
          <el-input  placeholder="请输入当前账号的抖音号" v-model="postForm.dyaccount"></el-input>
        </el-form-item> -->

        <el-form-item label="粉丝数" required>
          <el-input  placeholder="请输入当前账号的粉丝数" :disabled="[3].includes(~~deployType)" v-model.number="postForm.totalFans"
          @keyup.native="postForm.totalFans=isNum(postForm.totalFans)" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="创作主体">

          <el-select v-model="postForm.subjectType" :disabled="[3].includes(~~deployType)" class="width300">
            <el-option v-for="(item, index) in subjectTypeList" :key="index" :label="item.text" :value="item.value"></el-option>
            <el-option label="知识付费" value="5"></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="作品类别" class="c-mt-f5" required>
          <p class="c-fs-12 color-999">多选，最多5个</p>
          <ul class="sortCaret c-flex-row c-flexw-wrap c-justify-start">

            <li v-for="(item, index) in talentTypeList"
                :key="index"
                @click="handleClickType(item.isActive, index)"
                :class="selectTalentType && selectTalentType.indexOf(item.value) >= 0 ? 'active': ''"
                :style="{cursor: [3].includes(~~deployType) ? 'not-allowed' : 'cursor'}"
            >{{item.text}}
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="背景介绍" class="c-mt-f5" prop="talentDesc">

          <el-input type="textarea"
            v-model="postForm.talentDesc" :autosize="{ minRows: 2, maxRows: 10}"
            maxlength="500"
            show-word-limit
            :disabled="[3].includes(~~deployType)"
            placeholder="输入背景介绍，让我们更了解您"
            class="width300"></el-input>
        </el-form-item>
        <template v-if="[1, 2].includes(~~deployType)">
          <div class="form-title c-fs-16 padding-t10" style="margin: 0 0 16px;"><i class="square"></i>部署信息</div>
          <el-form-item label="部署版本">
            <el-radio-group v-model="postForm.companyVersion" @change="handleCompanyVersionChange" :disabled="[2].includes(~~deployType)">
              <el-radio :label="100">标准版</el-radio>
              <el-radio :label="200">独立版</el-radio>
            </el-radio-group>
          </el-form-item>

          <div class="form-title c-fs-16 padding-t10" style="margin: 0 0 16px;"><i class="square"></i>平台抽佣</div>
          <el-form :inline="true" class="inline-form">
            <el-form-item label="创匠平台抽佣" label-width="117px" inline style="width: 233px;">
              <div class="c-fc-333">
                <el-input v-model="postForm.shareRatio1" class="width80"
                :disabled="[2, 3].includes(~~deployType)"
                @keyup.native="postForm.shareRatio1=isNum(postForm.shareRatio1)"></el-input> &nbsp;%
              </div>
            </el-form-item>

            <el-form-item v-if="postForm.companyVersion != 200" label-width="22px" inline class="width300">
              <div class="c-fc-333">流水达到5万以上抽佣 &nbsp;
                <el-input v-model="postForm.shareRatio2" class="width80"
                :disabled="[2, 3].includes(~~deployType)"
                @keyup.native="postForm.shareRatio2=isNum(postForm.shareRatio2)"></el-input> &nbsp; %
              </div>
            </el-form-item>
          </el-form>
        </template>
        <!-- 个人资质说明 -->
        <template v-if="postForm.companyVersion == 200 && [1, 2].includes(~~deployType)">
          <div class="form-title c-fs-16" style="margin: 0 0 24px;"><i class="square"></i>个人资质</div>

          <el-form-item label="上传资质"  class="c-mt-f5" required>
            <p class="color-999 c-fs-12" :class="qualificationsList.length > 0  ? 'c-mt-f5' : ''">限9张，5M以内</p>
            <div class=" elUpload padding-t5">

              <el-upload
                list-type="picture-card"
                name="avatar"
                :multiple="multiple"
                :limit="9"
                :file-list="qualificationsList"
                :before-upload="handleBeforeUpload"
                :action="imageUploadUrl"
                :on-exceed="(files, fileList) => {handleExceed(files, fileList, 9)}"
                :on-remove="(file, fileList) => {handleRemove(file, fileList, {type: 'qualifications'})}"
                :on-success="function(response, file, fileList) {return handleVoucherSuccess(response, file, fileList, {type: 'qualifications'})}">

                <i class="el-icon-plus"></i>
              </el-upload>
            </div>

          </el-form-item>
        </template>

        <!-- 融合版没有费用说明模块 -->
        <template v-if="~~deployType == 1 || (~~deployType == 2 && appType == 2)">
          <div class="form-title c-fs-16 padding-t10" style="margin: 0 0 16px;"><i class="square"></i>费用说明</div>

          <el-form-item label="总费用(元)" prop="productCost">
            <span slot="label">
              <el-popover
                placement="top-start"
                width="320"
                trigger="hover">
                <div class="c-fc-333">注：暂不支持预付款，需要一次付清</div>
                <span slot="reference">
                  总费用(元)
                  <i class="el-icon-info c-fc-ccc"></i>
                </span>
              </el-popover>
            </span>
            <el-input v-model="postForm.productCost" placeholder="请输入该版本费用"
            @keyup.native="postForm.productCost=isNum(postForm.productCost)" class="width300"></el-input>
          </el-form-item>

          <el-form-item label="上传凭证"  class="c-mt-f5">
            <p class="color-999 c-fs-12" :class="voucherFileList.length > 0  ? 'c-mt-f5' : ''">限10张，5M以内</p>
            <div class=" elUpload padding-t5">

              <el-upload
                list-type="picture-card"
                name="avatar"
                :multiple="multiple"
                :limit="10"
                :file-list="voucherFileList"
                :before-upload="handleBeforeUpload"
                :action="imageUploadUrl"
                :on-exceed="(files, fileList) => {handleExceed(files, fileList, 10)}"
                :on-remove="(file, fileList) => {handleRemove(file, fileList, {type: 'voucher'})}"
                :on-success="function(response, file, fileList) {return handleVoucherSuccess(response, file, fileList, {type: 'voucher'})}">

                <i class="el-icon-plus"></i>
              </el-upload>
            </div>

          </el-form-item>

        </template>
      </el-form>
    </div>
  </super-dialog>
</template>
<script>
import superDialog from '@/views/templatePage/superDialog/index.vue'
import defultImg from '@/assets/defult270.png'
import { getDictItems, setTodePloy, getViewTalent, getSubjectType, editTodePloy } from '@/api/tiktok'
import { isPhoneNumber, validatePrice } from '@/utils/validate.js'
import { getCopyData } from '@/utils'

export default {
  name: 'deployCompany',
  components: { superDialog },
  props: {
    appType: [Number, String],
    showDialog: {
      type: Boolean,
      default: false
    },
    deployId: { // 要部署的id (意向达人id)
      type: String,
      default: ''
    },
    deployType: { // 来源类型 (1: 添加客户 2：编辑客户 3：详情)
      type: Number,
      default: 0
    }
  },
  data() {
    const validateCode = (rule, value, callback) => {
      const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{6,20}$/
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        if (value && !reg.test(value)) {
          callback(new Error('6-20位，必须是数字、字母和特殊字符(# @ ! ~ % ^ & *)组合'))
        } else {
          callback()
        }
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        if (value && !isPhoneNumber(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      }
    }

    return {
      multiple: true,
      formLoading: false,
      defultImg,
      postForm: {
        id: '', // 记录id
        companyName: '', // 平台名称
        contacts: '', // 联系人
        username: '', // 手机号
        password: '', // 登入密码
        editpassword: '', // 编辑时 登录密码
        talentName: '', // 达人名称
        dyaccount: '', // 抖音帐号
        totalFans: null, // 粉丝总数
        subjectType: '', // 主体类型
        talentType: '', // 作品类型,多个逗号隔开
        talentDesc: '', // 达人背景介绍
        productCost: 0, // 购买产品总费用
        voucherImg: [], // 购买凭证
        shareRatio1: 6, // 创匠平台抽佣比例
        shareRatio2: 4, // 第流水达到5万以上抽佣比例
        companyVersion: 100, // 部署版本
        qualifications: [] // 个人资质
      },
      talentTypeList: [],
      selectTalentType: [], // 选择的达人类型
      subjectTypeList: [],
      voucherFileList: [], // 显示的已上传图片列表
      qualificationsList: [], // 显示已个人资质列表
      imageUploadUrl: process.env.VUE_APP_BASE_API + '/common/none/imageUpload',
      rules: {
        companyName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        talentName: [{ required: true, message: '达人名称不能为空', trigger: 'blur' }],
        username: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        password: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        productCost: [{ required: true, message: '费用不能为空', trigger: 'blur' }],
        talentDesc: [{ required: true, message: '背景介绍不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initData()
    this.handleGetSubjectType()
  },
  methods: {
    handleClickType(isActive, index) {
      // 详情只能查看
      if ([3].includes(~~this.deployType)) return
      if (isActive) { // 取消选中
        const indexVal = this.selectTalentType.indexOf(this.talentTypeList[index].value)
        indexVal >= 0 && this.selectTalentType.splice(indexVal, 1)
      }
      if (this.selectTalentType.length >= 5) { return this.$message.warning('作品类别最多选择5个！') }
      !isActive && this.selectTalentType.push(this.talentTypeList[index].value)
      this.$set(this.talentTypeList[index], 'isActive', !isActive)

      setTimeout(() => {
        if (this.talentTypeList.filter(item => item.isActive).length > 5) {
          return this.$message.warning('作品类别最多选择5个！')
        }
      }, 0)
    },
    handleExceed(files, fileList, length) {
      console.log(length, fileList, '/', files)
      this.$message.warning(`当前限制选择 ${length} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    initData() {
      this.formLoading = true

      Promise.all([
        getDictItems().then(res => {
          if (res.data.statusCode == 200) {
            this.talentTypeList = res.data.data.map(item =>
              Object.assign(item, { isActive: false })
            )
          }
        }),
        getViewTalent({
          id: this.deployId,
          type: this.deployType
        }).then(res => {
          const resData = res.data.data
          if (res.data.statusCode == 200 && resData) {
            this.postForm = resData
            if (this.postForm.talentType !== null) {
              this.selectTalentType = getCopyData(this.postForm.talentType)
              this.postForm.talentType.forEach(item => {
                this.talentTypeList.map(el => {
                  if (el.value == item) {
                    el.isActive = true
                  }
                })
              })
            }
            this.postForm.voucherImg !== null && (this.voucherFileList = this.postForm.voucherImg.slice(0))
            this.postForm.qualifications !== null && (this.qualificationsList = this.postForm.qualifications.map(item => {
              return { url: item }
            }))
          }
        })
      ]).then(() => {
        this.formLoading = false
      }).catch((err) => {
        console.log(err)
        this.formLoading = false
      })
    },
    isNum(val) {
      return validatePrice(val)
    },
    coloseDialog() {
      this.$emit('update:showDialog', false)
    },
    handleRemove(file, fileList, { type }) {
      if (type == 'qualifications') {
        this.qualificationsList = fileList
      }
      if (type == 'voucher') {
        this.voucherFileList = fileList
      }
    },

    handleCompanyVersionChange() {
      this.postForm.shareRatio1 = this.postForm.companyVersion == 100 ? 6 : 4
    },
    handleGetSubjectType() {
      getSubjectType().then(res => {
        if (res.data.statusCode == 200) {
          this.subjectTypeList = res.data.data
        }
      })
    },
    handleBeforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 > 5
      if (isLt5M) {
        this.$message.warning('上传图片大小不能超过 5MB!')
        return false
      }

      const accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
      console.log(file, 'file')
      if (!accept.includes(file.type)) {
        this.$message.error('图片上传格式错误,仅支持jpg、png、jpeg、bmp')
        return false
      }
      console.log(file, 'ac')
    },
    handleVoucherSuccess(response, file, fileList, { type }) {
      if (response.statusCode == 200) {
        if (type == 'qualifications') {
          this.qualificationsList = fileList
        }
        if (type == 'voucher') {
          this.voucherFileList = fileList
        }
        console.log(fileList, 'imageUrl', response.data.imageUrl, type)
        this.$message.info('上传成功！')
      } else {
        this.$message.error('上传失败，请稍后再试！')
      }
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          // 编辑时登录密码手动校验
          const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{6,20}$/

          if (this.postForm.editpassword && !reg.test(this.postForm.editpassword)) {
            return this.$message.warning('6-20位，必须是数字、字母和特殊字符(# @ ! ~ % ^ & *)组合')
          } else if (this.postForm.editpassword && reg.test(this.postForm.editpassword)) {
            this.postForm.password = this.postForm.editpassword
          }

          if (this.postForm.companyVersion == 100 && Number(this.postForm.shareRatio1) < Number(this.postForm.shareRatio2)) {
            return this.$message.warning('流水达到5万以上抽佣比例不能比平台抽佣比例大')
          }

          if (this.postForm.companyVersion == 200 && Number(this.postForm.shareRatio1) < Number(this.postForm.shareRatio2)) {
            return this.$message.warning('平台抽佣只能4%-6%范围')
          }

          if ([1, 2].includes(this.deployType) && this.postForm.totalFans <= 0) {
            return this.$message.warning('请输入当前账号的粉丝数')
          }

          if (this.talentTypeList.filter(item => item.isActive).length == 0 || this.talentTypeList.filter(item => item.isActive).length > 5) {
            return this.$message.warning('作品类别至少选择一个，最多选择5个！')
          }

          if (this.talentTypeList.length > 0) {
            const talentType = []

            this.talentTypeList.filter(item => item.isActive).forEach(el => {
              talentType.push(~~el.value)
            })
            this.postForm.talentType = talentType
          }
          // 处理上传凭证
          if (this.voucherFileList.length > 0) {
            this.postForm.voucherImg = []

            this.voucherFileList.forEach(el => {
              if (el.hasOwnProperty('name')) {
                this.postForm.voucherImg.push({ url: el.response.data.imageUrl })
              } else {
                this.postForm.voucherImg.push({ url: el.url })
              }
            })
          }

          // 处理个人资质
          if (this.qualificationsList.length > 0) {
            this.postForm.qualifications = []
            this.qualificationsList.forEach(el => {
              if (el.hasOwnProperty('name')) {
                this.postForm.qualifications.push(el.response.data.imageUrl)
              } else {
                this.postForm.qualifications.push(el.url)
              }
            })
          }

          if (this.postForm.companyVersion == 200 && this.qualificationsList.length == 0) {
            return this.$message.warning('个人资质至少上传一张')
          }

          // 去部署
          if (this.deployType == 1) {
            setTodePloy(this.postForm).then(res => {
              if (res.data.statusCode == 200) {
                this.$message.success('操作成功！')

                this.coloseDialog()
                this.$emit('coloseDialog')
              }
            }).catch(err => {
              if (err.data.statusCode == 1001) {
                console.log(err.data.data)
              }
            })
          } else {
            // 入驻达人编辑
            editTodePloy(this.postForm).then(res => {
              if (res.data.statusCode == 200) {
                this.$message.success('操作成功！')

                this.coloseDialog()
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">

  .mxHeight812 {
    max-height: 512px;
  }

  .elUpload {
    width: 352px;
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 106px;
      i { font-size: 22px; }
    }

    .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
  }

</style>
<style lang="scss" scoped>

  // .elform {
  //   width: 437px;
  // }
  .elform /deep/ .el-form-item{
    margin-bottom: 15px;
  }
  .elform /deep/ .elUpload .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  .elform /deep/ .elUpload .el-upload-list__item {
    width: 80px;
    height: 80px;
  }

  .sortCaret {
    width: 460px;
    li {
      width: 76px;
      height: 32px;
      border-radius: 20px;
      color: #333;
      background: #F6F7F8;
      text-align: center;
      line-height: 32px;
      margin: 0 16px 16px 0;
    }

    li.active {

      color: #2979ff;
      background: #e1ecff;
    }
  }
</style>
