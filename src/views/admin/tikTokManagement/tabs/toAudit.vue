<template>
  <div>
    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              v-loading="listLoading" element-loading-text="加载中..."
              fit highlight-current-row
              :class="tableCss">
      <el-table-column align="left" width="300px" label="内容名称">
        <template slot-scope="scope">
          <div class="clearfix c-textAlign-l">
            <el-image class="fl margin-r10" :src="scope.row.cover" :width='102' :height='68'></el-image>
            <div class="fl c-width50">
               <el-eye :value="scope.row.name" width="140"></el-eye>
               <p class="margin-t">{{scope.row.price == 0 ? '免费' : '￥' + scope.row.price}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="达人名称">
        <template slot-scope="scope">
          <div>{{scope.row.talentName}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="抖音号">
        <template slot-scope="scope">
          <div>{{scope.row.tiktokId}}</div>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="作品分类">
        <template slot-scope="scope">
          <div>{{categoryName(scope.row.categoryVoList)}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商家版本">
        <template slot-scope="scope">
          <div>{{scope.row.companyVersion == 100 ? '标准版': '独立版'}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="查看">
        <template slot-scope="scope">
          <div class="c-fc-blue pointer" @click="handleDetail(scope.row.prodId)">详情</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <b class="v-line" @click="handlePass(scope.row)">通过</b>

          <b class="v-line" @click="handleReject(scope.row)">不通过</b>
        </template>

      </el-table-column>
    </el-table>


    <super-dialog title="审核结果通知"
      width="600px" top="3%"
      :show="showAuditInfo"
      @confirm="handleConfirm"
      @close="showAuditInfo = false" :loading="dialogLoading">
      <template slot="content">
        <el-form :model="postForm">
          <el-form-item label="审核平台："> 创客匠人 </el-form-item>

          <el-form-item label="审核结果："> 审核不通过 </el-form-item>

          <el-form-item label="审核时间：">{{postForm.auditTime}}</el-form-item>

          <el-form-item label="申请内容：">{{postForm.name}}</el-form-item>

          <el-form-item label="拒绝理由：">
            <el-input type="textarea" show-word-limit
               maxlength="150" :rows="4" v-model="postForm.rejectReason" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </super-dialog>

    <detail-info
      v-if="showAlreadyInfo"
      :show="showAlreadyInfo"
      :checkId="checkId"
      @close="close"
    ></detail-info>
  </div>
</template>
<script>
import superDialog from '@/views/templatePage/superDialog/index.vue'
import { parseTime } from '@/utils/index'
import detailInfo from '../components/detailInfo.vue'

export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: { detailInfo, superDialog },
  props: {
    tableData: Array
  },
  data() {
    return {
      dialogLoading: false,
      showAlreadyInfo: false,
      showAuditInfo: false,
      listLoading: false,
      checkId: '',
      postForm: {
        id: '',
        name: '',
        auditTime: '',
        rejectReason: ''
      }
    }
  },

  created() {
  },
  methods: {

    handleDetail(id) {
      this.checkId = id
      this.showAlreadyInfo = true
    },
    close(val) {
      this.showAlreadyInfo = false
    },
    categoryName(val) {
      const categoryName = JSON.parse(JSON.stringify(val))
      return categoryName.map(el => el.name).join('---')
    },
    handlePass({ id }) {
      this.$confirm('确定审核通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // {id, 1, this.postForm.rejectReason, 0}
        const row = {
          id,
          auditStatus: 1,
          rejectReason: '',
          isNotice: 0
        }
        this.$emit(
          'handleAuditCheck',
          row,
          val => {
            if (val) {
              this.$message.info('审核已通过')
              this.$parent.initData(2)
            }
          }
        )
      }).catch(() => {})
    },
    handleReject({ id }) {
      this.$confirm('该内容审核不通过，是否发店铺消息通知？', '确认信息', {
        confirmButtonText: '去发消息',
        cancelButtonText: '直接不通过',
        distinguishCancelAndClose: true
      }).then(() => {
        this.showAuditInfo = true
        this.$emit(
          'getAuditInfo',
          id,
          rform => {
            this.postForm = { ...rform }
            this.$set(this.postForm, 'auditTime', parseTime(new Date()))
          }
        )
      }).catch(action => {
        if (action === 'cancel') {
          const row = {
            id,
            auditStatus: 3,
            rejectReason: '',
            isNotice: 0
          }
          this.$emit(
            'handleAuditCheck',
            row,
            val => {
              if (val) {
                this.$message.info('审核不通过')

                this.$parent.initData(2)
              }
            }
          )
        }
      })
    },
    handleConfirm() {
      if (!this.postForm.rejectReason) {
        return this.$message.warning('拒绝理由不能为空！')
      }
      this.$emit(
        'handleAuditCheck',
        {
          id: this.postForm.id,
          auditStatus: 3,
          rejectReason: this.postForm.rejectReason,
          isNotice: 1
        },
        val => {
          if (val) {
            this.showAuditInfo = false
            this.$parent.initData(2)
          }
        }
      )
    }
  }
}
</script>
