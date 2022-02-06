<template>
  <div class="app-container">
    <div class="margin-b20 c-flex-row c-justify-sb">
      <p>
          <el-button type="primary" v-if="!isSectionList" @click="handlelBatchMigrate" plain size="medium">批量迁移</el-button>
          <el-button type="primary" v-if="isSectionList && (sectionType == 3)"  plain size="medium"
          @click="handleAddSelection">添加精选内容</el-button>
          <el-button type="primary" v-if="isSectionList && (sectionType == 5)" plain size="medium"
          @click="handleAddTalent">添加达人
          </el-button>

          <el-button type="primary" @click="handlelBatchDelete" plain size="medium">{{!isSectionList ? '批量删除' : '批量移除'}}</el-button>
      </p>

      <div class="margin-r10">

        <el-input v-if="isSectionList && (sectionType != 5)" v-model="sectionQuery.prodName" class="width200 padding-r6" clearable placeholder="输入内容方和内容名称"></el-input>
        <el-input v-if="!isSectionList" v-model="listQuery.name" class="width216 padding-r6" clearable placeholder="输入内容名称和达人名称"></el-input>
        <el-button v-if="sectionType != 5" type="primary" @click="handleFilter" class="search">搜索</el-button>
      </div>
    </div>

    <el-table
        @selection-change="handleSelectionChange"
        :data="tableData" :class="tableCss"
        fit highlight-current-row
        :header-cell-style="tableHeadStyle"
        v-loading="listLoading">
      <el-table-column  type="selection" width="55"></el-table-column>

      <el-table-column label="内容名称" v-if="!isSectionList || (isSectionList && sectionType != 5)" align="left" :key="(isSectionList || sectionType) + 'name'" width="300px">
        <template slot-scope="scope">
          <div class="clearfix c-textAlign-l">
            <el-image v-if="!isSectionList" class="fl margin-r10" :src="scope.row.cover" :width='102' :height='68'></el-image>
            <div class="fl" :class="!isSectionList ? 'c-width50': 'c-width100'">
               <p>{{scope.row.name || scope.row.prodName}}</p>
               <p v-if="!isSectionList" class="margin-t">￥{{scope.row.price}}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-if="isSectionList && ((sectionType == 3) || (sectionType == 4) || (sectionType == 1) || (sectionType == 2))"
       :key="(isSectionList && sectionType) + 'upTime'"
        label="上架时间" align="center">
        <template slot-scope="scope">{{scope.row.upTime}}</template>
      </el-table-column>


      <el-table-column  v-if="!isSectionList" label="一级名称" :key="!isSectionList + 'level1'" align="center">
        <template slot-scope="scope">{{scope.row.level1Name}}</template>
      </el-table-column>

      <el-table-column  v-if="!isSectionList" label="二级名称" :key="!isSectionList + 'level2'" align="center">
        <template slot-scope="scope">{{scope.row.level2Name}}</template>
      </el-table-column>

      <el-table-column  v-if="!isSectionList" label="状态" :key="!isSectionList + 'status'" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.status | statusFilter}}</div>
        </template>
      </el-table-column>

      <el-table-column  v-if="!isSectionList" label="排序" :key="!isSectionList + 'sort'" align="center">
        <template slot-scope="scope">

          <span v-show="!scope.row.isEdit" class="tdedit" @click="editSort(scope.$index)">{{scope.row.sort}}</span>

          <input @blur="handleSaveSort(scope.row.id,scope.row.sort)"
                v-focus="scope.row.isEdit"
                v-show="scope.row.isEdit"
                class="editInput" min=0 type="number" name="" id=""
                  v-model.number="scope.row.sort"/>
        </template>
      </el-table-column>

      <el-table-column v-if="isSectionList && sectionType == 5" label="达人名称" :key="(isSectionList && sectionType) + 'talentName'" align="center">
        <template slot-scope="scope">{{scope.row.talentName}}</template>
      </el-table-column>

      <el-table-column v-if="!isSectionList" label="达人名称" :key="!isSectionList + 'talentName1'" align="center">
        <template slot-scope="scope">{{scope.row.talentName}}</template>
      </el-table-column>

      <el-table-column v-if="isSectionList && sectionType == 5" label="入驻时间" :key="(isSectionList && sectionType) + 'upTime1'" align="center">
        <template slot-scope="scope">{{scope.row.upTime}}</template>
      </el-table-column>

      <el-table-column  v-if="isSectionList && sectionType == 5" label="课程数" :key="(isSectionList && sectionType) + 'prodCount'" align="center">
        <template slot-scope="scope">{{scope.row.prodCount}}</template>
      </el-table-column>

      <el-table-column  v-if="isSectionList && sectionType == 5" label="分类" :key="(isSectionList && sectionType) + 'talentType'" align="center">
        <template slot-scope="scope">{{scope.row.talentType}}</template>
      </el-table-column>

      <el-table-column v-if="isSectionList && (sectionType == 5 || sectionType == 4 || sectionType == 3|| sectionType == 2)" label="销量" :key="(isSectionList && sectionType) + 'salesNum'" align="center">
        <template slot-scope="scope">{{scope.row.salesNum}}</template>
      </el-table-column>

      <el-table-column v-if="isSectionList && sectionType != 5" label="类型" :key="(isSectionList && sectionType) + 'prodType'" align="center">
        <template slot-scope="scope">
          {{globalProdType[scope.row.prodType] || '--'}}
        </template>
      </el-table-column>

      <el-table-column v-if="isSectionList && sectionType != 5" label="内容方" :key="(isSectionList && sectionType) + 'companyName'" align="center">
        <template slot-scope="scope">{{scope.row.companyName}}</template>
      </el-table-column>


      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <b class="v-line" v-if="!isSectionList" @click="handleMigration(scope.row.prodId)">迁移</b>
          <b class="v-line" @click="handleDelete(scope.row)">{{!isSectionList ? '删除': '移除'}}</b>
          <b class="v-line" v-if="isSectionList" @click="handlePick(scope.row)">
            {{scope.row.isHot == 1 ? '取消精选': '设为精选'}}
          </b>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-if="tableData.length>0"
        class="block c-textAlign-c"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo || sectionQuery.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.pageSize || sectionQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <super-dialog
      title="迁移"
      width="400px" top="3%"
      :show="showMigrate"
      @confirm="handleConfirm"
      @close="showMigrate = false"
      :loading="dialogLoading"
    >
      <template slot="content">
        <el-form class="margin-l20">
          <el-form-item label="移动到一级分类">
            <el-select @change="handleCategoryChange" v-model="postForm.level1CategoryId" placeholder="请选择一级分类">
              <el-option
               v-for="item in firstCategoryList"
               :key="item.id"
               :label="item.name + `${item.dyCategoryName ? '-' + item.dyCategoryName : ''}`"
               :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移动到二级分类">
            <el-select v-model="postForm.level2CategoryId" placeholder="请选择二级分类">
              <el-option
               v-for="item in secondCategoryList"
               :key="item.id"
               :label="item.name + `${item.dyCategoryName ? '-' + item.dyCategoryName : ''}`"
               :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </template>
    </super-dialog>

    <!-- 添加精选达人 -->
    <talent-list
      v-if="isShowTalentList"
      :sectionId="$route.params.sectionId"
      :maxCount="10"
      :selectedList="this.tableData"
      :isShowTalentList.sync="isShowTalentList"
      @handleConfirm="handleTalentSelected"
    ></talent-list>

    <!-- 添加本周精选 -->
    <bring-goods2
      v-if="goodParams.showSelectGoods"
      from="zoneSet"
      title="选择商品"
      :maxCount="goodParams.maxCount"
      :appendToBody="true"
      :multiple="goodParams.multiple"
      :goodsArr="goodParams.goodsArr"
      :selectedList="goodParams.selectedList"
      :showSelectGoods="goodParams.showSelectGoods"
      @closeAddGoods="goodParams.showSelectGoods = false"
      :callBack="goodParams.bringCallBack"
    ></bring-goods2>
  </div>
