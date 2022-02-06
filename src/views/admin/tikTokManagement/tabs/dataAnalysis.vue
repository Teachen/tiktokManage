<template>
<div>

  <!-- 实时概览 -->
  <div class="c-ph20 padding-t20 margin-t15 bg-fff">
    <div class="c-flex-row c-justify-sb c-aligni-center margin-b20">
      <div>
        <span class="c-fs-16 c-fc-333 font-bold padding-r10">实时概览</span>
        <span class="c-fs-12 c-fc-sgray">更新于{{currentTime}}（周{{weekTime}}）</span>
      </div>
    </div>

    <div class="c-flex-row c-justify-sb padding-b30">
      <div class="c-flex-grow1">
        <div class="c-flex-row c-justify-sb margin-b20 margin-r80" style="min-width: 400px;">
          <div v-for="(item, index) in piecesOneDataList" :key="index">
            <p class="c-fc-333 c-fs-14 padding-b8">{{item.txt}}</p>
            <p class="c-fc-blue">
              <span class="c-fs-20 c-fw-600">{{priceformatDecimal(item.num, index)}}</span>
              <span class="c-fc-38a3ff">{{item.num | realTimeFilter}}</span>
            </p>
          </div>
        </div>

        <el-row>
          <line-chart height="380px" :config="{ grid:{left:25,merge:true}}" :chart-data="lineChartData"/>
        </el-row>
      </div>

      <div class="width520 height436 c-justify-sb padding-t5 c-flexw-wrap c-flex-row c-alignc-sb"
        style="min-width: 520px;">
        <template v-for="(item, index) in overviewData">
          <div :key="index"
            class="width250 height130 border-radio4 c-bd1-e5 padding20 c-flex-row c-justify-sa c-aligni-center">
            <div class="c-flex-column c-justify-sb height90  c-flex-grow1">
              <p class="c-fs-32 c-line-22" :style="{color: `${item.color}`, }">
                {{priceformatDecimal(item.num, index)}}
                <span class="c-fs-20 c-fw-600 ">{{item.num | overviewNumFilter(index)}}</span>
              </p>
              <p class="c-fs-14 font-bold c-fc-sgray">{{item.txt}}
                <el-popover placement="top-start" width="200"
                trigger="hover"
                :content="item.content">
                  <i slot="reference" class="el-icon-info c-fc-ccc"></i>
                </el-popover>
              </p>

              <p class="c-fs-14 c-fc-sgray opacity7" :class="index == 5? 'height16': ''">
                <span  v-if="index != 5"> 昨日全天：{{item.num2}} {{item.num2 | overviewNumFilter(index)}}</span>
              </p>
            </div>
            <el-image :src="item.img" class="width60 c-br-50" width="60" height="60"></el-image>
          </div>
        </template>
      </div>

    </div>
  </div>

<!-- 核心指标 -->

  <div class="margin-t15 bg-fff padding20 anly-picker relative">
    <div class="c-flex-row c-justify-sb c-aligni-center margin-b20 c-fs-12">
      <span class="c-fs-16 c-fc-333 font-bold padding-r10">核心指标</span>

      <custom-picker
        @datePickerChange="handleCoreDatePickerBack"
      ></custom-picker>

    </div>

    <div class="c-flex-row c-justify-start">
      <template v-for="(item, index) in indicatorData">
        <div :key="index" class="relative indicator border-radio4 c-pv20 c-ph20 margin-r20"
          :style="{border: item.active ? `1px solid ${item.color}` : '1px solid #E4E7ED', }"
          @click="handleIndicatorChange(item, index)">
          <p class="c-fs-32 margin-b10"
          :style="{color:  `${item.color}`}">
            {{priceformatDecimal(item.num, index)}}
           <span class="c-fs-20">{{item.num | overviewNumFilter(index)}}</span>
          </p>
          <p class="c-fs-14 c-fc-sgray">{{item.txt}}
            <el-popover placement="top-start" width="200"
              trigger="hover"
              :content="item.content">
              <i slot="reference" class="el-icon-info c-fc-ccc"></i>
            </el-popover>
          </p>

          <p class="absolute c-pa-r0 c-pa-b0 c-width height0" v-show="item.active"
          :style="{borderBottom: `36px solid ${item.color}`, borderLeft: '36px solid transparent'}"></p>
          <i class="el-icon-check c-fs-16 c-fc-white absolute" style="bottom: 3px; right: 3px;"></i>
        </div>

      </template>

    </div>

    <el-row>
      <line-chart :color="['#EB3F4D', '#FF7430', '#4F8AFF']" :key="refreshKey +'-anly-'+ coreIndicatorData" :config="{grid:{left:25,merge:true}}" :chart-data="coreIndicatorData"/>
    </el-row>
  </div>

