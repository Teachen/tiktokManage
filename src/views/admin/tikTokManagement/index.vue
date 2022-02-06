<template>
  <div class="tiktok" :class="['dataAnalysis', 'versioning', 'openAdvertising'].includes(activeTab) ? 'main-container c-bg-f5 c-ph15 c-pv15' : 'app-container '">

    <!-- 内容审核页面顶部管理 start -->
    <!--  -->
    <div class="relative">
      <div v-if="activeTab == 'toAudit'" style="top: 8px;" class="absolute c-pa-r0">
        <el-select class="width180" v-model="listQuery.versionCheckType"
          v-if="activeName == 'already'"
          @change="handleFilter">
          <el-option label="是否审核展示" value=""></el-option>
          <el-option label="是" :value="2"></el-option>
          <el-option label="否" :value="1"></el-option>
        </el-select>

        <el-select class="width180" v-model="listQuery.categoryLevel1Id"
          v-if="activeName == 'already'"
          @change="handleCategoryChange"
          placeholder="一级分类">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in categoryLevel1List" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <el-select class="width180" v-show="categoryLevel2List.length > 0 && activeName == 'already'"  v-model="listQuery.categoryLevel2Id"
        @change="handleFilter" placeholder="二级分类">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="item in categoryLevel2List" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-input v-model="listQuery.talentName" class="width180 padding-r6" clearable placeholder="请输入达人名称搜索"></el-input>
        <el-input v-model="listQuery.prodName" class="width180 padding-r6" clearable placeholder="请输入产品名称搜索"></el-input>
        <el-button type="primary" @click="handleFilter" class="search">搜索</el-button>
      </div>
    </div>

    <el-radio-group
      class="margin-b20 margin-t8"
      size="medium"
      v-if="activeTab == 'toAudit'"
      @change="handleClick"
      v-model="activeName">
      <el-radio-button label="toAudit">待审核</el-radio-button>
      <el-radio-button label="already">已通过</el-radio-button>
      <el-radio-button label="noPass">不通过</el-radio-button>
    </el-radio-group>

    <!-- 达人管理页面顶部管理 start -->
    <!--  -->
    <div class="relative" v-if="activeTab == 'application'">
      <el-tabs class="margin-t8" @tab-click="handletabClick" type="card" v-model="activeName2">
        <el-tab-pane v-if="isRoot || $store.getters.adminPermission.indexOf('tikTokIntendApply')>=0" label="意向申请" name="application"></el-tab-pane>
        <el-tab-pane v-if="isRoot || $store.getters.adminPermission.indexOf('tikTokSettleTalent')>=0"  label="入驻达人" name="intalent"></el-tab-pane>
        <el-tab-pane v-if="isRoot || $store.getters.adminPermission.indexOf('tikTokGiveUpInto')>=0"  label="放弃入驻" name="abandoninto"></el-tab-pane>
      </el-tabs>

      <el-select v-show="['application', 'abandoninto'].includes(activeName2)"
        class="absolute c-pa-t0 c-pa-r0"
        clearable
        placeholder="沟通状态"
        @change="handleApplyChange"
        v-model="applyType">
        <el-option
          v-for="item in applyOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <!-- 页面装修顶部管理 start -->
    <!--  -->
    <el-tabs
      v-if="activeTab == 'slideShow'"
      class="margin-t8" type="card" v-model="activeName3">
      <el-tab-pane label="轮播图设置" name="slideShow"></el-tab-pane>
      <el-tab-pane label="专区设置" name="zoneSet"></el-tab-pane>
    </el-tabs>

    <!-- 数据分析顶部管理 start -->
    <!--  -->
    <div v-if="activeTab == 'dataAnalysis' && !isdataAnalysisLookStandard" class="clearfix bg-fff c-ph20 analysist-top">
      <el-tabs class="fl" v-model="activeName4">
        <el-tab-pane  v-if="isRoot || $store.getters.adminPermission.indexOf('tikTokdataAnalysis')>=0" label="数据概况" name="dataAnalysis"></el-tab-pane>
        <!-- <el-tab-pane label="达人分析" name="talentData"></el-tab-pane> -->
        <!-- <el-tab-pane label="商品分析" name="productAnaly"></el-tab-pane> -->
      </el-tabs>

      <el-select v-model="versionType" class="fr width110 margin-t9">
        <el-option label="全部" value="1"></el-option>
        <el-option label="C端用户" value="2"></el-option>
      </el-select>
    </div>

    <keep-alive>
      <component
        ref="tiktokCom"
        v-loading="listLoading"
        :is="currentTabComponent"
        @handleAuditCheck="handleAuditCheck"
        @getContantInfo="getContantInfo"
        @getAuditInfo="getAuditInfo"
        :tableData="tableData"
        :key="currentTabComponent"
        :versionType="versionType"
        :from="activeTab == 'application' ?activeName2:''"
        />

    </keep-alive>

      <el-pagination
          v-if="tableData.length>0 && activeTab == 'toAudit'"
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
</template>
<script>
import abandoninto from './tabs/application.vue'

