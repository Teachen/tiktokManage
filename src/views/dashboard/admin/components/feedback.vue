<template>
  <div class="clearfix c-width100" style="margin: 20px 0 0 0; overflow-clip: hidden;">
    <el-form class="fl c-width70" ref="postForm" :model="postForm" label-width="100px">
      <el-form-item label="标题:">
        <el-input :maxlength="40" placeholder="请输入标题限40字" class="width400" v-model="postForm.name"></el-input>
      </el-form-item>
      <el-form-item label="反馈详情：">
        <tinymce ref="tinymce" :height="300" v-model="postForm.content" @loadingStatus="loadingStatus" style="width: 600px;" :key="1"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  v-loading="btnLoading" :disabled="btnLoading" @click="submitBack">提交反馈</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="fr c-width30">
      <div class="margin-b">我的反馈</div>
      <ul v-loading="this.listLoading">
        <li class="c-fs-12" v-for="(item, index) in myReply" @click="feedbackDetail(item.feedbackId)" :key="index">
          <span class="blue" v-if="item.status== -1">[待回复]</span>
          <span class="blue" v-if="item.status== 1">[已查阅]</span>
          <span class="title">{{item.name}}</span>
        </li>
      </ul>
      <div class="block">
       <el-pagination

			      @current-change="handleCurrentChange"
			      :current-page="listQuery.page"
			       small
            layout="prev, pager, next"
			      :total="listQuery.total">
			    </el-pagination>
      </div>
    </div>
    <feedbackDetail @closeFeedbackDetail='closeFeedbackDetail' v-show="isShowFeedbackDetail" :feedbackId="feedbackId"></feedbackDetail>
  </div>
</template>
<script>
import { toFeedback, toGetFeedbackInfo } from '@/api/systemManage'
import Tinymce from '@/components/Tinymce'
import feedbackDetail from './feedbackDetail.vue'
export default {
  components: {
    Tinymce,
    feedbackDetail
  },

  data() {
    return {
      isShowFeedbackDetail: false,
      postForm: {
        name: '',
        content: ''
      },
      feedbackId: '',
      myReply: [],
      listQuery: {
        total: 0,
        page: 1
      },
      listLoading: false,
      btnLoading: false
    }
  },
  created() {
    this.getFeedbackInfo()
  },
  methods:
  {
    getFeedbackInfo() {
      this.listLoading = true
      toGetFeedbackInfo(this.listQuery).then(res => {
        this.myReply = res.data.data.data
        this.listQuery.total = res.data.data.total
        this.listLoading = false
      })
        .catch(err => {
          console.log(err)
          this.listLoading = false
        })
    },
    handleCurrentChange(val) { // 切换当前页
      this.listQuery.page = val
      console.log(this.listQuery.page)
      this.getFeedbackInfo()
    },
    feedbackDetail(id) {
      this.isShowFeedbackDetail = true
      this.feedbackId = id
    },
    closeFeedbackDetail(msg) {
      this.isShowFeedbackDetail = msg
    },
    submitBack() { // 提交反馈方法
      if (this.postForm.name == '') {
        this.$message({
          type: 'error',
          message: '反馈标题不能为空'
        })
        return
      }
      if (this.postForm.content == '') {
        this.$message({
          type: 'error',
          message: '反馈内容不能为空'
        })
        return
      }
      this.postForm.content = this.replaceMpLink(this.postForm.content) // 链接问号处理
      toFeedback(this.postForm).then(res => {
      // 正确回调
        this.$message({
          type: 'success',
          message: '提交成功，管理员将收到反馈问题'
        })

        this.getFeedbackInfo()
        this.postForm.name = ''
        this.postForm.content = ''
        this.$refs['tinymce'].setContent('')
      // this.$router.push({ path: `/feedback` })
      })
        .catch(err => {
          console.log(err)
        })
    },
    cancel() {
      this.postForm.name = ''
      this.postForm.content = ''
      this.$refs['tinymce'].setContent('')
    },
    loadingStatus(msg) {
      // 编辑器图片是否上传完 loading状态
      this.btnLoading = msg
    }
  }

}

</script>
<style scoped lang="scss">
  ul, li, p {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
    cursor: pointer;
  }

  li:hover{
    color: #409EFF;
  }
  .title {
    line-height: 20px;
  }
</style>
