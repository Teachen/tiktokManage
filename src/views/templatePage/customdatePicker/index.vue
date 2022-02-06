<template>
<!--
@author 陈進
@description 可以切换 自然日，自然周， 自然月， 近七天， 近一年多种时间类型筛选，请求对应时间的数据
-->
  <div>
    <span class="c-fs-12 c-fc-xgray padding-r10" v-if="bizday && !['all'].includes(currentDateType)"> 统计日期：{{bizday}}</span>
    <el-select class="margin-r10" v-model="dateType" size="mini"
     @change="handleDateTypeChange">
      <el-option
        v-for="item in dateTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <el-date-picker
      v-show="!['all', 'lastSevendays', 'lastOneyear'].includes(currentDateType)"
      @change="handleDatePicker"
      size="mini"
      v-model="datePicker"
      :type="dateType | dateTypeFilter"
      :format="dateType == 2 ? ' yyyy 第 WW 周 ': ''"
      value-format='yyyy-MM-dd'
      :picker-options="dateType == 3 ? setMonthDisabled : pickerOptions"
      placeholder="选择日期">
    </el-date-picker>
  </div>
</template>
<script>

import { parseTime } from '@/utils/index'
export default {
  props: {
    // 统计时间类型
    dateTypeOptions: {
      type: Array,
      default: () => [
        { value: 1, label: '自然日', type: 'day' },
        { value: 2, label: '自然周', type: 'week' },
        { value: 3, label: '自然月', type: 'month' },
        { value: 4, label: '近七天', type: 'lastSevendays' },
        { value: 5, label: '近一年', type: 'lastOneyear' }
      ]
    }
  },
  watch: {
  },
  computed: {
    currentDateType() {
      return this.dateTypeOptions.find(item => item.value == this.dateType).type
    }
  },
  data() {
    return {

      // 统计时间类型
      // dateOptions: [
      //   { value: 1, label: '自然日' },
      //   { value: 2, label: '自然周' },
      //   { value: 3, label: '自然月' },
      //   { value: 4, label: '近七天' },
      //   { value: 5, label: '近一年' }
      // ],

      dateType: 1,
      bizday: '', // 统计日期
      datePicker: '', // 统计日期
      coreBizday: '',
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
    }
  },
  mounted() {
    this.datePicker = this.getParseFormatTime(Date.now(), -1, '-')

    this.bizday = this.getParseFormatTime(this.datePicker, 0, '/')
    sessionStorage.setItem('default_datePicker', this.datePicker)
  },
  methods: {

    // 自然周时间格式处理
    getParseFormatTime(datePicker, day, i) {
      const curDatePicker = new Date(datePicker).getTime()
      return parseTime(new Date(curDatePicker + day * 60 * 60 * 24 * 1000), '{y}-{m}-{d}').split('-').join(i)
    },

    handleDatePicker() {
      if (['day'].includes(this.currentDateType)) {
        // 自然日  this.getParseFormatTime(this.datePicker, -6, '/') + ' - ' +
        this.coreBizday = this.datePicker.split('-').join('')
        this.bizday = this.getParseFormatTime(this.datePicker, 0, '/')
      } else if (['week'].includes(this.currentDateType)) {
        // 自然周
        this.coreBizday = this.getParseFormatTime(this.datePicker, 5, '')
        this.bizday = this.getParseFormatTime(this.datePicker, -1, '/') + ' - ' + this.getParseFormatTime(this.datePicker, 5, '/')
      } else if (['month'].includes(this.currentDateType)) {
        // 自然月 获取最后一天
        const m = this.datePicker.split('-')
        this.coreBizday = parseTime(new Date(m[0], m[1], 0), '{y}-{m}-{d}').split('-').join('')
        this.bizday = this.datePicker.split('-').join('/') + ' - ' + parseTime(new Date(m[0], m[1], 0), '{y}-{m}-{d}').split('-').join('/')
      }

      // 时间格式变化后重新请求接口
      this.$emit('datePickerChange', this.coreBizday, this.dateType)
    },
    handleDateTypeChange() {
      if (['day'].includes(this.currentDateType)) {
        // 自然日 this.getParseFormatTime(this.datePicker, -6, '/') + ' - ' +
        this.datePicker = sessionStorage.getItem('default_datePicker')
        this.coreBizday = this.datePicker.split('-').join('')
        this.bizday = this.getParseFormatTime(this.datePicker, 0, '/')
      } else if (['week'].includes(this.currentDateType)) {
        // 自然周自动定位到上周
        const default_datePicker = sessionStorage.getItem('default_datePicker')
        const subtractDays = new Date().getDay() - 1
        this.datePicker = this.getParseFormatTime(default_datePicker, -subtractDays, '-')

        this.coreBizday = this.getParseFormatTime(default_datePicker, -subtractDays, '')
        this.bizday = this.getParseFormatTime(default_datePicker, -(subtractDays + 6), '/') + ' - ' + this.getParseFormatTime(default_datePicker, -subtractDays, '/')
      } else if (['month'].includes(this.currentDateType)) {
        // 自然月自动定位到上月

        this.datePicker = sessionStorage.getItem('default_datePicker')
        this.datePicker = this.getParseFormatTime(this.datePicker, -28, '-')

        const m = this.datePicker.split('-')
        this.coreBizday = parseTime(new Date(m[0], m[1], 0), '{y}-{m}-{d}').split('-').join('')

        this.bizday = m[0] + '/' + m[1] + '/01' + ' - ' + parseTime(new Date(m[0], m[1], 0), '{y}-{m}-{d}').split('-').join('/')
      } else if (['lastSevendays'].includes(this.currentDateType)) {
        // 近七天 都是传昨天
        this.coreBizday = this.getParseFormatTime(Date.now(), -1, '')
        this.bizday = this.getParseFormatTime(Date.now(), -7, '/') + ' - ' + this.getParseFormatTime(Date.now(), -1, '/')
      } else if (['lastOneyear'].includes(this.currentDateType)) {
        // 近一年 都是传昨天
        this.coreBizday = this.getParseFormatTime(Date.now(), -1, '')
        this.bizday = this.getParseFormatTime(Date.now(), -365, '/') + ' - ' + this.getParseFormatTime(Date.now(), -1, '/')
      }

      // 时间格式变化后重新请求接口
      this.$emit('datePickerChange', this.coreBizday, this.dateType)
    }
  }
}
</script>
