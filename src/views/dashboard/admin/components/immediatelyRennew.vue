<template>
  <div class="app-container">
    <div class="c-width100 padding10 border-ffdeae c-line-20  c-fc-666 padding-l20 c-fs-12 c-bg-fffaf2 margin-b40">
     店铺的到期时间是{{companyInfo.expireTime}}。为了不影响店铺的正常运营，请尽快续费。<br/>
     如有疑问，请咨询客服，客服热线: 18250733668
    </div>
    <div class="padding-l71">
      <div class="clearfix">
        <span class="margin-b30 c-fs-14 fl width120 right  margin-r10">平台名称：</span>
        <span class="c-fc-666  c-fs-14fl">{{companyInfo.companyName}}</span>
      </div>
       <div class="clearfix">
        <span class="margin-b30 c-fs-14  fl width120 right  margin-r10">店铺创建时间：</span>
        <span class="c-fc-666 c-fs-14  fl">{{companyInfo.createdAt}}</span>
      </div>
       <div class="clearfix">
        <span class="margin-b30 c-fs-14  fl width120 right  margin-r10">店铺到期时间：</span>
        <span class="c-fc-666  fl"><b>{{companyInfo.expireTime}}</b></span>
      </div>
      <!-- <p class="margin-b30 c-fs-14">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台名称：&nbsp;<span class="c-fc-666">{{companyInfo.companyName}}</span></p>
      <p class="margin-b30 c-fs-14">店铺创建时间：<span class="c-fc-666">{{companyInfo.createdAt}}</span></p>
      <p class="margin-b30 c-fs-14">店铺到期时间：<span class="c-fc-666"><b>{{companyInfo.expireTime}}</b></span></p> -->
      <div class="clearfix margin-b10">
        <span class=" c-fs-14 fl width120 right margin-r10">选择续费套餐：</span>
        
        <div class="c-flexw-wrap c-flex-row fl  c-width80">
        
          <div v-for="(item, index) in getOnLineDetailData"
                :key="item"
                class="rennewWrap border-radio10 center margin-b20 pointer relative c-bg-f9 margin-r20 hover-shadow"
                @click="selectCustom(item, index)"
                :style="{'border':(item.isChecked?'1px solid #409eff':''),'background-color':(item.isChecked?'#ECF5FF':'')}"
              >
                <span class="font-bold " :class="{'c-fc-38a3ff':item.isChecked}">{{item.name}}</span>
                <div class="c-fs-14 c-line-20 padding-t20 c-textAlign-l">
                  <p>续费时长：{{item.duration}}月</p>
                  <p class="padding-t15">价格：￥{{item.price}}</p>
                </div>
              <img v-if="item.isChecked"
                  class="checkedImg"
                  src="@/assets/checkedTop.png"
                  alt="">
            </div>
        </div>
      </div>
      
      <div class="clearfix  margin-b20" style="margin-bottom:55px">
        <span class="margin-b30 c-fs-14 fl width120 right  margin-r10">续费后到期时间：</span>
        <span class="c-fc-666  fl"><b>{{day}}</b></span>
      </div>
    </div>
    <div class="center">
      <el-button align="center" class="btnNow" type="primary" @click.native="buySms">立即续费</el-button>
      <p class="margin-t10 margin-b20" @click="tobuyHistory"><b class=" c-fs-12">查看续费记录</b></p>
    </div>
     <!-- 立即续费二维码 -->
    <el-dialog
      title="提示"
      :visible.sync="isShowByrQrcode"
      width="30%"
      center
      :before-close="handleClose">
      <p class="c-textAlign-c">扫描二维码购买续费套餐</p>
      <p class="c-textAlign-c" v-html="qrcodeImg"></p>
      <p class="c-pv20 c-textAlign-c">
        <el-button @click="isShowByrQrcode = false">取 消</el-button>
        <el-button type="primary" @click="confirmPaySuccess">我已付款成功</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
import { getOnLineDetail, checkOrder } from '@/api/wechatPublic'
export default {

  name: 'immediatelyRennew',
  data() {
    return {
      getOnLineDetailData: [],
      getOnLineDetailFrom: {
        companyId: null
      },
      checkOrderFrom: {
        companyId: null,
        expireTime: null
      },
      companyInfo: {},
      listData: {},
      day: 0,
      isShowByrQrcode: false,
      qrcodeImg: ''
    }
  },
  created() {
    this.getOnLineDetail()
  },
  methods: {
    init() {
      this.getOnLineDetailData[0].isChecked = true
      this.day = this.getOnLineDetailData[0].expireTime// 到期时间
      this.qrcodeImg = this.getOnLineDetailData[0].payQrcode // 付款二维码
    },
    getOnLineDetail() { // 获取套餐列表
      this.getOnLineDetailFrom.companyId = this.$route.params.companyId
      getOnLineDetail(this.getOnLineDetailFrom).then(res => {
        this.companyInfo = res.data.data.companyInfo
        this.getOnLineDetailData = res.data.data.packages
        this.getOnLineDetailData.forEach(item => {
          this.$set(item, 'isChecked', false)
        })
        this.$store.dispatch('GetUserInfo', '')

        this.init()
      }).catch(erro => {
        console.log(erro)
      })
    },
    selectCustom(item, index) { // 套餐选择事件
      this.getOnLineDetailData.forEach(li => {
        if (item == li) {
          li.isChecked = true
        } else {
          li.isChecked = false
        }
      })
      this.day = item.expireTime// 插入到期时间
      this.qrcodeImg = item.payQrcode // 付款二维码
    },
    buySms(payMoney) { // 立即续费
      this.isShowByrQrcode = true
    },
    confirmPaySuccess() { // 确定付款成功
      this.isShowByrQrcode = false
      this.checkOrderFrom.companyId = this.$route.params.companyId
      this.checkOrderFrom.expireTime = this.companyInfo.expireTime
      // 购买套餐
      checkOrder(this.checkOrderFrom).then(res => {
        this.$message.success('购买成功！')
        this.getOnLineDetail()
      }).catch(err => {
        console.log(err)
      })
    },
    tobuyHistory() {
      this.$router.push({
        name: 'buyHistory',
        params: {
          prodType: 93
        }
      })
    },
    toCustomerList() { // 线下续费
      this.$router.push({
        name: 'customerList',
        params: {
          upPay: true,
          companyId: this.$route.params.companyId
        }
      })
    }

  }
}
</script>
<style  scoped>
.checkedImg {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 50px;
  height: 50px;
}
.rennewWrap{
  width: 166px;
  height: 194px;
  padding:40px 21px;
  border:1px solid #fafafa;
}
.btnNow{
  width: 110px;
  line-height: 11px;
}
.hover-shadow:hover{
  box-shadow:0px 5px 20px 0px rgba(0, 0, 0, 0.1);
}
</style>