</template>
<script>

import talentList from './talentList.vue'
import bringGoods2 from '@/views/templatePage/bringGoods2/index.vue'
import superDialog from '@/views/templatePage/superDialog/index.vue'
import {
  delProdCategoryRelateBatch,
  getProdCategoryRelateList,
  deleteSectionContentBatch,
  updateProdCategoryBatch,
  getSectionContentList,
  delProdCategoryRelate,
  setSectionContentHot,
  deleteSectionContent,
  modifySectionContent,
  getAllCategoryList,
  updateProdCategory,
  saveRelateSort
} from '@/api/tiktok'

export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: { superDialog, talentList, bringGoods2 },
  data() {
    return {
      postForm: {
        prodId: null,
        level1CategoryId: '',
        level2CategoryId: ''
      },
      listQuery: { // 分类管理查看内容
        categoryId: null,
        pageNo: 1,
        name: '',
        pageSize: 10
      },
      sectionQuery: { // 专区设置查看内容
        sectionId: '',
        pageNo: 1,
        pageSize: 10,
        prodName: ''
      },
      goodParams: {
        showSelectGoods: false,
        multiple: true,
        maxCount: null,
        params: {},
        tabsArr: [],
        selectedList: [],
        bringCallBack: function() {}
      },
      total: 0,
      sectionType: 1,
      multipleSelectId: [],
      firstCategoryList: [],
      secondCategoryList: [],
      isSectionList: false, // 是否是专区内容列表, 否分类内容列表
      isShowTalentList: false,
      dialogLoading: false,
      showMigrate: false,
      listLoading: false,
      routeFrom: '',
      globalProdType: global.ckFromType,
      tableData: [],
      TIMETRAP: ''
    }
  },
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  watch: {
    '$route.params.sectionId'(val) {
      if (val) {
        this.handelGetSectionContentList(val)
      }
    },
    '$route.params.categoryId'(val) {
      if (val) {
        this.listQuery.categoryId = val
        this.handleGetAllCategoryList(0)
        this.initData()
      }
    },
    '$route.params.sectionType'(val) {
      if (val) {
        console.log(val, '$route.params.setcionType')
        this.sectionType = val
        this.handleCheckRoute(this)
      }
    }
  },
  filters: {
    statusFilter(val) {
      const status = new Map([
        [0, '下架'],
        [1, '上架'],
        [2, '审核中'],
        [3, '审核不通过']
      ])

      return status.get(val)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.routeFrom = to.name
      vm.sectionType = to.params.sectionType
      vm.handleCheckRoute(vm)
    })
  },
  methods: {
    handleCheckRoute(that) {
      // 分类内容

      if (that.routeFrom == 'toCheckContent') {
        that.isSectionList = false

        that.listQuery.categoryId = that.$route.params.categoryId
        that.handleGetAllCategoryList(0)
        that.initData()
      }

      // 专区内容
      if (that.routeFrom == 'toSectionContent') {
        that.isSectionList = true

        that.sectionType = that.$route.params.sectionType
        that.handelGetSectionContentList(that.$route.params.sectionId)
      }
    },
    handleAddTalent() {
      if (this.tableData.length >= 10) {
        return this.$message.warning('最多添加10个达人')
      }
      this.isShowTalentList = true
    },
    handleMigration(prodId) {
      this.showMigrate = true
      this.postForm.prodId = prodId
      this.postForm.level1CategoryId = null
      this.postForm.level2CategoryId = null
    },
    handleCurrentChange(val) {
      if (!this.isSectionList) {
        this.listQuery.pageNo = val
        this.initData()
      } else {
        this.sectionQuery.pageNo = val
        this.handelGetSectionContentList(this.$route.params.sectionId)
      }
    },
    handleSizeChange(val) {
      if (!this.isSectionList) {
        this.listQuery.pageSize = val
        this.initData()
      } else {
        this.sectionQuery.pageSize = val

        this.handelGetSectionContentList(this.$route.params.sectionId)
      }
    },

    handleGetAllCategoryList(id) {
      this.listLoading = true
      getAllCategoryList(id).then(res => {
        this.listLoading = false
        if (res.data.statusCode == 200) {
          const resData = res.data.data
          if (id === 0) {
            this.firstCategoryList = resData
          } else {
            this.secondCategoryList = resData
          }
        }
      })
    },
    handleCategoryChange(firstId) {
      this.postForm.level2CategoryId = ''
      this.handleGetAllCategoryList(firstId)
    },
    handelGetSectionContentList(id) { // 专区设置内容列表
      this.sectionQuery.sectionId = id
      this.listLoading = true
      getSectionContentList(this.sectionQuery).then(res => {
        this.listLoading = false

        if (res.data.statusCode == 200) {
          const { total, records } = res.data.data
          this.tableData = records
          this.total = total
        }
      })
    },
    initData() { // 获取分类列表
      getProdCategoryRelateList(this.listQuery).then(res => {
        if (res.data.statusCode == 200) {
          const { records, total } = res.data.data
          this.tableData = records
          this.total = total
          this.multipleSelectId = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleDelete({ id = null, prodId = null }) {
      this.$confirm(`确定${!this.isSectionList ? '删除' : '移除'}该内容？${!this.isSectionList ? '删除后，移动端找不到该内容，视频挂载处也没有该内容，购买过的用户无法查看' : ''}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.isSectionList) {
          delProdCategoryRelate(prodId).then(res => {
            if (res.data.statusCode == 200) {
              this.$message.info('删除成功！')
              this.showMigrate = false
              this.initData()
            }
          })
        } else {
          deleteSectionContent(id).then(res => {
            if (res.data.statusCode == 200) {
              this.$message.info('删除成功！')
              this.handelGetSectionContentList(this.$route.params.sectionId)
            }
          })
        }
      }

      ).catch(_ => {
        this.$message.info('取消删除')
      })
    },
    handleSaveSort(id, sort) {
      if (sort >= 9999999) {
        sort = 9999999
      }
      if (sort >= 0) {
        saveRelateSort({ sort, id }).then(res => {
          this.$message.info('保存成功')
          this.initData()
        })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message.error('排序值不能为负数')
        return
      }
    },
    editSort(index) {
      this.tableData[index].isEdit = true
      this.$set(this.tableData, index, this.tableData[index])
    },
    handleFilter() {
      if (this.isSectionList) {
        this.sectionQuery.pageNo = 1
        this.handelGetSectionContentList(this.$route.params.sectionId)
      } else {
        this.listQuery.pageNo = 1
        this.initData()
      }
    },
    handleConfirm() {
      if (!this.postForm.level1CategoryId) {
        return this.$message.warning('请选择迁移分类！')
      }

      if (this.postForm.prodId) {
      // 迁移单个分类
        updateProdCategory(this.postForm).then(res => {
          if (res.data.statusCode == 200) {
            this.initData()
            this.$message.info('迁移成功！')
          }
        })
      }

      // 批量迁移分类
      if (
        this.multipleSelectId.length > 0 &&
        (this.postForm.level1CategoryId ||
        this.postForm.level2CategoryId)
      ) {
        updateProdCategoryBatch({
          level1CategoryId: this.postForm.level1CategoryId,
          level2CategoryId: this.postForm.level2CategoryId,
          prodIdList: this.multipleSelectId
        }).then(res => {
          if (res.data.statusCode == 200) {
            this.$message.success('批量迁移成功！')
            this.initData()
          }
        })
      }
      this.showMigrate = false
    },
    handleTalentSelected(multipleSelectedId, removeSelectedId) {
      this.handleModifySecion(multipleSelectedId, removeSelectedId)
      this.handelGetSectionContentList(this.$route.params.sectionId)
    },
    handleSelectionChange(val) {
      this.multipleSelectId = []
      if (val) {
        val.map(el => this.multipleSelectId.push(el.prodId || el.id))
      }
    },
    handlelBatchMigrate() {
      if (this.multipleSelectId.length == 0) {
        return this.$message.warning('请选择要迁移的内容！')
      }
      this.showMigrate = true
    },
    handleModifySecion(multipleSelectedId, removeSelectedId = []) {
      modifySectionContent({
        sectionId: this.$route.params.sectionId,
        addContentList: multipleSelectedId,
        removeContentList: removeSelectedId
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.handelGetSectionContentList(this.$route.params.sectionId)
          this.$message.success('操作成功！')
        }
      })
    },
    handlelBatchDelete() {
      if (this.multipleSelectId.length == 0) {
        return this.$message.warning(`请选择要${!this.isSectionList ? '删除' : '移除'}内容！`)
      }

      this.$confirm(`确定${!this.isSectionList ? '删除' : '移除'}该内容？${!this.isSectionList ? '删除后，移动端找不到该内容，视频挂载处也没有该内容，购买过的用户无法查看' : ''}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelectId.length > 0 && !this.isSectionList) {
          delProdCategoryRelateBatch({
            prodIdList: this.multipleSelectId
          }).then(res => {
            if (res.data.statusCode == 200) {
              this.$message.success('批量删除成功！')
              this.initData()
            }
          })
        } else if (this.multipleSelectId.length > 0 && this.isSectionList) {
          deleteSectionContentBatch({
            contentIdList: this.multipleSelectId
          }).then(res => {
            if (res.data.statusCode == 200) {
              this.$message.success('批量移除成功！')
              this.handelGetSectionContentList(this.$route.params.sectionId)
            }
          })
        } else {
          this.$message.warning('请选择删除内容！')
        }
      }).catch(_ => {
        this.$message.info('取消删除')
      })
    },
    handleAddSelection() {
      if (this.tableData.length >= 6) {
        return this.$message.warning('最多添加6个课程')
      }
      this.goodParams = {
        showSelectGoods: true,
        maxCount: 6,
        tabsArr: ['knowledge'],
        goodsArr: ['video', 'audio', 'articles', 'column'],
        selectedList: this.tableData,
        bringCallBack: (val0, val1) => {
          if (!val0) return
          const selectedIds = []
          const unselectIds = []
          val0.forEach(el => selectedIds.push(el.id))
          val1.forEach(ev => unselectIds.push(ev.split('_')[1]))
          this.handleModifySecion(selectedIds, unselectIds)
        }
      }
    },
    handlePick({ id, isHot }) {
      setSectionContentHot({
        id: id,
        hotType: ~~!isHot
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.handelGetSectionContentList(this.$route.params.sectionId)
        }
      })
        .catch(err => {
          console.log(err)
        })
    }

  }

}
</script>
