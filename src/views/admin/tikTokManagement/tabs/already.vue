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

      <el-table-column align="center" prop="auditTime" label="审核时间"> </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div class="c-fc-blue c-fc-orange pointer">已通过</div>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="是否审核显示">
        <template slot-scope="scope">
          <el-select class="width90" v-model="scope.row.versionCheckType" @change="(val) => handleCheckTypeChange(val, scope.row.prodId)">
            <el-option label="是" :value="2"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">

        <template slot-scope="scope">

          <b class="v-line" @click="handleAbnormal(scope.row.id)">异常处理</b>

          <b class="v-line" @click="handleDetail(scope.row.prodId)">详情</b>

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

    <superDialog
      v-if="isShowAbnormal"
      @close="isShowAbnormal = false"
      @confirm="handleAbnormalConfirm"
      title="异常处理"
      class="no-padding"
      :show="isShowAbnormal"
      width="30%">
      <template slot="content">
        <p class="c-fc-333 c-mv20"><i class="el-icon-warning c-fc-orange"></i> 该数据异常，确认下架？</p>
        <el-form :rules="rules" :model="postForm" ref="postForm">

          <el-form-item label="异常原因：" label-width="100px">
            <el-select v-model="auditStatus" @change="handleAuditChange" class="c-width100">
              <el-option v-for="item in transOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="auditStatus == 6" label="下架原因：" label-width="100px" prop="rejectReason">
            <el-input type="textarea" v-model="postForm.rejectReason" show-word-limit maxlength="150" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </superDialog>
  </div>
</template>
<script>
import detailInfo from '../components/detailInfo.vue'
import { prodErrorDeal, setAppCheckProdRelate } from '@/api/tiktok'
import superDialog from '@/views/templatePage/superDialog/index.vue'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: { detailInfo, superDialog },
  data() {
    return {
      checkId: '',
      listLoading: false,
      showAlreadyInfo: false,
      isShowAbnormal: false,
      postForm: {
        id: '',
        isNotice: 1,
        auditStatus: 3,
        rejectReason: ''
      },
      auditStatus: 1,
      rules: {
        rejectReason: [{ required: true, message: '下架原因不能为空', trigger: 'blur' }]
      },
      transOptions: [
        { label: '内容涉及婴幼儿学龄前教育和 K12 学科教育类', value: 1 },
        { label: '内容涉及非金融机构小额贷款、融资担保、商业保理等', value: 2 },
        { label: '内容涉及医疗相关类型', value: 3 },
        { label: '内容涉及网贷、彩票、比特币、区块链等相关内容', value: 4 },
        { label: '内容涉及违反法律法规、违背公序良俗、色情低俗等内容', value: 5 },
        { label: '其他', value: 6 }
      ]
    }
  },

  props: {
    tableData: Array
  },
  created() {
  },
  methods: {
    handleDetail(id) {
      this.checkId = id
      this.showAlreadyInfo = true
    },
    categoryName(val) {
      const categoryName = JSON.parse(JSON.stringify(val))
      return categoryName.map(el => el.name).join('---')
    },
    close(val) {
      this.showAlreadyInfo = false
    },
    handleAbnormal(id) {
      this.isShowAbnormal = true
      this.postForm.id = id
    },
    handleAuditChange() {
      if (this.auditStatus != 6) { this.postForm.rejectReason = this.transOptions[this.auditStatus - 1].label }
    },
    async handleCheckTypeChange(val, id) {
      const rusult = await setAppCheckProdRelate({
        relateId: id,
        relateType: 1,
        versionCheckType: val
      }).catch(() => false)

      if (!rusult) return
      this.$message.success('操作成功！')
    },
    handleAbnormalConfirm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.auditStatus == 1) {
            this.postForm.rejectReason = this.transOptions[0].label
          }
          prodErrorDeal(this.postForm).then(res => {
            if (res.data.statusCode == 200) {
              this.isShowAbnormal = false
              this.$message.success('下架成功！')
              this.$parent.initData(1)
            }
          })
        }
      })
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
