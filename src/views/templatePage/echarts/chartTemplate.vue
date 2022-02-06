<!--
@author 范华金
@description echarts模板组件
-->
<template>
  <div>
    <div v-if="titleInfo.title||(searchInfo.searchList&&searchInfo.searchList.length!==0)"
         class="c-flex-row c-justify-sb c-aligni-center padding-b15 c-flexw-wrap">
      <!--标题内容-->
      <div v-if="titleInfo.title">
              <span v-if="titleInfo.tooltip===''||titleInfo.tooltip===undefined" class="c-fs-16 font-bold">
                <span class="sign relative left-20"></span>{{ titleInfo.title }}</span>
        <el-tooltip v-else class="item" :content="titleInfo.tooltip" placement="top-start">
        <span class="c-fs-16 font-bold"><span class="sign relative left-20"></span>{{ titleInfo.title }}<svg-icon
          icon-class="icon_tips"
          class="margin-5 c-fc-ccc"></svg-icon></span>
        </el-tooltip>
      </div>
      <!--搜索数据-->
      <div v-if="searchInfo.searchFun && searchInfo.searchFun.length>0"
           class="c-flex-row c-aligni-center c-flexw-wrap">
        <div v-for="(item,index) in searchInfo.searchFun" :key="item.value">
          <div v-if="item.type==='button'" :class=" (searchInfo.searchFun.length-1 )===index?'':'margin-r10'">
            <el-button @click="searchHandle(item,index)" :type="searchInfo.active===index?'primary':''">
              {{ item.label }}
            </el-button>
          </div>
          <div v-if="item.type==='datePicke'" :class=" (searchInfo.searchFun.length-1 )===index?'':'margin-r10'" class="width350">
            <el-date-picker
              class="fr"
              v-model="item[item.value]"
              :clearable="false"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTimeRange($event,item,index)"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>
    </div>
    <div class="relative margin-t10" >
      <div v-if="titleInfo.legendTips" class="c-width100 c-flex-row c-aligni-center c-justify-end c-flexw-wrap absolute zIndex10 c-pa-t17">
        <el-tooltip  class="item" :content="titleInfo.legendTips" placement="top-start">
          <svg-icon icon-class="icon_tips" class="margin-5 c-fc-ccc"></svg-icon>
        </el-tooltip>
      </div>
        <div v-if="timeActive" class="c-width100 c-flex-row c-aligni-center c-justify-end c-flexw-wrap absolute zIndex10 c-pa-t-10">
          <el-radio-group v-model="timeNumber" @change="searchTimeHandle">
            <el-radio :label="0"> 近7天</el-radio>
            <el-radio :label="1">近14天</el-radio>
          </el-radio-group>
        </div>
      <div v-show="hasData">
        <div v-if="titleInfo.titleTips" class="c-width100 absolute c-fs-14 padding-t21  c-flex-row c-aligni-center">
          <div class="margin-l150 margin-r200">
            {{ titleInfo.titleTips }}
          </div>
          <div>
            {{ titleInfo.time }}
          </div>
        </div>
        <div ref="chartBox" :style="{'height': chartHeight+'px'}" class="c-width100"></div>
      </div>
      <div v-show="!hasData"  :style="{'height': chartHeight+'px'}" class="c-width100 c-flex-row c-justify-center c-aligni-center">
        <img src="@/assets/noData.png" class="width160" >
      </div>
      <div class="c-width100 margin-t20" v-if="searchInfo.searchType && searchInfo.searchType.length>0">
        <el-tabs type="card" v-model="searchInfo.active" :class="{ more: searchInfo.searchType.length > 5 }" @tab-click="changeTabs">
          <el-tab-pane v-for="(item, index) in searchInfo.searchType" :key="index" :label="item.label" :name="item.value"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import echart from 'echarts'
import { debounce, getAssignDays } from '@/utils'

