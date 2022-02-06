<template>
  <super-dialog
    title="审核"
    width="700px" top="3%"
    class="no-padding"
    :appendToBody="true"
    :showConfirmButton="false"
    textAlign="center"
    :show="show"
    @close="handleClose">
    <template slot="content">
      <div class="clearfix padding-t20" v-loading="dialogLoading">
        <el-image class="fl border-radio4 margin-r16" :src="postForm.cover" :width='180' :height='120'></el-image>
        <div class="c-fs-14 c-flex-column height120 c-justify-sb">
          <p class="font-bold c-fc-333 c-fs-16">{{postForm.name}}</p>
          <p> <span class="c-fc-sgray">商品价格：</span> <span class="color-ff0000">{{Number(postForm.price).toFixed(2) == '0.00' ? '免费' : '￥' + Number(postForm.price).toFixed(2)}}</span></p>
          <p> <span class="c-fc-sgray">分销比例：</span> <span class="c-fs-333">{{Number(postForm.distRatio)}}%</span></p>
        </div>
      </div>
      <el-tabs class="margin-t8" v-model="activeTab">
        <el-tab-pane label="简介" name="profile"></el-tab-pane>
        <el-tab-pane v-if="[ckFrom.video, ckFrom.audio, ckFrom.column].includes(postForm.prodType)" label="目录" name="directory"></el-tab-pane>
        <el-tab-pane v-if="[ckFrom.articles].includes(postForm.prodType)" label="详情" name="detailInfo"></el-tab-pane>
      </el-tabs>
      <template v-if="activeTab == 'profile'">
        <div class="c-flex-row margin-b15 padding-15 border-radio10 c-bd1-e5 height86 c-bg-fa">
          <el-image class="margin-r10 c-br-50" :src="postForm.talentHeadimgurl || require('@/assets/default_head.png')" :width="56" :height="56"></el-image>
          <div class="c-ph2 c-pv2">
            <p class="c-fc-333 margin-b12">{{postForm.talentName}}</p>
            <el-tag v-for="(item, index) in postForm.talentTypeName.split(',')" :key="index"
            class="margin-r10 height20 c-line-20">{{item}}</el-tag>
          </div>
        </div>
        <div class="profile margin-t15">

          <p v-if="[ckFrom.articles].includes(postForm.prodType)" v-html="postForm.previewText"></p>

          <div v-else  v-for="item in postForm.detail" :key="item.id">
            <p v-loading="/^((http|https)?:\/\/)/.test(item.content)"
              v-if="item.type == 1" v-html="item.content"
            ></p>
          </div>
        </div>
      </template>

      <p v-if="activeTab == 'directory' && [ckFrom.video, ckFrom.audio, ckFrom.column].includes(postForm.prodType)" class="c-fc-333">共{{total || 0}}节</p>
      <div v-if="activeTab == 'directory' && [ckFrom.video, ckFrom.audio, ckFrom.column].includes(postForm.prodType)"
        class="c-mv15 c-mh15 c-pv10 c-ph10 c-bg-fa profile">
        <div class="c-bg-white c-pv10 c-ph20 c-line-50">
          <template v-if="videoList.length > 0">
            <el-collapse accordion class="intro-parts" style="border: 0" >
              <el-collapse-item class="clearfix" v-for="(item, index) in videoList" :key="item.id"
                :class="[ckFrom.articles].includes(item.prodType) || item.detailList === null ? 'imgText-item' : 'item-padTop'">
                <div class="c-line-28 c-fc-666 c-width100" slot="title">
                  <span class="padding-r10 fl">第{{index+1 + ((listQuery.pageNo - 1) * listQuery.pageSize)}}讲、</span>

                  <el-eye  class="fl" :value="item.name" width="416"></el-eye>

                  <previewContent v-if="item.prodType == ckFrom.articles" class="fr"
                    tipText="查看" :keyVal="item.id" from="picture"
                    :content="item.previewText">
                  </previewContent>

                  <div class="fr" v-show="[ckFrom.video, ckFrom.audio].includes(item.prodType) && (item.detailList === null)">
                    <el-button type="primary" size="mini" plain @click="previewVideo(item)">播放</el-button>
                  </div>
                </div>

                <div v-if="item.detailList === null" class="c-fs-14 c-fc-sgray padding-t20 c-textAlign-c">
                  暂无数据
                </div>
                <div v-else>
                  <div v-for="(urlItem, urlIndex) in item.detailList" :key="urlIndex"
                    class="c-flex-row c-fs-14 c-aligni-center c-pv10 padding-l8 c-justify-sb" >
                    <span class="c-fc-666 padding-r10">{{urlIndex+1}}、</span>
                    <el-eye class="c-flex-grow1" :value="urlItem.name" width="416"></el-eye>
                    <el-button v-show="[ckFrom.audio, ckFrom.video].includes(urlItem.prodType) || [1, 2].includes(~~urlItem.resType)"
                      type="primary"
                      size="mini" plain
                      @click="previewVideo(urlItem)">播放</el-button>
                  </div>
                </div>
              </el-collapse-item>

            </el-collapse>
          </template>
          <p v-else class="c-fs-14 c-fc-sgray c-textAlign-c">
            暂无数据
          </p>
        </div>

        <el-pagination
          v-if="videoList.length>0"
          class="c-line-16 margin-t10 c-textAlign-c"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>

      <div v-if="activeTab == 'detailInfo'">
        <div class="profile margin-t15" v-for="item in postForm.detail" :key="item.id">
          <p v-loading="/^((http|https)?:\/\/)/.test(item.content)"
             v-if="item.type == 1" v-html="item.content"
          ></p>
        </div>
      </div>
      <play-resources :showDialog="showVideo"
        :showType="(playItem.prodType == ckFrom.video || playItem.resType == 1)? 'video' : 'audio'"
        :playItem="{
          playUrl: playItem.resLink,
          title: playItem.name,
          artist: '',
          id: playItem.id,
          resourceId: playItem.pfVideoId
        }"
        @close="showVideo = false">
      </play-resources>
    </template>
  </super-dialog>

