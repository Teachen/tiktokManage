<template>
    <super-dialog
      title="选择达人"
      width="780px" top="3%"
      class="no-padding"
      :show="isShowTalentList"
      :closeOnClickModel="false"
      @confirm="handleConfirm"
      @close="handleClose"
    >

    <template slot="content">
    <div class="c-flex-row c-justify-end c-mv15">
        <el-input v-model="listQuery.talentName" class="width216 padding-r6" clearable placeholder="搜索达人名称"></el-input>
        <el-button type="primary" @click="handleSearch" class="search">搜索</el-button>
    </div>

    <div class="height400 c-scroll">
      <el-table
          ref="multipleTable"
          @select="handelSelect"
          @selection-change="handelSelectionChange"
          :data="tableData" :class="tableCss"
          fit highlight-current-row
          :row-key="getRowKey"
          :header-cell-style="tableHeadStyle">

        <el-table-column  type="selection" width="55" :reserve-selection="true" :selectable="checkSelectable"
        ></el-table-column>

        <el-table-column  label="达人名称" align="center" prop="talentName">
        </el-table-column>

        <el-table-column  label="类型" align="center" prop="talentTypeName">
        </el-table-column>

        <el-table-column  label="课程数" sortable align="center" prop="prodCount">
        </el-table-column>

        <el-table-column  label="销量" sortable align="center" prop="salesNum">
        </el-table-column>

        <el-table-column width="220" label="入驻时间" align="center" prop="createTime">
        </el-table-column>
      </el-table>

    </div>

    <el-pagination
        v-if="tableData.length>0"
        class="block c-textAlign-c"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="listQuery.total">
    </el-pagination>
    </template>
    </super-dialog>
</template>
<script>
import { searchTalentList } from '@/api/tiktok'
import superDialog from '@/views/templatePage/superDialog/index.vue'

export default {
  inject: ['tableHeadStyle', 'tableCss'],
  props: {
    isShowTalentList: Boolean,
    sectionId: Number,

    selectedList: { // 已经选择的值（为了做已经勾选的也要继续勾选）
      type: Array,
      default() {
        return []
      }
    },
    maxCount: { // 最多选择多少个
      type: Number,
      default: 6
    }
  },
  components: { superDialog },
  data() {
    return {
      listQuery: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        talentSearchType: 1
      },
      tableData: [],
      removeSelectIds: [], // 已移除ID
      multipleSelectedId: [], // // 当前页已勾选ID
      allSelectedId: [] // // 所有页已勾选ID
    }
  },
  created() {
    this.handleSearchTalentList()
    if (this.selectedList.length > 0) {
      this.multipleSelectedId.length = 0
      this.selectedList.forEach(el => {
        this.multipleSelectedId.push(el.contentId)
        this.allSelectedId.push(el.contentId)
      })
    }
    console.log(this.multipleSelectedId, 'multipleselectedId 处理已勾选的')
  },
  computed: {

  },
  methods: {
    handleSearchTalentList() {
      searchTalentList(this.listQuery).then(res => {
        this.listQuery.total = res.data.data.total

        if (res.data.statusCode == 200) {
          this.tableData = res.data.data.records
          // 处理已勾选的内容
          const selectCurList = this.tableData.filter(el => el.select)
          selectCurList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      })
    },
    checkSelectable(row, index) {
      return true
    },
    // 记住勾选
    getRowKey(row) {
      return row.id
    },
    handleSearch() {
      this.listQuery.pageNo = 1
      this.handleSearchTalentList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.handleSearchTalentList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.handleSearchTalentList()
    },
    // 所有已勾选
    handelSelectionChange(val) {
      console.log(val, 'val')

      setTimeout(() => {
        if (this.selectedList.length == 0 && this.allSelectedId.length == 0) {
          this.multipleSelectedId = []
          // 全选时触发
          val.forEach(el => {
            if (this.multipleSelectedId.every(j => val.find(i => Number(i.id) != Number(j)))) {
              this.multipleSelectedId.push(el.id)
            }

            if (this.selectedList.every(item => val.find(t => Number(t.id) != Number(item.contentId)))) {
              this.allSelectedId.push(el.id)
            }
          })

          if (val.length == 0) {
            this.multipleSelectedId = []
          }

          console.log(this.multipleSelectedId, 'this.multipleSelectedId 所有已勾选')
        }
      }, 1000)
    },
    // 点击勾选时触发
    handelSelect(rows, row) {
      // debugger

      const selected = rows.length && rows.indexOf(row) != -1

      if (selected) {
        // 点击勾选
        if (this.multipleSelectedId.every(j => Number(row.id) != Number(j)) && (this.allSelectedId.length <= this.maxCount)) {
          this.multipleSelectedId.push(row.id)
        }

        if (this.allSelectedId.every(item => Number(row.id) != Number(item)) && (this.allSelectedId.length <= this.maxCount)) {
          this.allSelectedId.push(row.id)
        }
      }
      // 取消勾选
      if (!selected) {
        const delIdx = this.multipleSelectedId.findIndex((i) => Number(row.id) === Number(i))
        this.multipleSelectedId.splice(delIdx, 1)
        this.allSelectedId.splice(delIdx, 1)

        if (this.selectedList.some(el => Number(el.contentId) == Number(row.id))) {
          this.removeSelectIds.push(row.id)
        }
      }
      // 超过最大数量不让勾选

      console.log(rows, row, 'rows, row')

      console.log(this.multipleSelectedId, 'this.multipleSelectedId 点击勾选时触发')
      console.log(this.allSelectedId, 'this.allSelectedId 点击勾选时触发')

      console.log(this.removeSelectIds, 'removeSelectIds 点击勾选时触发')

      if (this.maxCount != 0) {
        // const idx = this.allSelectedId.findIndex(el => rows.every(j => Number(j.contentId) != Number(el.id)))
        if (this.allSelectedId.length > this.maxCount) {
          this.multipleSelectedId.pop()
          this.$refs.multipleTable.toggleRowSelection(row, false)

          this.allSelectedId.pop()
          this.$message.warning(`最多选择${this.maxCount}个`)
          return
        }
      }
    },
    handleConfirm() {
      if (this.allSelectedId.length == 0) {
        return this.$message.warning('请选择商品！')
      }

      // if (this.maxCount != 0) {
      //   if (this.allSelectedId.length > this.maxCount) {
      //     return this.$message.warning('最多选择' + this.maxCount + '个')
      //   }
      // }

      console.log(this.multipleSelectedId, 'this.multipleSelectedId')

      console.log(this.removeSelectIds, 'removeSelectIds')
      this.$emit('handleConfirm', this.multipleSelectedId, this.removeSelectIds)
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:isShowTalentList', false)
    }
  }
}
</script>
