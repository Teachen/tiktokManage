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

      <el-table-column align="center" label="审核时间">
        <template slot-scope="scope">
          <div>{{scope.row.auditTime}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否通知">
        <template slot-scope="scope">
          <div class="c-fc-blue pointer">{{scope.row.isNotice == 0 ? '不通知' : '通知'}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">

        <template slot-scope="scope">
          <b class="v-line" @click="handleDetail(scope.row.prodId)">详情</b>
          <b class="v-line" @click="handleCheckReason(scope.row)">查看原因</b>
          <b class="v-line" @click="handleCheckContent(scope.row)">联系方式</b>
        </template>
      </el-table-column>
    </el-table>


    <detail-info
      v-if="showAlreadyInfo"
      :show="showAlreadyInfo"
      :checkId="checkId"
      @close="close"
    ></detail-info>
  </div>
</template>
<script>
import detailInfo from '../components/detailInfo.vue'

export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: { detailInfo },
  data() {
    return {
      checkId: '',
      showAlreadyInfo: false,
      listLoading: false
    }
  },
  props: {
    tableData: Array
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
    handleCheckReason({ id }) {
      this.$emit(
        'getAuditInfo',
        id,
        res => {
          if (res) {
            const h = this.$createElement
            this.$msgbox({
              title: '查看理由',
              message: h('div', { style: 'text-align: left; ' }, [
                h('div', { style: 'margin: 20px 0 20px; font-size: 16px;' }, res.rejectReason)
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                done()
              }
            }).then(action => {
            })
          }
        }
      )
    },
    handleCheckContent({ id }) {
      this.$emit(
        'getContantInfo',
        id,
        scope => {
          if (scope) {
            const h = this.$createElement
            this.$msgbox({
              title: '内容方联系方式',
              message: h('div', { style: 'text-align: left; ' }, [
                h('div', { style: 'margin: 20px 0 20px; font-size: 16px;' }, '店铺负责人: ' + scope.lecturerName),
                h('div', { style: 'margin-bottom: 20px; font-size: 16px;' }, '手机号码: ' + scope.lecturerPhone)
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                done()
              }
            }).then(action => {
            }).catch(() => {})
          }
        }
      )
    }
  }
}
</script>
