<template>
  <div class="c-mh20 margin-t12">
      <div class="clearfix margin-b12">
        <el-button type="primary" class="fl" icon="el-icon-edit" @click="linkToCreate">新增分类</el-button>
        <el-button class='search fr' type="primary"  icon="el-icon-search" @click="handleFilter">搜索</el-button>

        <el-input @keyup.enter.native="handleFilter" class="width250 fr" v-model="listQuery.name" clearable
                  placeholder="请输入分类名称"></el-input>
      </div>

    <el-table
      ref="categoryTable"
      class="tableCss"
      :row-class-name="getRowClass"
      :header-row-style="tableHeadStyle"
      :data="tableData" v-loading="listLoading"
      element-loading-text="加载中..." fit highlight-current-row
      :class="tableCss">
      <el-table-column  type="expand" align="left">
        <!-- 二级分类列表 -->
        <template slot-scope="scope">
          <el-table
            ref="categoryTable2"
            :show-header="false"
            :data="scope.row.childList"
            class="tableCss level2_table"
            :row-class-name="getRowClass"
            :header-row-style="tableHeadStyle" fit highlight-current-row
            :class="tableCss">
            <!--二级  -->
            <el-table-column align="left">
                <template slot-scope="props">
                  <span class="padding-l15">{{props.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center">
                <template slot-scope="props">
                  <span class="padding-r22">{{props.row.dyCategoryName || '-'}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="内容数">
              <template slot-scope="props">
               <span>{{props.row.prodCount}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" width="120">
            </el-table-column>

            <el-table-column align="center">
            </el-table-column>
            <el-table-column v-if="sortVisible" align="right" width="100" class-name="sort_column">
              <template slot-scope="props">

              <span v-show="!props.row.isEdit" class="tdedit" @click="editSort(props.$index, scope.$index)">{{props.row.sort}}</span>

              <input @blur="handleSaveSort(props.row.id,props.row.sort)"
                    v-focus="props.row.isEdit"
                    v-show="props.row.isEdit"
                    class="editInput" min=0 type="number" name="" id=""
                     v-model.number="props.row.sort"/>
                  <!-- <change-sort2
                    class="height40 c-line-40"
                    :ref="`changeSort_level2_${scope.$index}_${props.$index+1}`"
                    :itemIndex="`changeSort_level2_${scope.$index}_${props.$index+1}`"
                    :activeIndex.sync="activeIndex"
                    :disabled="permission>=3"
                    :value="props.$index+1"
                    :row="props.row"
                    @saveSort="moveSort(
                      $event,
                      props.$index+1,
                      tableData[scope.$index].child.length,
                      `changeSort_level2_${scope.$index}_${props.$index+1}`
                    )">
                  </change-sort2> -->
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作" class-name="sort_column">
                <template slot-scope="props">

                    <b class="v-line" v-if="permission == 3" @click="linkToEdit(props.row,false, 2)">编辑</b>
                    <b class="v-line" v-if="permission == 3" @click="handleDelete(props.$index, props.row)">删除</b>
                    <b class="v-line"  @click="checkContent(props.row.id)">查看内容</b>

                </template>
              </el-table-column>
            <!--  -->
          </el-table>
        </template>
      </el-table-column>

      <!-- 一级分类列表 @click="clickTable(scope.row,1)"-->
      <el-table-column align="left" label="名称">
        <template slot-scope="scope">
          <span :class="{'pointer':scope.row.hasChild}">{{ scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="抖音分类">
        <template slot-scope="scope">
          <span :class="{'pointer':scope.row.hasChild}">{{ scope.row.dyCategoryName || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="125" label="内容数">
        <template slot-scope="scope">
          {{scope.row.prodCount}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <div class="c-flex-row c-justify-center c-aligni-center">
            <img :src="scope.row.image" width="120" height="80" class="c-db" />
          </div>
        </template>
      </el-table-column>
      <el-table-column  align="center" width="120" label="是否审核显示">
        <template slot-scope="scope">
          <el-select class="width90" v-model="scope.row.versionCheckType"
           @change="val => handleCheckTypeChange(val, scope.row.id)">
            <el-option label="是" :value="2"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </template>
      </el-table-column>

     <el-table-column v-if="sortVisible" align="center" label="序号" width="150" class-name="sort_column">
        <template slot-scope="scope">
          <!-- <change-sort2
            class="height40 c-line-40"
            :ref="`changeSort_level1_${scope.$index+1}`"
            :itemIndex="`changeSort_level1_${scope.$index+1}`"
            :activeIndex.sync="activeIndex"
            :disable="permission >= 3"
            :value="scope.$index+1"
            :row="scope.row"
            @saveSort="moveSort(
              $event,
              scope.$index+1,
              tableData.length,
              `changeSort_level1_${scope.$index+1}`
            )">
          </change-sort2> -->
          <span v-show="!scope.row.isEdit" class="tdedit" @click="editSort(scope.$index)">{{scope.row.sort}}</span>

          <input @blur="handleSaveSort(scope.row.id,scope.row.sort)"
                v-focus="scope.row.isEdit"
                v-show="scope.row.isEdit"
                class="editInput" min=0 type="number" name="" id=""
                  v-model.number="scope.row.sort"/>

        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="sort_column">
        <template slot-scope="scope">

            <b class="v-line" v-if="permission == 3" @click="linkToEdit(scope.row.id,true, 2)">新增二级分类</b>
            <b class="v-line" v-if="permission == 3" @click="linkToEdit(scope.row.id,false, 1)">编辑</b>
            <b class="v-line" v-if="permission == 3" @click="handleDelete(scope.$index, scope.row)">删除</b>
            <b class="v-line"  @click="checkContent(scope.row.id)">查看内容</b>

        </template>
      </el-table-column>
    </el-table>

    <category-detail
      v-if="dialogCategory"
      :cateData="cateData"
      :titleType="titleType"
      :dialogCategory="dialogCategory"
      @closeCat="closeCat"
    ></category-detail>

    </div>
</template>
<script>
import changeSort2 from '@/components/changeSort2/index'
import { setSort, getCategoryList, deleteCategory, saveCategorySort, setAppCheckProdRelate } from '@/api/tiktok'
import { shopManage_tiktokCategory, companyVersion } from '@/utils/permission'
import categoryDetail from '../components/categoryDetail.vue'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: {
    categoryDetail, changeSort2
  },
  data() {
    return {
      listQuery: {
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      expands: [],
      tableData: [],
      permission: 3,
      dialogCategory: false,
      companyVersion: 1,
      activeIndex: '',

      expandsData: {},
      sortVisible: true,
      listLoading: false
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
  created() {
    this.initList()
    // this.getModelPermission()
  },
  methods: {

    clickTable(row, index, e) {
      if (row.hasChild) {
        this.$refs.categoryTable.toggleRowExpansion(row)
      }
    },
    linkToCreate() {
      // if (this.validateExpireTime()) { // 验证版本到期时间，到期了不能创建
      //   return
      // }
      if (this.tableData.length >= 10) {
        return this.$message.warning('一级分类只能创建10个 !')
      }
      this.titleType = '新增一级分类'
      this.dialogCategory = true
      this.cateData = {
        catId: null,
        isEdit: false,
        isAdd: true,
        level: 1
      }
    },
    async handleCheckTypeChange(val, id) {
      const rusult = await setAppCheckProdRelate({
        relateId: id,
        relateType: 2,
        versionCheckType: val
      }).catch(() => false)

      if (!rusult) return
      this.$message.success('操作成功！')
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
          sortType: 2,
          id,
          sort: sort
        }).catch(() => false)

        this.listLoading = false
        if (!res) return

        this.$message.success('修改成功')
        this.handleGetsectionList()
      }
    },
    getModelPermission() {
      this.permission = shopManage_tiktokCategory()
      this.companyVersion = companyVersion()
    },
    getRowClass({ row, rowIndex }) {
      if (row.hasChild) { // 判断当前行是否有子数据或者根据实际情况设置
        return 'row-expand-cover'
      } else if (row.level == 2) {
        return 'row-expand-padding'
      }
    },
    handleFilter() {
      this.initList()
    },
    checkContent(id) {
      this.$router.push({ name: 'toCheckContent', params: { categoryId: id }})
    },
    closeCat(val) {
      this.dialogCategory = val

      this.initList()
    },

    handleSaveSort(id, sort) {
      if (sort >= 9999999) {
        sort = 9999999
      }
      if (sort >= 0) {
        var data = { sort: sort, id }
        saveCategorySort(data).then(res => {
          this.$message.info('保存成功')
          this.initList()
        })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message.error('排序值不能为负数')
        return
      }
    },
    handleDelete(index, { id, level, hasChild, prodCount }, FatherId) {
      if (!hasChild && prodCount === 0) {
        this.$confirm('该分类无子分类和内容，确定删除该分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteCategoryItem(id, level, index)
            this.listLoading = true
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
      }

      if (hasChild) {
        this.$confirm('该分类下有二级分类，暂不能删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }

      if (prodCount > 0) {
        this.$confirm('该分类下有内容，暂不能删除？请移除内容后再删!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
    },
    deleteCategoryItem(id, level, index) {
      deleteCategory(id).then(res => {
        this.listLoading = false
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.tableData.splice(index, 1)
        level == 1 ? this.expandsData.isdelete = true : this.expandsData.isdelete = false

        this.initList(true)
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    initList(isPosition = false) {
      this.listLoading = true
      this.activeIndex = ''
      getCategoryList(this.listQuery).then(res => {
        const resData = res.data.data

        this.tableData = resData

        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },

    editSort(index, parentIndex = null) {
      if (parentIndex !== null) {
        this.tableData[parentIndex].childList[index].isEdit = true
      } else {
        this.tableData[index].isEdit = true
        this.$set(this.tableData, index, this.tableData[index])
      }
    },
    linkToEdit(id, type, level) {
      if (type) {
        this.titleType = '新增二级分类'
      } else {
        this.titleType = '编辑分类'
      }
      this.dialogCategory = true
      this.cateData = {
        catId: id,
        isEdit: true,
        isAdd: type, // 新增分类
        level: level
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .padding-r28 {padding-right: 28px}
</style>
