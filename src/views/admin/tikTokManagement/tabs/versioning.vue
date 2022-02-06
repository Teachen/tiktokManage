<template>
<div>
  <div class="c-ph20  bg-fff">
    <div class="clearfix  c-ph20 c-pv15 c-fs-16">
      <div class="c-fc-333 margin-r30 fl">
        <span class="c-fc-sgray">最新版本号：</span>
        {{appStatic && (appStatic.lastVersionNo || '--')}}
      </div>
      <div class="c-fc-333 margin-r30 fl">
        <span class="c-fc-sgray">上传时间：</span>
        {{appStatic && (appStatic.uploadTime || '--')}}
      </div>
    </div>
  </div>

  <ul class="c-flex-row margin-t15 ulLine c-justify-sb bg-fff c-pv30">
    <li>
      <p class="c-fs-12">小程序总数</p>
      <h1>{{appStatic && (appStatic.appCount || 0)}}</h1>
    </li>
    <li>
      <p class="c-fs-12">审核通过</p>
      <h1>{{appStatic && (appStatic.auditSuccessCount || 0)}}</h1>
    </li>
    <li>
      <p class="c-fs-12">审核中</p>
      <h1>{{appStatic && (appStatic.auditingCount || 0)}}</h1>
    </li>
    <li>
      <p class="c-fs-12">审核失败</p>
      <h1>{{appStatic && (appStatic.auditFailedCount || 0)}}</h1>
    </li>
  </ul>

  <div class="picker margin-t15 padding20 bg-fff">
    <div class="c-flex-row c-justify-end">
      <el-date-picker
        type="daterange"
        @change="handleDatePicker"
        v-model="datePicker"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-input class="width180 margin-l10" clearable v-model="listQuery.appName" placeholder="请输入小程序名称"></el-input>

      <el-select class="width180 margin-l10"
        clearable
        v-model="listQuery.status"
        placeholder="请选择状态">
        <el-option label="未提审" :value="999"></el-option>
        <el-option label="审核中" :value="0"></el-option>
        <el-option label="审核成功" :value="1"></el-option>
        <el-option label="审核失败" :value="-2"></el-option>
      </el-select>

      <el-button class="search margin-l10" @click="handleSerch" type="primary">搜索</el-button>
      <!-- <el-button plain>批量提交</el-button> -->
    </div>

    <el-table class="margin-t15" :header-row-style="tableHeadStyle" :class="tableCss"
      v-loading="listLoading" :data="tableData" row-key="id" fit highlight-current-row
      @selection-change="handleSelectionChange">
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column align="center" prop="talentName" label="达人名称"></el-table-column>
      <el-table-column align="center" prop="appName" label="小程序名称"></el-table-column>
      <el-table-column align="center" prop="versionNo" label="代码版本"></el-table-column>
      <el-table-column align="center" width="96px" label="审核时间">
        <template slot-scope="scope">
          <template v-if="scope.row.auditTime">
          <p>{{scope.row.auditTime.split(' ')[0]}}</p>
          <p>{{scope.row.auditTime.split(' ')[1]}}</p>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="status" label="审核状态">
        <template slot-scope="scope">
        <span v-if="scope.row.status == 1">审核成功</span>
        <span v-if="scope.row.status == 0">审核中</span>
        <span class="c-fc-red" v-if="scope.row.status == -2">
          审核失败

          <el-popover
            placement="left"
            width="300"
            trigger="hover">
            <div class="c-textAlign-l c-fc-333">{{scope.row.reason}}</div>
            <span slot="reference" class="c-fc-ccc c-ph5"><i class="el-icon-info"></i></span>
          </el-popover>
        </span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="348" fixed="right" label="操作">
        <template slot-scope="scope">
          <div>
            <b class="v-line" @click="handleSetProgram(scope.row.companyId)">发布小程序</b>
            <b class="v-line" @click="handleGetAppMerchant(scope.row.companyId)">第三方进件</b>
            <b class="v-line" @click="handleSecuredTransaction(scope.row)">担保交易</b>
            <b class="v-line" @click="handleAuditAdmin(scope.row.companyId)">重新提交</b>
          </div>
          <div>
            <b class="v-line" @click="handleGetAppQRCodeAdmin(scope.row.companyId)">正式抖音码</b>
            <b class="v-line" @click="handleGetAppVersionQRcode(scope.row.companyId, 1)">审核抖音码</b>
            <b class="v-line" @click="handleGetAppVersionQRcode(scope.row.companyId, 2)">测试抖音码</b>
            <b class="v-line" @click="handleClearCacheQRcode(scope.row.companyId)">清除缓存码</b>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="block c-textAlign-c"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
    </el-pagination>
  </div>

  <!-- 担保交易弹窗 -->
  <super-dialog v-if="showDialog" :show="showDialog" :showConfirmButton="false"
    cancelText="关闭"
    @close="handleClose">
    <el-form slot="content" label-width="150px">
      <el-form-item label="URL(服务器地址)：">
        <el-input class="460px" v-model="securedQuery.callbackUrl"></el-input>
      </el-form-item>
      <el-form-item label="Token(令牌)：">
        <el-input class="460px" v-model="securedQuery.payToken"></el-input>
      </el-form-item>
    </el-form>
  </super-dialog>
</div>
</template>
<script>