</template>
<script>

import superDialog from '@/views/templatePage/superDialog/index.vue'
import { getProdInfo, getAllCatalogue } from '@/api/tiktok'

import previewContent from '@/components/Tinymce/components/previewContent'
import playResources from '@/views/templatePage/playResources/index.vue'

export default {
  name: 'detailInfo',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    checkId: [Number, String]
  },
  components: { superDialog, previewContent, playResources },
  data() {
    return {
      postForm: {
        id: '',
        price: null, // 抖店产品价格
        name: '', // 抖店产品名称
        description: '', // 抖店产品简介
        detail: '', // 详情内容
        distRatio: null, // 分销比例
        prodType: null, // 产品类型：110：视频，111：音频，112：图文，9：专栏
        cover: '', // 抖店产品封面
        talentName: '', // 达人名称
        talentHeadimgurl: '', // 达人头像
        talentTypeName: '' // 达人类型名称
      },
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      playItem: {},
      videoList: [], // 音视频播放列表
      refreshKey: '',
      activeTab: 'profile',
      dialogLoading: false,
      showVideo: false,
      ckFrom: global.ckFrom
    }
  },
  created() {
    this.getList(this.checkId)
  },
  methods: {
    getList(id) {
      this.dialogLoading = true
      getProdInfo(id).then(res => {
        if (res.data.statusCode == 200) {
          this.postForm = res.data.data
          this.dialogLoading = false

          if (Object.prototype.toString.call(this.postForm.detail) == '[object Array]' && this.postForm.detail.length) {
            this.postForm.detail.forEach(item => {
              item.type == 1 &&
              /^((http|https)?:\/\/)/.test(item.content) &&
              this.getPageHtml(
                item.content,
                url => {
                  if (url) {
                    item.content = url
                  }
                },
                _ => {
                  item.content = ''
                }
              )
            })
            // 试看图文数据结构处理
            this.postForm.previewText && /^((http|https)?:\/\/)/.test(this.postForm.previewText) &&
            this.getPageHtml(
              this.postForm.previewText,
              url => {
                if (url) {
                  this.postForm.previewText = url
                }
              },
              _ => { this.postForm.previewText = '' }
            )
          }

          // 获取所有音视频专栏目录
          if ([this.ckFrom.video, this.ckFrom.audio, this.ckFrom.column].includes(this.postForm.prodType)) {
            this.getAllCatalogue(id)
          }
        }
      }).catch(_ => {
        this.dialogLoading = false
      })
    },
    getPageHtml: (pageUrl, callBack, errCallBack) => {
      // eslint-disable-next-line no-undef
      axios.get(pageUrl).then(res => {
        if (res.status == 200) {
          callBack && callBack(res.data)
        }
      }).catch(err => {
        errCallBack(err)
      })
    },
    getAllCatalogue(id = this.checkId) {
      getAllCatalogue(id, this.listQuery).then(res => {
        const { total, records } = res.data.data
        this.total = total || 0

        if (res.data.statusCode == 200) {
          this.videoList = records || []
          this.videoList.map(item => {
            item.previewText && /(.html)$/.test(item.previewText) &&
              this.getPageHtml(
                item.previewText,
                url => {
                  if (url) {
                    item.previewText = url
                  }
                },
                _ => {
                  item.previewText = ''
                }
              )
          })
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAllCatalogue()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getAllCatalogue()
    },
    previewVideo(item) { // 点击播放
      this.playItem = { ...item }
      this.showVideo = true
    },
    handleClose() {
      this.$emit('close', false)
    },
    handleVideoClose(done) {
      this.playItem = {}
      if (document.querySelector('.vcp-player')) {
        this.player.destroy()
        document.getElementById('playerIcon' + 1).style.display = 'flex'
      }
      done()
    }
  }
}
</script>
<style lang="scss">

  .profile {
    max-height: 400px;
    overflow-y: scroll;
    p img {
      max-width: 100%;
    }
  }

</style>
<style scoped>
  .height86 {
    height: 86px;
  }

  .imgText-item>>>.el-collapse-item__arrow, .imgText-item>>>.el-collapse-item__wrap{
    display: none;
  }

  .item-padTop>>>.el-collapse-item__content{
    padding-top: 25px;
  }

  .intro-parts>>>.el-collapse-item.is-active .el-collapse-item__header {
    border-bottom: 1px solid #ebeef5
  }
  .intro-parts>>>.el-collapse-item__header{
    border: 0;
  }
</style>
