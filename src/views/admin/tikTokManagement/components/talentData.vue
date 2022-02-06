<template>
  <div>
    <div class="margin-t15 bg-fff padding-15 clearfix">
      <div class="c-flex-row c-justify-sb c-alignc-center margin-b20">
        <span class="c-fs-16 c-fc-333 font-bold padding-r10">重点合作达人</span>
        <div>
          <span class="c-fc-xgray c-fs-12 padding-r10">统计日期：2020/09/25 - 2020/12/25</span>
          <el-radio-group v-model="tabPosition" size="mini">
            <el-radio-button label="top">7天</el-radio-button>
            <el-radio-button label="bottom">30天</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="relative fl" style="width: 49.5%;">
        <p class="c-fc-333 relative table-top c-fs-12">成交TOP50达人</p>
        <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
        >
          <el-table-column align="center" label="达人信息"></el-table-column>
          <el-table-column align="center" label="抖音号"></el-table-column>
          <el-table-column align="center" label="成交金额"></el-table-column>
          <el-table-column align="center" label="成交订单数"></el-table-column>
          <el-table-column align="center" label="直播场次"></el-table-column>
        </el-table>

        <el-pagination
            class="block c-textAlign-c"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listQuery.total">
        </el-pagination>
      </div>

      <div class="relative fr" style="width: 49.5%;">
        <p class="c-fc-333 relative table-top c-fs-12">成交TOP50达人</p>
        <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
        >
          <el-table-column align="center" label="达人信息"></el-table-column>
          <el-table-column align="center" label="抖音号"></el-table-column>
          <el-table-column align="center" label="访问数"></el-table-column>
          <el-table-column align="center" label="成交订单数"></el-table-column>
          <el-table-column align="center" label="转化率"></el-table-column>
        </el-table>

            <!-- @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.pageNo" -->
        <el-pagination
            class="block c-textAlign-c"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listQuery.total">
        </el-pagination>
      </div>
    </div>

    <div class="margin-t15 bg-fff padding-15 clearfix">
      <div class="c-flex-row c-justify-sb c-alignc-center margin-b20">
        <span class="c-fs-16 c-fc-333 font-bold padding-r10">全部合作达人</span>
        <div>
          <span class="c-fc-xgray c-fs-12 padding-r10">统计日期：2020/09/25 - 2020/12/25</span>
          <el-radio-group v-model="tabPosition" size="mini">
            <el-radio-button label="top">7天</el-radio-button>
            <el-radio-button label="bottom">30天</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="relative">
        <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
        >
          <el-table-column align="center" label="达人信息"></el-table-column>
          <el-table-column align="center" sortable label="粉丝数"></el-table-column>
          <el-table-column align="center" label="上架商品数"></el-table-column>
          <el-table-column align="center" sortable label="成交金额"></el-table-column>
          <el-table-column align="center" sortable label="成交订单数"></el-table-column>
          <el-table-column align="center" sortable label="成交客单价"></el-table-column>
          <el-table-column align="center" sortable label="成交人数"></el-table-column>
        </el-table>

        <el-pagination
            class="block c-textAlign-c"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listQuery.total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  data() {
    return {
      listQuery: {
        pageSize: 10
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .table-top {
    height: 25px;
    line-height: 20px;
    border-radius: 10px 15px 0px 0px;
    padding: 4px 15px 4px 12px;
    background:  #e4eaf2;
    font-family: PingFangSC, PingFangSC-Regular;
    display:inline-block;

    &::after{
    content: '';
    position: absolute;
    bottom: 0;
    right: -15px;
    width: 0;
    height: 0;
    border-top-left-radius: 25px;
    border-bottom: 27px solid #e4eaf2;
    border-right: 25px solid transparent;
    }
  }
</style>

