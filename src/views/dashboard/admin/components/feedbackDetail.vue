<template>
  <div>
    <p class="filter"></p>
    <div class="feedback padding-tb20 relative" v-loading="this.listLoading">
      <h5 class="color-10 padding-lr60">{{feedbackDetail.name}}</h5>
      <div class="feedbackContent padding-lr60">
      <span class="color-b c-fs-10">{{feedbackDetail.createdAt}}</span>
      <div class="content margin-t margin-b color-35 c-fs-12" v-html="feedbackDetail.content"></div>
      <div class="reply color-35 c-fs-12 margin-b" v-html="item.content" v-for="(item, index) in feedbackDetail.adminApply"
           :key="index">

      </div>
      </div>
      <div class="btn center">
        <el-button @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { toGetFeedbackDetail } from '@/api/systemManage'
  export default {
    props: ['feedbackId'],
    data() {
      return {
        feedbackDetail: {},
        listLoading: false
      }
    },
    methods: {
      getFeedbackDetail() {
        this.listLoading = true
        toGetFeedbackDetail(this.feedbackId).then(res => {
          this.feedbackDetail = res.data.data
          console.log('我的反馈', res)
          this.listLoading = false
        })
          .catch(err => {
            console.log(err)
            this.listLoading = false
          })
      },
      close() {
        this.$emit('closeFeedbackDetail', false)
      }
    },
    watch: {
      feedbackId: {
        handler: function(val, oldval) {
          this.getFeedbackDetail()
        }
      }
    }
  }
</script>
<style scoped>
  .feedback {
    height: 550px;
    background: #fff;
    position: fixed;
    left: 25%;
    right: 25%;
    bottom: 15%;
    top: 5%;
    z-index: 120;
  }
  .feedback .feedbackContent{
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .btn {
    position: absolute;
    bottom: 18px;
    left: 45%;
  }

  .content p {
    line-height: 20px;
  }

  .reply img {
    max-height: 300px;
    max-width: 300px;
  }
</style>