const paths = require('path') // node path路径
const requireComponent = require.context('./tabs', false, /\.vue$/) // webpack 依赖管理
const modules = {}

requireComponent.keys().forEach(key => {
  const name = paths.basename(key, '.vue')
  modules[name] = requireComponent(key).default || requireComponent(key)
})

import { getCheckList, getCheckById, auditCheck, getCategoryList, getCompanyInfoForCheckId } from '@/api/tiktok'
import { isRoot } from '@/utils/permission'
import { mapGetters } from 'vuex'

export default {
  components: {
    ...modules,
    abandoninto

  },
  data() {
    return {
      activeTab: 'toAudit', // 切换的页面tab名称
      activeName: 'toAudit', // 内容审核页面 tab
      activeName2: 'application', // 达人管理页面 tab
      activeName3: 'slideShow', // 页面装修页面 tab
      activeName4: 'dataAnalysis', // 数据分析页面 tab
      applyType: '',
      versionType: '1', // 数据分析版本
      applyOption: [
        { value: 1, label: '未联系' },
        { value: 2, label: '沟通中' },
        { value: 3, label: '进一步沟通' },
        { value: 4, label: '放弃' }
      ],
      auditStatus: 2,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        talentName: '', // 达人名称
        prodName: '', // 产品名称
        versionCheckType: '', // 是否审核展示
        categoryLevel1Id: '', // 一级目录ID
        categoryLevel2Id: '', // 二级目录ID
        total: 0
      },
      categoryLevel1List: [],
      categoryLevel2List: [],
      isRoot: isRoot(),
      tableData: [],
      from: '', // 达人管理页面判断tab页
      listLoading: false
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      const routes = new Map([
        ['tikTokAudit', 'toAudit'],
        ['tikTokClassification', 'classify'],
        ['tikTokDecorate', 'slideShow'],
        ['tikTokIntalent', 'application'],
        ['tikTokVersionRecord', 'versionRecord'],
        ['tikTokAnalysis', 'dataAnalysis'],
        ['tikTokOperatingSet', 'operatingSet'],
        ['tikTokVersioning', 'versioning']
      ])
      console.log(to.name, 'before')
      vm.activeTab = routes.get(to.name)
    })
  },
  computed: {
    currentTabComponent() {
      // 内容审核
      if (this.activeTab == 'toAudit') {
        return this.activeName
      }
      // 分类管理 // 版本记录 // 版本管理
      if (['classify', 'versionRecord', 'versioning', 'operatingSet'].includes(this.activeTab)) {
        return this.activeTab
      }
      // 页面装修
      if (this.activeTab == 'slideShow') {
        return this.activeName3
      }
      // 达人管理
      if (this.activeTab == 'application') {
        return this.activeName2
      }
      // 数据分析
      if (this.activeTab == 'dataAnalysis') {
        return this.activeName4
      }
    },
    // 数据分析是否只能查看标准版
    isdataAnalysisLookStandard() {
      return this.$store.getters.adminPermission.indexOf('tikTokdataAnalysis_look_standard') != -1 && this.$store.getters.adminPermission.indexOf('tikTokdataAnalysis_look') < 0
    },

    ...mapGetters([
      'adminPermission'
    ])
  },
  created() {
    this.handleAdminPermission()
    sessionStorage.setItem('applicationStat-us', '')
    this.handleGetCategoryList()
    // 数据分析标准版只能查看标准版数据
    this.isdataAnalysisLookStandard && (this.versionType = 2)
  },
  mounted() {
    // 切换标签路由导致 activeTab赋值失败，重新赋值

    // if (this.activeTab == 'toAudit') {
    const routes = new Map([
      ['tikTokAudit', 'toAudit'],
      ['tikTokClassification', 'classify'],
      ['tikTokDecorate', 'slideShow'],
      ['tikTokIntalent', 'application'],
      ['tikTokVersionRecord', 'versionRecord'],
      ['tikTokAnalysis', 'dataAnalysis'],
      ['tikTokOperatingSet', 'operatingSet'],
      ['tikTokVersioning', 'versioning']
    ])

    this.activeTab = routes.get(this.$route.name)
    // }
  },
  methods: {

    handletabClick() {
      this.applyType = ''
      sessionStorage.setItem('applicationStatus', '')
    },
    handleAdminPermission() {
      // 内容审核和达人管理关掉某个tab页，页面也要重新渲染到对应页面
      // 对应模块权限关闭，内容切换到对应的tab页面
      const activeTab = new Map([
        ['tikTokAudit', 'toAudit'],
        ['tikTokDecorate', 'Decorate'],
        ['tikTokClassification', 'classify'],
        ['tikTokIntalent', 'application'],
        ['tikTokIntendApply_look', 'application'],
        ['tikTokIntendApply_edit', 'application'],
        ['tikTokSettleTalent_look', 'application'],
        ['tikTokSettleTalent_edit', 'application'],
        ['tikTokGiveUpInto_look', 'application'],
        ['tikTokGiveUpInto_edit', 'application']
      ])

      const fir = this.adminPermission.filter(item =>
        ['tikTokAudit', 'tikTokDecorate', 'tikTokIntalent', 'tikTokClassification'].includes(item)
      )

      // 如果达人管理有开启查看操作权限,要切到对应页面路由
      if (this.$store.getters.adminPermission.indexOf('tikTokSettleTalent') >= 0) {
        this.activeName2 = 'intalent'
      } else if (this.$store.getters.adminPermission.indexOf('tikTokGiveUpInto') >= 0) {
        this.activeName2 = 'abandoninto'
      }

      this.activeTab = activeTab.get(fir[0]) || 'toAudit'

      if (this.activeTab == 'toAudit' || this.isRoot) this.initData(2)
    },
    // 获取一二级分类数据
    handleGetCategoryList() {
      getCategoryList({
        name: ''
      }).then(res => {
        this.categoryLevel1List = res.data.data
      })
    },
    handleCategoryChange() {
      if (this.listQuery.categoryLevel1Id &&
      this.categoryLevel1List.some(el => el.id == this.listQuery.categoryLevel1Id)) {
        this.categoryLevel2List = this.categoryLevel1List.find(el => el.id == this.listQuery.categoryLevel1Id).childList
      }

      if (!this.listQuery.categoryLevel1Id) {
        this.categoryLevel2List = []
      }
      this.$set(this.listQuery, 'categoryLevel2Id', '')

      this.handleFilter()
    },
    // 产品审核方式
    handleAuditCheck({ id, auditStatus, rejectReason, isNotice }, callback) {
      auditCheck({
        id,
        auditStatus,
        rejectReason,
        isNotice
      }).then(res => {
        if (res.data.statusCode == 200) {
          callback(true)
        }
      })
        .catch(_ => {
          callback(false)
        })
    },
    // 获取联系方式
    getContantInfo(checkId, callback) {
      getCompanyInfoForCheckId(checkId).then(res => {
        if (res.data.statusCode == 200) {
          callback(res.data.data || {})
        }
      })
        .catch(err => { console.log(err) })
    },
    // 获取审核单信息
    getAuditInfo(checkId, callback) {
      getCheckById(checkId).then(res => {
        if (res.data.statusCode == 200) {
          callback(res.data.data || {})
        }
      })
    },
    // 获取审核记录
    initData(auditStatus) {
      if (this.listLoading) { return }
      this.listLoading = true
      const data = Object.assign({}, this.listQuery, { auditStatus })
      getCheckList(data).then(res => {
        this.listLoading = false
        if (res.data.statusCode == 200) {
          const { records, total } = res.data.data
          this.tableData = records
          this.listQuery.total = total

          // 如果最后一页审核操作后无数据，跳转至第一页
          if (this.listQuery.pageNo != 1 && this.tableData.length == 0) {
            this.listQuery.pageNo = 1
            this.initData(2)
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleClick(tab) {
      const tabIdx = new Map([
        ['already', 1],
        ['toAudit', 2],
        ['noPass', 3]
      ])

      this.listQuery.pageNo = 1
      this.listQuery.total = 0
      this.listQuery.prodName = ''
      this.initData(tabIdx.get(tab))

      this.auditStatus = tabIdx.get(tab)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.initData(this.auditStatus)
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.initData(this.auditStatus)
    },
    handleApplyChange() {
      this.$refs.tiktokCom.handleGetIntendedList({
        pageNo: 1,
        pageSize: 10,
        status: this.applyType
      })
      sessionStorage.setItem('applicationStatus', this.applyType)
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.initData(this.auditStatus)
    }
  }
}
</script>
<style lang="scss">
  .tiktok {
    .el-tabs:nth-child(3) .el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    .slideshow {
      padding: 8px 0 0 10px;
    }
  }

  .analysist-top {
    .el-tabs__item {
      height: 54px;
      line-height: 54px;
    }
    .el-tabs__header {
       margin: 0;
     }
    .el-tabs__nav-wrap::after {
      z-index: -1;
    }
  }
</style>
<style lang="scss" scoped>
  .margin-t9 {margin-top: 9px;}
</style>
