<template>
  <div>
    <el-table :data="tableData"
              :header-cell-style="tableHeadStyle"
              v-loading="listLoading" element-loading-text="加载中..."
              fit highlight-current-row
              :class="tableCss">
      <el-table-column align="center" label="版本号">
        <template slot-scope="scope">
          V1.0
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新内容">
        <template slot-scope="scope">
          11月4号版本内容
        </template>
      </el-table-column>


      <el-table-column align="center" label="升级时间">
        <template slot-scope="scope">
          2021-11-4 12:00:00
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否已升级">
        <template slot-scope="scope">
          是
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {

  inject: ['tableHeadStyle', 'tableCss'],
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>
