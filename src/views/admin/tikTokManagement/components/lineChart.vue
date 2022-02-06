<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    color: {
      type: Array,
      default() {
        return ['#5b8ff9', '#5ad8a6', '#ff9d4d', '#f6e116']
      }
    },
    // config: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    minInterval: {
      type: Number,
      default: 0
    },
    isPayment: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
        console.log('传过来的趋势图数据', val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        'transitionend',
        this.sidebarResizeHandler
      )
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        'transitionend',
        this.sidebarResizeHandler
      )

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ countData, expectedData, legendData } = {}) {
      const defaultData = {
        grid: {
          left: 15,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true
        }
      }
      // if (Object.keys(this.config).length > 0) {
      //   for (const i in this.config) {
      //     const { merge, ...mergeData } = this.config[i]
      //     console.log(merge)
      //     // merge true 合并对应属性 false 重新赋值
      //     if (this.config[i].merge) {
      //       defaultData[i] = Object.assign({}, defaultData[i], mergeData)
      //     } else {
      //       defaultData[i] = mergeData
      //     }
      //   }
      // }
      this.chart.setOption({
        xAxis: {
          data: countData,
          boundaryGap: false,
          axisTick: {
            interval: 0
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            padding: [0, 11, 0, 11]
          }
        },
        color: this.color,
        grid: defaultData.grid,
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let html = params[0].name + '<br>'
            for (let i = 0; i < params.length; i++) {
              html += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color + ';"></span>'
              if (params[i].seriesName == '全部用户转化率' || params[i].seriesName == '新用户转化率' || params[i].seriesName == '老用户转化率') {
                html += params[i].seriesName + '：' + params[i].value + '%<br>'
              } else {
                html += params[i].seriesName + '：' + params[i].value + '<br>'
              }
            }
            return html
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          minInterval: this.minInterval,
          boundaryGap: true,
          axisTick: {
            show: false
          },
          nameTextStyle: {
            fontSize: 16
          },
          axisLine: {
            lineStyle: {
              color: '#999',
              width: 0 // y轴宽度为0就不存在y轴线了
            }
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: this.isPayment ? '{value} %' : '{value}'
          }
        },
        legend: {
          data: legendData
        },
        series: this.init(expectedData)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons', { devicePixelRatio: 2.5 })
      this.setOptions(this.chartData)
    },
    init(expectedData) {
      var dataArr = []
      var initObj = {
        name: '',
        itemStyle: {
          normal: {
            // color: '#f2afc2',
            lineStyle: {
              // color: '#f2afc2',
              width: 2
            }
          }
        },
        showAllSymbol: true,
        // symbol: 'circle', // 设定为实心点
        // symbolSize: 6, // 设定实心点的大小
        smooth: true,
        type: 'line',
        data: '',
        animationDuration: 100,
        animationEasing: 'cubicInOut'
      }
      expectedData.map((item, index) => {
        const dataItem = Object.assign({}, initObj)
        dataItem.data = item.data
        dataItem.name = item.name
        dataArr.push(dataItem)
      })
      return dataArr
    }
  }
}
</script>