export default {
  name: 'barChart',
  props: {
    /* 标题参数*/
    titleInfo: {
      type: Object,
      default() {
        return {
          title: '', // 左上角标题
          tooltip: '', // 左上角标题Tips
          titleTips: '', // 图表标题Tips
          time: '', // 图表标题时间
          legendTips: '' // 图例Tisp
        }
      }
    },
    /* 操作按钮 和搜索条件*/
    searchInfo: {
      type: Object,
      default() {
        return {
          active: 1, // 当前选择项
          searchType: [], // 搜索类型
          searchFun: [] // 搜索方法
        }
      }
    },
    /* 图表的数据、基本设置*/
    chartData: {
      type: Object,
      require: true
    },
    /* 图表大小 是否随着屏幕变化而变化*/
    chartResize: {
      type: Boolean,
      default: true
    },
    /* 图表高度*/
    chartHeight: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      chart: null, // echart 实例
      hasData: true, // 是否存在数据
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // }
      }, // 时间函数
      timeActive: false, // 判断是否为近期直播
      timeNumber: 0 // 判断近期直播选中参数
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    if (this.chartResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  beforeDestroy() {
    if (!this.chart) return
    if (this.chartResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    /* 监听数据是否改变*/
    chartData: {
      deep: true,
      handler(val) {
        this.setOptionData(val)
      }
    }
  },
  methods: {
    /* 获取搜索改变的值*/
    changeTabs() {
      let param = {}
      this.searchInfo.searchType.forEach(item => {
        if (item.value === this.searchInfo.active) {
          param = item
        }
      })
      if (param.label === '近期的直播') {
        this.timeActive = true
        this.timeNumber = 0
      } else {
        this.timeActive = false
      }
      this.searchInfo.searchFun.forEach((item, index) => {
        if (item.value === 'time') {
          if (param.label === '近期的直播') {
            item.time = [getAssignDays(0), getAssignDays(7)]
          } else {
            item.time = [getAssignDays(-7), getAssignDays(0)]
          }
        }
      })
      /* 提交操作参数*/
      this.$emit('searchHandle', this.searchInfo)
    },
    /* 近期直播时间操作*/
    searchTimeHandle(row) {
      this.timeNumber = row
      let arr = []
      if (row === 0) {
        arr = [getAssignDays(0), getAssignDays(7)]
      } else {
        arr = [getAssignDays(0), getAssignDays(14)]
      }
      this.searchInfo.searchFun.forEach((item, index) => {
        if (item.value === 'time') {
          item.time = arr
        }
      })
      this.$emit('searchHandle', this.searchInfo)
    },

    /* 修改datePicke数据*/
    changeTimeRange(row, item, index) {
      item.data = row
      this.searchInfo.searchFun.splice(index, 1, item)
      this.timeNumber = ''
      /* 提交操作参数*/
      this.$emit('searchHandle', this.searchInfo, item, index)
    },
    /* 搜索操作*/
    searchHandle(row, index) {
      console.log(row)
    },
    // 初始化 echart方法
    initChart() {
      this.chart = echart.init(this.$refs.chartBox)
      this.setOptionData(this.chartData)
    },
    // 设置表格数据
    setOptionData(chartData = {}) {
      const that = this
      if (chartData.series) {
        that.hasData = true
        let option = chartData
        this.chart.setOption(option, true)
        /* 获取点击参数*/
        this.chart.on('click', function(params) {
          that.$emit('openTableHandle', params)
        })
        option = null
      } else {
        that.hasData = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs--card>.el-tabs__header {
  border-bottom: 0
}
/deep/ .el-tabs__nav {
  display: flex;
  width: 100%;
}
/deep/ .el-tabs__nav .el-tabs__item {
  flex: 1;
  text-align: center;
  border-bottom: 1px solid #E4E7ED;
  &.is-active {
    border-bottom: 3px solid #1989FA;
  }
}
.more /deep/  .el-tabs__nav {
  width: inherit;
  /*display: flex;*/
  .el-tabs__item {
  }
}
</style>
