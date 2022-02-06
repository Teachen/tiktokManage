<template>
  <super-dialog
    width="880px" top="5%"
    class="no-padding"
    title="选择跳转内容"
    textAlign="center"
    :show="slideShow"
    @close="handleClose"
    @confirm="handleConfirm">

    <template slot="content">
        <div v-loading="formLoading">
          <div class="c-pv10 clearfix slideLink">

            <el-input v-model="listQuery.name" @keyup.enter.native="searchByName" class="width300" clearable placeholder="输入名称"></el-input>
            <el-button type="success" class="search margin-l10" @click="searchByName">搜索</el-button>

            <div>
              <el-tabs v-model="manuactive" @tab-click="handleManuacitve">
                <el-tab-pane label="其他页面" name="other"></el-tab-pane>
                <el-tab-pane label="知识产品" name="konwledge"></el-tab-pane>
              </el-tabs>

              <div class="c-bd1-eee">
                <div class="c-ph20 padding-b20 c-min-height200">
                  <template v-if="manuactive == 'other'">
                    <el-radio-group v-if="otherPage.length>0" v-model="radio">
                      <el-radio class="padding-t20 c-db"
                        v-for="(item, index) in otherPage" :key="index" :label="item.value"> {{item.text}} </el-radio>

                    </el-radio-group>

                    <p v-else class="c-fs-14 c-fc-sgray margin-t c-textAlign-c">
                      暂无数据
                    </p>
                  </template>
                  <template v-if="manuactive == 'konwledge'">
                    <el-tabs v-model="listQuery.prodType" @tab-click="getProdType">
                      <el-tab-pane label="视频" name="110"></el-tab-pane>
                      <el-tab-pane label="音频" name="111"></el-tab-pane>
                      <el-tab-pane label="图文" name="112"></el-tab-pane>
                      <el-tab-pane label="专栏" name="9"></el-tab-pane>
                    </el-tabs>

                    <el-radio-group v-if="dataList.length > 0" class="c-width100 height240 overflow-y-auto" v-model="radio">

                      <el-radio  class="hover-f5 padding-l8 margin-b10 percent100-checkbox c-flex-row c-aligni-center"
                      :label="item.id"  v-for="item in dataList" :key="item.id">

                        <div class=" c-flex-row c-aligni-center c-pv10">
                          <el-image class="height80 goods-img" :src="item.cover" :width='106.67' :height='80'></el-image>
                          <div class="c-flex-column c-justify-sb height80 padding-l10 c-pv10">
                            <p>{{item.name}}</p>
                            <p class="margin-t">{{item.price ? '￥' + item.price : '免费'}}</p>
                          </div>
                        </div>
                      </el-radio>
                    </el-radio-group>
                    <p v-else class="c-fs-14 c-fc-sgray margin-t c-textAlign-c">
                      暂无数据
                    </p>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <el-pagination
              class="block c-textAlign-c"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>

        </div>
    </template>
  </super-dialog>
</template>
<script>

import superDialog from '@/views/templatePage/superDialog/index.vue'
import { adminProdList, getLinkDictList } from '@/api/tiktok'

export default {
  components: { superDialog },
  props: {
    slideShow: Boolean
  },
  data() {
    return {
      formLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        prodType: '110',
        name: '',
        link: ''
      },
      total: 0,
      dataList: [],
      otherPage: [], // 其他页面
      manuactive: 'other',
      radio: ''
    }
  },
  created() {
    this.initData()
  },
  methods: {
    handleConfirm() {
      console.log(this.radio, 'radio')
      let type = this.manuactive == 'other' ? 1 : this.listQuery.prodType
      if (!this.radio) {
        return this.$message.warning('请选择轮播图链接地址！')
      }
      let data = {}
      if (type == 1) { // 其他页面的
        const fondObj = this.otherPage.find(i => i.value == this.radio)
        data = fondObj || {}
        type = fondObj ? fondObj.type : 1
      } else { // 产品页面
        data = this.dataList.find(i => i.id == this.radio) || {}
      }
      this.$emit('close')
      this.$emit('confirm',
        this.radio,
        type,
        data
      )
    },
    handleClose() {
      this.$emit('close')
    },
    getofficialLink() {
      // https://www.ckjr001.com/

      getLinkDictList({
        name: this.listQuery.name,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }).then(res => {
        this.total = res.data.data.total
        if (res.data.statusCode == 200) {
          this.otherPage = res.data.data.records
        }
      })
    },
    searchByName() {
      this.initData()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAdminProdList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getAdminProdList()
    },
    getAdminProdList() {
      const data = Object.assign({}, this.listQuery, { prodType: ~~this.listQuery.prodType })

      adminProdList(data).then(res => {
        if (res.data.statusCode == 200) {
          const { records, total } = res.data.data
          this.total = total
          this.dataList = records
        }
      })
    },
    getProdType(val) {
      this.getAdminProdList()
    },
    handleManuacitve(val) {
      this.listQuery.name = ''
      this.initData()
    },
    initData() {
      this.listQuery.pageNo = 1

      if (this.manuactive == 'konwledge') {
        this.getAdminProdList()
      } else {
        this.getofficialLink()
      }
    }
  }
}
</script>
<style lang="scss">
.percent100-checkbox {
  .el-checkbox__label{
    width: 100% !important;
  }
  .el-radio__label{
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped>

  .goods-img {
    width: 106.67px;
    min-width: 106.67px;
  }

  .hover-f5:hover {
    background-color: #eef1f5;
  }
</style>
