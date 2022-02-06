<template>
  <div>
    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              v-loading="listLoading" element-loading-text="加载中..."
              fit highlight-current-row
              :class="tableCss">
      <el-table-column align="center" label="专区名称" prop="sectionName">
      </el-table-column>

      <el-table-column align="center" label="专区类别">
        <template slot-scope="scope">
          {{handleSectionType(scope.row.sectionType)}}
        </template>
      </el-table-column>

      <el-table-column  align="center" label="专区描述" prop="sectionDesc">
      </el-table-column>

      <el-table-column  align="center" label="规则" prop="sectionRule">
      </el-table-column>

      <el-table-column  align="center" label="内容数" prop="contentCount">
      </el-table-column>

      <el-table-column width="280px" align="center" label="排序">
        <template slot-scope="scope">
          <change-sort2
            class="height50 c-line-40"
            :ref="`changeSort_${scope.$index+1}`"
            :itemIndex="`changeSort_${scope.$index+1}`"
            :activeIndex.sync="activeIndex"
            :value="scope.$index+1"
            :row="scope.row"
            @saveSort="moveSort(
              $event,
              scope.$index+1,
              tableData.length,
              `changeSort_${scope.$index}`
            )">
          </change-sort2>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template slot-scope="scope">
          <b class="v-line" @click="handleCheckContent(scope.row)">内容管理</b>
          <b class="v-line" @click="handleEdit(scope.row)">编辑</b>
        </template>
      </el-table-column>

    </el-table>

    <super-dialog
      width="600px" top="5%"
      title="专区编辑"
      :show="isShowDialog"
      @close="isShowDialog = false"
      @confirm="handleConfirm">
      <template slot="content">

        <el-form  :model="postForm" ref="postForm" :rules="rules" class="width420 margin-lrauto">
          <el-form-item prop="sectionName"  label="专区类别" label-width="100px">
            <el-input disabled v-model="sectionTypeSort"></el-input>
          </el-form-item>

          <el-form-item prop="sectionName"  label="专区名称" label-width="100px">
            <el-input v-model="postForm.sectionName" maxlength="6" placeholder="请输入专区名称" show-word-limit></el-input>
          </el-form-item>

          <el-form-item prop="sectionDesc"  label="专区描述" label-width="100px">
            <el-input v-model="postForm.sectionDesc" maxlength="12" placeholder="请输入专区描述" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </template>
    </super-dialog>

  </div>
</template>
<script>

import changeSort2 from '@/components/changeSort2/index'
import { getSectionList, saveSection, setSort } from '@/api/tiktok'
import superDialog from '@/views/templatePage/superDialog/index.vue'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: {
    changeSort2, superDialog
  },
  data() {
    return {
      activeIndex: '',
      tableData: [],
      listLoading: false,
      isShowDialog: false,
      sectionTypeSort: '',
      postForm: {
        id: '',
        sectionName: '',
        sectionDesc: ''
      },
      rules: {
        sectionName: [{ required: true, message: '专区名称不能为空', trigger: 'blur' }],
        sectionDesc: [{ required: true, message: '专区描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleGetsectionList()
  },
  methods: {
    handleSectionType(val) {
      const typeList = new Map([
        [1, '新课上线'],
        [2, '近期热门'],
        [3, '本周精选'],
        [4, '排行榜'],
        [5, '热门达人']
      ])

      return typeList.get(val)
    },
    handleGetsectionList() {
      getSectionList().then(res => {
        if (res.data.statusCode == 200) {
          this.tableData = res.data.data
        }
      })
    },
    handleConfirm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          saveSection(this.postForm).then(res => {
            if (res.data.statusCode == 200) {
              this.$message.info('操作成功！')

              this.handleGetsectionList()
              this.isShowDialog = false
            }
          })
        }
      })
    },
    handleEdit({ id, sectionName, sectionDesc, sectionType }) {
      this.isShowDialog = true
      this.postForm.id = id

      this.sectionTypeSort = this.handleSectionType(sectionType)
      this.postForm.sectionType = sectionType
      this.postForm.sectionName = sectionName
      this.postForm.sectionDesc = sectionDesc
    },
    handleCheckContent({ id, sectionType }) {
      this.$router.push({ name: 'toSectionContent', params: { sectionId: id, sectionType }})
    },
    async moveSort(data, sortNumber, total, whichOne) {
      const { row: { id }, value: sort } = data

      if (!RegExp(/_right_/).test(whichOne)) {
        if (sort > total) {
          this.$nextTick(() => {
            this.$refs[whichOne].editSort()
          })
          return this.$message.error('排序值不能超过最大值')
        }

        if (sort == sortNumber) {
          this.$nextTick(() => {
            this.$refs[whichOne].editSort()
          })
          return this.$message.error('您未更改排序数字')
        }
        this.listLoading = true
        const res = await setSort({
          sortType: 1,
          id,
          sort: sort
        }).catch(() => false)

        this.listLoading = false
        if (!res) return

        this.$message.success('修改成功')
        this.handleGetsectionList()
      }
    }
  }
}
</script>