import {
  setRelease,
  getAppMerchant,
  auditAdmin,
  getCompanyAppVersionStatistics,
  getCompanyAppVersionAdminList
} from '@/api/tiktok'
import superDialog from '@/views/templatePage/superDialog/index.vue'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  name: 'tikTokVersioning',
  components: { superDialog },
  props: {
    imType: {
      type: Number,
      default: 100 // 100：抖音 200：快手
    }
  },
  data() {
    return {
      listQuery: {
        status: '', // 0审核中,1审核通过,-2审核失败
        appName: '', // 小程序名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        pageSize: 10,
        page: 1,
        total: 0
      },

      securedQuery: {
        callbackUrl: '',
        payToken: ''
      },
      tableData: [],
      appStatic: {},
      datePicker: '',
      listLoading: false,
      showDialog: false
    }
  },

  created() {
    this.handleGetCompanyAppVersionAdminList()
    this.handleGetCompanyAppVersionStatistics()
  },
  methods: {
    handleGetCompanyAppVersionAdminList() {
      getCompanyAppVersionAdminList({ imType: this.imType, ...this.listQuery }).then(res => {
        if (res.data.statusCode == 200) {
          const { records, total } = res.data.data
          this.tableData = records
          this.listQuery.total = total
        }
      })
    },
    handleGetCompanyAppVersionStatistics() {
      getCompanyAppVersionStatistics(this.imType).then(res => {
        if (res.data.statusCode == 200) {
          this.appStatic = res.data.data
        }
      })
    },
    handleSerch() {
      this.listQuery.page = 1
      this.handleGetCompanyAppVersionAdminList()
    },
    handleDatePicker() {
      console.log(this.datePicker)
      console.log(this.datePicker[0], '//')
      console.log(this.datePicker[1])
      this.listQuery.startTime = this.datePicker !== null ? this.datePicker[0] : ''
      this.listQuery.endTime = this.datePicker !== null ? this.datePicker[1] : ''
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.handleGetCompanyAppVersionAdminList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.handleGetCompanyAppVersionAdminList()
    },
    handleSecuredTransaction({ callbackUrl, payToken }) {
      this.showDialog = true
      this.securedQuery.payToken = payToken
      this.securedQuery.callbackUrl = callbackUrl
    },
    handleSelectionChange(val) {

    },
    handleClose() {
      this.showDialog = false
    },
    handleAuditAdmin(id) {
      this.$confirm('确定重新提交？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditAdmin(id, { imType: this.imType }).then(res => {
          if (res.data.statusCode == 200) {
            this.$message.success('提交成功！')

            this.handleGetCompanyAppVersionAdminList()
          }
        })
      })
    },
    handleGetAppMerchant(id) {
      getAppMerchant(id, { imType: this.imType }).then(res => {
        if (res.data.statusCode == 200) {
          const { url } = res.data.data
          window.open(url, '_blank')
        }
      })
    },
    // 获取抖音小程序码
    handleGetAppQRCodeAdmin(companyId) {
      var url = process.env.VUE_APP_TIKTOK_API + `/ttapi/openPlat/getAppQRCodeAdmin/${companyId}`
      const params = {
        imType: this.imType
      }
      this.postMethod(url, params, {}, 'json').then(res => {
        this.$alert(`
            <div class="c-width100 c-textAlign-c">
              <img src="${res.data}" alt="" width="180px" height="180px" />
            </div>`, '抖音小程序码', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭',
          callback: action => {

          }
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 获取审核抖音码及测试抖音码
    handleGetAppVersionQRcode(companyId, codeType) {
      var url = process.env.VUE_APP_TIKTOK_API + `/ttapi/openPlat/getAppVersionQRcode/${companyId}`
      const params = {
        imType: this.imType,
        codeType: codeType
      }
      this.postMethod(url, params, {}, 'json').then(res => {
        this.$alert(`
          <div class="c-width100 c-textAlign-c">
            <img src="${res.data}" alt="" width="180px" height="180px" />
          </div>`, `${codeType == 1 ? '审核' : '测试'}抖音码`, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭',
          callback: action => {

          }
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 获取小程序清理缓存码
    handleClearCacheQRcode(companyId) {
      var url = process.env.VUE_APP_TIKTOK_API + `/ttapi/openPlat/clearCacheQRcode/${companyId}`
      const params = {
        imType: this.imType, codeType: 1
      }
      this.postMethod(url, params, {}, 'json').then(res => {
        this.$alert(`
          <div class="c-width100 c-textAlign-c">
            <img src="${res.data}" alt="" width="180px" height="180px" />
          </div>`, '清除缓存码', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭',
          callback: action => {

          }
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleSetProgram(companyId) {
      this.$confirm('确认发布该小程序吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setRelease(companyId, { imType: this.imType }).then(res => {
          if (res.data.statusCode == 200) {
            this.$message.success('发布成功！')
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">

  .picker .el-date-editor--daterange.el-input__inner {
    width: 400px;
  }

  h1 {margin: 0;}
  .ulLine {
    & > li {
      width: 25%;
      font-size: 12px;
      position: relative;
      text-align: center;
      p {
        color: #999;
        margin-bottom: 10px;
      }
    }
    & > li:after{
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 68px;
      background: #e4e7ed;
      display: inline-block;
    }
    & > li:last-child:after {
      display: none;
    }
  }
</style>
