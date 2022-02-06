<template>
  <div v-loading="listLoading">
    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              element-loading-text="加载中..."
              fit highlight-current-row
              :class="tableCss">
      <el-table-column align="left" width="230px" label="账号名称">
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
      <el-table-column align="center" label="创作主体">
        <template slot-scope="scope">
          <div>{{scope.row.subjectType | subjectTypeFilter}}</div>
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
      <el-table-column align="center" width="100" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime&&scope.row.createTime.split(' ')[0]}}</span>
          <div>{{scope.row.createTime&&scope.row.createTime.split(' ')[1]}}</div>
        </template>
      </el-table-column>
<!--
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
          <div>{{scope.row.mobile}}</div>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="背景" width="203px">
        <template slot-scope="scope">
          <el-eye :value="scope.row.talentDesc" wordLimitLine="c-text-ellipsis2" width="155" :limitLen="30"></el-eye>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标记沟通状态">
        <template slot-scope="scope">
          <el-select @change="handleStatusChange(scope.row)" v-model="scope.row.status">
            <el-option
              v-for="item in applyOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="操作">

        <template slot-scope="scope">
          <el-button class="v-line"
          v-if="(from == 'application')&&(isRoot || $store.getters.adminPermission.indexOf('tikTokIntendApply_edit')>=0)"
          @click="clickDeploy(scope.row)" type="text">
            去部署
          </el-button>
          <b class="v-line"
          v-if="from == 'application'&&(isRoot || $store.getters.adminPermission.indexOf('tikTokIntendApply_edit')>=0)"
          @click="handleAbandon(scope.row)"  type="text">
            放弃入驻
          </b>
          <el-button type="text"
          v-if="from == 'abandoninto'"
          @click="handleDetail(scope.row.id)">
            详情
          </el-button>
          <el-button type="text"
            v-if="from == 'abandoninto'&&(isRoot || $store.getters.adminPermission.indexOf('tikTokGiveUpInto_edit')>=0)"
          @click="handleRecall(scope.row.id)">
            重新召回
          </el-button>
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
    <!-- 部署客户弹框 -->
    <deploy-company v-if="showDeployCompany"
      :showDialog.sync="showDeployCompany"
      :deployId="deployId"
      :deployType="from == 'application' ? 1:3"
      @coloseDialog="handleCloseDialog"
    ></deploy-company>
  </div>
</template>
<script>

import { isRoot } from '@/utils/permission'
import deployCompany from '@/views/admin/tikTokManagement/components/deployCompany.vue'
import { getIntendedList, editIntendedList, setRecall, setGiveup } from '@/api/tiktok'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  props: {
    from: String// 来源 Application: 意向申请, abandoninto: 放弃入驻
  },
  components: { deployCompany },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        status: '', // 状态：1：未联系，2：沟通中，3：进一步沟通，4：放弃
        tabType: 1 // 1: 意向申请，2：放弃入驻
      },
      total: 0,

      isRoot: isRoot(),
      tableData: [],
      listLoading: false,
      applyOption: [
        {
          value: 1,
          label: '未联系'
        },
        {
          value: 2,
          label: '沟通中'
        },
        {
          value: 3,
          label: '进一步沟通'
        },
        {
          value: 4,
          label: '放弃'
        }
      ],
      showDeployCompany: false // 部署弹框的显示
    }
  },
  filters: {
    subjectTypeFilter(val) {
      const subType = new Map([
        [1, '个人'],
        [2, '企业'],
        [3, '团体'],
        [4, 'MCN']
      ])
      return subType.get(val)
    }
  },
  mounted() {
    console.log(this.from, 'tab from')
    this.listQuery.tabType = this.from == 'application' ? 1 : 2

    this.listQuery.status = sessionStorage.getItem('applicationStatus')
    this.handleGetIntendedList(this.listQuery)
  },
  methods: {
    handleGetIntendedList({ pageNo, pageSize, status, tabType }) {
      this.listLoading = true
      getIntendedList({ pageNo, pageSize, status, tabType }).then(res => {
        this.total = res.data.data.total
        if (res.data.statusCode == 200) {
          this.listLoading = false
          this.tableData = res.data.data.records
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      // this.listQuery.status = sessionStorage.getItem('applicationStatus')
      this.handleGetIntendedList(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.handleGetIntendedList(this.listQuery)
    },
    handleDetail(id) {
      this.deployId = id
      this.showDeployCompany = true
    },
    handleCloseDialog() {
      this.handleGetIntendedList(this.listQuery)
    },
    handleStatusChange({ id, status }) {
      editIntendedList({ id, status }).then(res => {
        if (res.data.statusCode == 200) {
          this.$message.success('修改成功')

          // this.listQuery.status = sessionStorage.getItem('applicationStatus')
          this.handleGetIntendedList(this.listQuery)
        }
      })
    },
    clickDeploy(data) { // 点击去部署
      this.$confirm('是否给该客户部署抖音达人系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => { // 显示去部署的弹框
        this.deployId = data.id
        this.showDeployCompany = true
      }).catch(() => {

      })
    },
    handleAbandon({ id }) {
      this.$confirm('该客户是否放弃入驻？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => { // 显示去部署的弹框
        setGiveup({ id }).then(res => {
          if (res.data.statusCode == 200) {
            this.$message.info('操作成功！')

            this.handleGetIntendedList(this.listQuery)
          }
        })
      }).catch(() => {

      })
    },
    handleRecall(id) {
      this.$confirm('是否确定重新召回该用户？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        setRecall({ id }).then(res => {
          if (res.data.statusCode == 200) {
            this.$message.info('操作成功！')

            this.handleGetIntendedList(this.listQuery)
          }
        })
      })
    }
  }

}
</script>