<!-- 达人看板 -->

  <div class="margin-t15 bg-fff padding20 clearfix">
    <div class="c-flex-row c-justify-sb c-alignc-center margin-b20">
      <div>
        <span class="c-fs-16 c-fc-333 font-bold padding-r10">达人看板</span>
        <!-- <span class="c-fs-14 c-fc-38a3ff">达人分析</span> -->
        <el-popover placement="top-start" width="200"
          trigger="hover"
          content="该数据为平台上线以来到昨日截止所有的数据">
          <i slot="reference" class="el-icon-info c-fc-ccc"></i>
        </el-popover>
      </div>

      <custom-picker
        :dateTypeOptions="talentTypeOptions"
        @datePickerChange="handletalentDatePickerBack"
      ></custom-picker>
    </div>

    <div class="relative fl">
      <p class="c-fc-333 relative table-top c-fs-12">成交TOP5达人</p>
      <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
      :data="talentDealData">
        <el-table-column align="center" label="达人信息" prop="talentName">
          <template slot-scope="scope">
            <div class="clearfix c-textAlign-l c-line-28">
              <el-image class="fl c-br-50 c-bd1-e5 margin-r10" :src="scope.row.headimgurl" :width='28' :height='28'></el-image>
              <p  class="fl">{{scope.row.talentName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="抖音号" prop="dyaccount"></el-table-column>
        <el-table-column align="center" label="成交金额" prop="dealAmt"></el-table-column>
        <el-table-column align="center" label="成交订单数" prop="orderNum"></el-table-column>
      </el-table>
    </div>

    <!-- <div class="relative fr" style="width: 49.5%;">
      <p class="c-fc-333 relative table-top c-fs-12">转化TOP5达人</p>
      <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
      >
        <el-table-column align="center" label="达人信息"></el-table-column>
        <el-table-column align="center" label="抖音号"></el-table-column>
        <el-table-column align="center" label="访客数"></el-table-column>
        <el-table-column align="center" label="成交订单数"></el-table-column>
        <el-table-column align="center" label="转化率"></el-table-column>
      </el-table>
    </div> -->
  </div>


  <div class="margin-t15 bg-fff padding20 clearfix">
    <div class="c-flex-row c-justify-sb c-alignc-center margin-b20">
      <div>
        <span class="c-fs-16 c-fc-333 font-bold padding-r10">商品看板</span>
        <!-- <span class="c-fs-14 c-fc-38a3ff">商品分析</span> -->
        <el-popover placement="top-start" width="200"
          trigger="hover"
          content="该数据为平台上线以来到昨日截止所有的数据">
          <i slot="reference" class="el-icon-info c-fc-ccc"></i>
        </el-popover>
      </div>

      <custom-picker
        :dateTypeOptions="talentTypeOptions"
        @datePickerChange="handleProdDatePickerBack"
      ></custom-picker>
    </div>

    <!-- <div class="relative fl" style="width: 49.5%;">
      <p class="c-fc-333 relative table-top c-fs-12">访问榜TOP5商品</p>
      <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row
      >
        <el-table-column align="center" label="成交商品"></el-table-column>
        <el-table-column align="center" label="达人信息"></el-table-column>
        <el-table-column align="center" label="访客数"></el-table-column>
        <el-table-column align="center" label="成交订单数"></el-table-column>
        <el-table-column align="center" label="转化率"></el-table-column>
      </el-table>
    </div> -->

    <div class="relative fr">
      <p class="c-fc-333 relative table-top c-fs-12">成交榜TOP5商品</p>
      <el-table :header-cell-style="tableHeadStyle" row-key="id" fit highlight-current-row :data="prodDealData"
      >
        <el-table-column width="260" align="center" label="成交商品">
          <template slot-scope="scope">
            <div class="c-flex-row c-justify-start c-aligni-center">
              <el-image class="margin-r10" :src="scope.row.cover" :width='57' :height='38'></el-image>
              <div class="c-fs-12 c-textAlign-l">
               <el-eye :value="scope.row.prodName"  class="c-fc-333"></el-eye>
               <p class="c-fc-38a3ff">￥{{scope.row.price}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="达人信息" prop="talentName"></el-table-column>
        <el-table-column align="center" label="成交金额" prop="dealAmt"></el-table-column>
        <el-table-column align="center" label="成交订单数" prop="orderNum"></el-table-column>
        <el-table-column align="center" label="成交均价" prop="averagePrice"></el-table-column>
      </el-table>
    </div>
  </div>
</div>

</template>
<script>
import { parseTime } from '@/utils/index'
import { getRealTimeView, getPlatformCore, getPlatformCoreOption, getTalentDealTop, getProdDealTop } from '@/api/tiktok'
import customPicker from '@/views/templatePage/customdatePicker/index.vue'

import lineChart from '../components/lineChart.vue'
export default {
  inject: ['tableHeadStyle', 'tableCss'],
  components: {
    lineChart, customPicker
  },
  props: {
    versionType: {
      type: String,
      default: 1
    }
  },
  data() {
    return {
      tabPosition: 'top',
      overviewData: [ // 实时概览右侧数据

        {
          num: '0', txt: '总成交金额', num2: '0', color: '#4F8AFF',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over3.png',
          content: '截止到当前时间，平台所有支付成功的金额统计（包含退款金额）；'
        },
        {
          num: '0', txt: '总抽佣金额', num2: '0', color: '#4F50F9',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over5.png',
          content: '截止到当前时间，平台获得的抽佣金额统计；'
        },
        {
          num: '0', txt: '总用户数', num2: '0', color: '#FE5E4F',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over1.png',
          content: '截止到当前时间，平台所有的用户数量；'
        },
        {
          num: '0', txt: '总付费用户数', num2: '0', color: '#5E25E7',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over6.png',
          content: '截止到当前时间，平台所有的付费用户数量；'
        },
        {
          num: '0%', txt: '总支付订单数', num2: '0%', color: '#00C3BC',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over4.png',
          content: '截止到当前时间，平台所有的付款订单数量'
        },
        {
          num: '0%', txt: '总访问-支付转化率', num2: '0%', color: '#FF7430',
          img: 'https://ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com/admin/material/12_material_admin/image/assets/tiktok/over2.png',
          content: '截止到当前时间，平台的总访客数-支付转化率（总支付订单数/总访客人数）'
        }
      ],
      indicatorData: [ // 核心指标顶部数据
        { keyCtrl: 'dealAmt', color: '#EB3F4D', num: '0', txt: '成交金额', active: true, content: '统计当前筛选的时间内的所有成交金额统计（包含退款金额）' },
        // { color: '#00C3BC', num: '35,900', txt: '访客数', active: true, content: '统计当前筛选日期的访客人数（同个账号仅计算一次）' },
        // { color: '#5050F9', num: '98%', txt: '支付转化率', active: true, content: '统计当前筛选时间内的访问量与成功支付的订单比例（支付订单/访问人数）' },
        { keyCtrl: 'averagePrice', color: '#FF7430', num: '0%', txt: '客单价(元)', active: true, content: '统计当前筛选时间内的成交客单价均值' },
        { keyCtrl: 'payUserNum', color: '#4F8AFF', num: '0', txt: '付费用户数', active: true, content: '统计当前筛选时间内成交订单的用户数' }
      ],
      // 统计时间类型
      talentTypeOptions: [
        { value: 1, label: '全部', type: 'all' },
        { value: 4, label: '自然日', type: 'day' },
        { value: 2, label: '自然周', type: 'week' },
        { value: 3, label: '自然月', type: 'month' },
        { value: 6, label: '近七天', type: 'lastSevendays' },
        { value: 5, label: '近一年', type: 'lastOneyear' }
      ],
      piecesOneDataList: [
        { txt: '今日成交金额', num: '0' },
        { txt: '昨日成交金额', num: '0' },
        { txt: '今日抽佣金额', num: '0' },
        { txt: '昨日抽佣金额', num: '0' }
      ],
      piecesTwoList: [],
      piecesThreeList: [],
      // 今日概览数据
      lineChartData: {
        countData: [], // x轴坐标名
        expectedData: [], // 详细数据
        legendData: [] // 类型名
      },
      // 核心指标数据
      coreIndicatorData: {
        countData: [],
        expectedData: [],
        legendData: []
      },

      dateType: 1,
      //  核心指标日期选择器参数
      platformCore: {
        dateType: 1,
        coreBizday: ''
      },
      // 达人看板日期选择器参数
      talentformCore: {
        dateType: 1,
        coreBizday: ''
      },
      // 商品看板日期选择器参数
      prodformCore: {
        dateType: 1,
        coreBizday: ''
      },
      refreshKey: '',
      dateNow: '',
      bizday: '', // 统计日期
      currentTime: '', // 获取当前时间
      weekTime: '', // 显示星期几
      datePicker: '', // 统计日期 datePicker
      coreBizday: '', // 接口需要传截止当前日期的前一天日期
      talentDealData: [], // 成交TOP达人表格
      prodDealData: [], // 成交榜TOP商品表格
      platformOption: [], // 核心指标折线图数据
      pickerOptions: {
        disabledDate: (time) => { // 禁止选择当前日期之后的日期
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
        },
        firstDayOfWeek: 1
      },
      setMonthDisabled: {
        disabledDate(time) {
          // 获取当前的月份信息
          const date = new Date()
          const year = date.getFullYear()
          let month = date.getMonth() + 1
          if (month >= 1 && month <= 9) {
            month = '0' + month
          }
          const nowDate = year.toString() + month.toString()

          // 获取时间选择器的月份信息
          const timeyear = time.getFullYear()
          let timemonth = time.getMonth() + 1
          if (timemonth >= 1 && timemonth <= 9) {
            timemonth = '0' + timemonth
          }
          const elTimeData = timeyear.toString() + timemonth.toString()

          // 返回，时间选择器的日期月份大于当前日期的月份，又因为disabledDate函数是控制月份禁用不可选
          // 所以，最终就是：时间选择器的月份大于当前的月份，就都禁用掉，所以就实现了最终效果：
          return elTimeData >= nowDate
        }
      }
    }
  },
  watch: {
    versionType(val) {
      this.initData(val)
    }
  },
  created() {
  },
  mounted() {
    this.refreshKey = Math.random() * 100
    const curDatePicker = new Date(Date.now()).getTime()
    this.dateNow = parseTime(new Date(curDatePicker - 1 * 60 * 60 * 24 * 1000), '{y}-{m}-{d}').split('-').join('')
    this.initData(this.versionType)
  },
  filters: {
    dateTypeFilter(val) {
      const dateType = new Map([
        [1, 'date'],
        [2, 'week'],
        [3, 'month'],
        [4, 'date'],
        [5, 'year']
      ])
      return dateType.get(val)
    },
    overviewNumFilter(val, index) {
      switch (index) {
        case 0:
        case 1:
          return val.toString().split('.')[0].length >= 5 ? '万元' : '元'
        case 5:
          return '%'
        default:
          break
      }
    },
    realTimeFilter(val) {
      return val.toString().split('.')[0].length >= 5 ? '万元' : '元'
    }
  },

  methods: {
    // 万转化
    priceformatDecimal(num, index) {
      if ([0, 1].includes(index)) {
        return num.toString().split('.')[0].length >= 5 ? parseFloat(num / 10000).toFixed(2) : num
      } else {
        return num
      }
    },

    initData(versionType) {
      this.versionType = versionType

      this.handleGetRealView(versionType)
      this.handleGetPlatformCore(versionType)

      this.handleGetTalentDealTop(versionType)
      this.handleGetProdDealTop(versionType)

      this.handleGetPlatformCoreOption(versionType).then(() => {
        this.handlecoreLineDate()
      })
    },
    // 今日概览数据
    async handleGetRealView(type) {
      await getRealTimeView({
        verType: type || this.versionType
      }).then(res => {
        if (res.data.statusCode == 200) {
          const { piecesOneList, piecesTwoList, piecesThreeList, optionDataVo } = res.data.data
          this.piecesTwoList = piecesTwoList
          this.piecesThreeList = piecesThreeList

          this.currentTime = parseTime(new Date())
          this.weekTime = parseTime(new Date(), '{a}')
          // console.log('今天是星期', this.weekTime)

          for (let i = 0; i < this.overviewData.length; i++) {
            this.overviewData[i].num = this.piecesTwoList[i].num
            this.overviewData[i].num2 = this.piecesThreeList[i].num
          }

          piecesOneList.forEach((i, index) => {
            this.$set(this.piecesOneDataList[index], 'num', i.num)
          })

          const lineChartData = []
          lineChartData.push(optionDataVo.todayDealAmt)
          lineChartData.push(optionDataVo.yesterdayDealAmt)

          this.lineChartData = {
            countData: optionDataVo.date || Array.from(new Array(24).keys()).slice(0), // x轴坐标名
            expectedData: lineChartData, // 详细数据
            legendData: ['今日收入', '昨日收入'] // 类型名
          }
        }
      })
    },
    // 核心指标
    async handleGetPlatformCore(type) {
      await getPlatformCore({
        verType: type,
        dateType: this.platformCore.dateType, // 统计时间类型：1：自然日，2：自然周，3：自然月，4：近七天，5：近一年
        bizday: this.platformCore.coreBizday || '20220120'
      }).then(res => {
        if (res.data.statusCode == 200) {
          const { dealAmt, averagePrice, payUserNum } = res.data.data
          this.indicatorData[0].num = dealAmt
          this.indicatorData[1].num = averagePrice
          this.indicatorData[2].num = payUserNum
        }
      })
    },
    // 核心指标数据折线图
    async handleGetPlatformCoreOption(type, txt, active = true) {
      await getPlatformCoreOption({
        verType: type,
        dateType: this.platformCore.dateType, // 统计时间类型：1：自然日，2：自然周，3：自然月，4：近七天，5：近一年
        bizday: this.platformCore.coreBizday || this.dateNow
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.platformOption = res.data.data

          Object.freeze(this.platformOption)
        }
      })
    },
    // 核心指标折线图数据处理
    handlecoreLineDate() {
      const chartData = []
      this.indicatorData.forEach(item => {
        (item.active && this.platformOption[item.keyCtrl]) ? chartData.push(this.platformOption[item.keyCtrl]) : chartData.push({ data: [], name: '' })
      })

      this.coreIndicatorData = {
        countData: this.platformOption.time,
        expectedData: chartData,
        legendData: []
      }
    },
    handleIndicatorChange({ txt, active }, idx) {
      this.$set(this.indicatorData[idx], 'active', !active)

      this.handleGetPlatformCoreOption(this.versionType, txt, active).then(() => {
        this.handlecoreLineDate()
      })
    },

    // 成交TOP达人
    async handleGetTalentDealTop(type) {
      await getTalentDealTop({
        bizday: this.talentformCore.coreBizday || this.dateNow,
        dateType: this.talentformCore.dateType,
        verType: type,
        pageNo: 1,
        pageSize: 5
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.talentDealData = res.data.data.records
        }
      })
    },
    // 成交榜TOP商品
    async handleGetProdDealTop(type) {
      await getProdDealTop({
        bizday: this.prodformCore.coreBizday || this.dateNow,
        dateType: this.prodformCore.dateType,
        verType: type,
        pageNo: 1,
        pageSize: 5
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.prodDealData = res.data.data.records
        }
      })
    },
    handleCoreDatePickerBack(coreBizday, dateType) {
      this.platformCore.dateType = dateType
      this.platformCore.coreBizday = coreBizday

      this.$nextTick(() => {
        this.handleGetPlatformCore(this.versionType)
        this.handleGetPlatformCoreOption(this.versionType).then(() => {



        
          this.handlecoreLineDate()
        })
      })
    },
    handleProdDatePickerBack(coreBizday, dateType) {
      console.log(coreBizday, dateType, 'handleProdDatePickerBack')
      this.prodformCore.dateType = dateType
      this.prodformCore.coreBizday = coreBizday

      this.handleGetProdDealTop(this.versionType)
    },
    handletalentDatePickerBack(coreBizday, dateType) {
      console.log(coreBizday, dateType, 'handletalentDatePickerBack')
      this.talentformCore.dateType = dateType
      this.talentformCore.coreBizday = coreBizday

      this.handleGetTalentDealTop(this.versionType)
    }
  }

}
</script>
<style lang="scss">
  .anly-picker .el-date-editor.el-input {
    width: 200px;
  }
</style>
<style lang="scss" scoped>
  .circle{
    width: 8px;
    height: 8px;
  }
  .indicator {
    width: 320px;
    height: 102px;
  }
  .height436 { height: 436px; }
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
  div.indicator:nth-child(5) {
    margin-right: 0 !important;
  }

  .width520 {
    width: 520px;
  }
  .height280 {
    height: 280px;
  }
</style>
