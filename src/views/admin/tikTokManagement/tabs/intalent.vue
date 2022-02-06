<template>
  <div class="relative">

    <div style="top: -59px; right: 3px;" class=" absolute">
      <el-select v-if="!isLookStandard" v-model="listQuery.appType" placeholder="渠道来源" clearable>
        <el-option label="知识付费" value="1"></el-option>
        <el-option label="C端用户" value="2"></el-option>
      </el-select>

      <el-select v-model="listQuery.companyVersion" placeholder="版本号" clearable>
        <el-option label="标准版" value="100"></el-option>
        <el-option label="独立版" value="200"></el-option>
      </el-select>

      <el-select v-model="listQuery.subjectType" placeholder="创作主体" clearable>
        <el-option v-for="(item, index) in subjectTypeList" :key="index" :label="item.text" :value="item.value"></el-option>
        <el-option label="知识付费" value="5"></el-option>
      </el-select>

      <el-input v-model="listQuery.content" class="width220 padding-r6" clearable placeholder="输入达人名称或手机号搜索"></el-input>
      <el-button type="primary" @click="handleFilter" class="search">搜索</el-button>
    </div>

    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              v-loading="listLoading" element-loading-text="加载中..."
              fit highlight-current-row
              :class="tableCss">
      <el-table-column align="left" width="300px" label="账号名称">
        <template slot-scope="scope">
          <div class="clearfix c-textAlign-l c-flex-row c-aligni-center">
            <el-image class="fl c-br-50 margin-r10" :src="scope.row.headimgurl" :width='40' :height='40'></el-image>
            <div class="fl c-flex-grow1 c-line-28">

              <el-eye :value="scope.row.talentName" width="160"></el-eye>
               <p>抖音号：{{scope.row.dyaccount}}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="版本号">
        <template slot-scope="scope">
          <div>{{scope.row.companyVersion == 100 ? '标准版':'独立版'}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道来源">
        <template slot-scope="scope">
          <div>{{scope.row.appType == 1 ? '知识付费':'C端用户'}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台名称">
        <template slot-scope="scope">
          <div>{{scope.row.companyName}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创作主体">
        <template slot-scope="scope">
          <div>{{scope.row.subjectTypeName}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="粉丝数">
        <template slot-scope="scope">
          <div>{{scope.row.totalFans}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作品分类">
        <template slot-scope="scope">
          <div>{{scope.row.talentTypeName}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="95" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime&&scope.row.createTime.split(' ')[0]}}</span>
          <div>{{scope.row.createTime&&scope.row.createTime.split(' ')[1]}}</div>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">

          <div>{{scope.row.name}}</div>
          <div>{{scope.row.mobile}}</div>
        </template>
      </el-table-column> -->

      <el-table-column align="center" width="183px" label="背景">
        <template slot-scope="scope">
          <el-eye :value="scope.row.talentDesc" wordLimitLine="c-text-ellipsis2" width="195" :limitLen="30"></el-eye>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="协议">
        <template slot-scope="scope">
          <b @click="handleAgreement(scope.row)">{{scope.row.protocolTotal}}</b>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="达人状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="冻结">
          </el-switch>
        </template>

      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <b v-if="isRoot || adminPermission.indexOf('tikTokSettleTalent_edit')>=0" @click="handleEdit(scope.row)">编辑</b>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background
        v-if="tableData.length>0"
        class="block c-textAlign-c"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <deploy-company v-if="isShowDeployCompany"
      :showDialog.sync="isShowDeployCompany"
      :deployId="deployId"
      :appType="appType"
      :deployType="2"
    ></deploy-company>

    <super-dialog
      v-if="isShowProtocol"
      class="no-padding"
      width="580px" top="10%"
      :show="isShowProtocol"
      :showButton="false"
      @close="isShowProtocol = false">
      <template slot="content">
        <p class="c-fs-14 padding-l5 margin-b20"><span class="font-bold">达人老师：</span> {{talentName}}</p>
        <el-table :data="protolData" :class="tableCss"
        fit highlight-current-row
        :header-cell-style="tableHeadStyle">
          <el-table-column label="协议名称">
            <template slot-scope="scope">
              {{scope.row.type == 1 ? '服务协议': ''}}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span class="c-fc-green">已同意</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
        </el-table>

      </template>
    </super-dialog>

  </div>
</template>
<script>
import { isRoot } from '@/utils/permission'
import { settleInPage, protocolList, getSubjectType } from '@/api/tiktok'
import superDialog from '@/views/templatePage/superDialog/index.vue'
import deployCompany from '@/views/admin/tikTokManagement/components/deployCompany.vue'

export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: { deployCompany, superDialog },
  data() {
    return {
      listLoading: false,
      listQuery: {
        companyVersion: '',
        appType: '',
        subjectType: '',
        content: '',
        pageNo: 1,
        pageSize: 10
      },

      isRoot: isRoot(),
      total: 0,
      appType: 1, // 来源版本
      tableData: [],
      protolData: [],
      deployId: '',
      talentName: '',
      subjectTypeList: [],
      isShowProtocol: false,
      isShowDeployCompany: false
    }
  },
  computed: {
    adminPermission() { // admin权限
      return this.$store.getters.adminPermission || []
    },
    isLookStandard() { // 是否只能查看C端用户
      return this.adminPermission.indexOf('tikTokSettleTalent_look_standard') != -1 && this.adminPermission.indexOf('tikTokSettleTalent_look') < 0
    }
  },
  created() {
    this.handleSettleInPage()
    this.handleGetSubjectType()
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNo = 1
      this.handleSettleInPage()
    },
    handleGetSubjectType() {
      getSubjectType().then(res => {
        if (res.data.statusCode == 200) {
          this.subjectTypeList = res.data.data
        }
      })
    },
    handleSettleInPage() {
      if (this.isLookStandard) {
        this.listQuery.appType = '2' // 搜索置为C端用户
      }
      this.listLoading = true

      settleInPage(this.listQuery).then(res => {
        this.total = res.data.data.total
        this.listLoading = false
        if (res.data.statusCode == 200) {
          this.tableData = res.data.data.records
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.handleSettleInPage()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.handleSettleInPage()
    },
    handleEdit({ id, appType }) {
      this.deployId = id
      this.appType = appType
      this.isShowDeployCompany = true
    },
    // 处理显示用户已同意的服务协议
    handleAgreement({ id, talentName }) {
      this.talentName = talentName
      this.isShowProtocol = true
      protocolList({ id }).then(res => {
        if (res.data.statusCode == 200) {
          this.protolData = res.data.data
        }
      })
    }
  }

}
</script>
