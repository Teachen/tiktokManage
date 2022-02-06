<template>
  <div>
    <div v-if="isPlugin == 0 && from != 'uploadVideo' && from != 'distribution' && isShowTip" class="c-fc-red c-fs-12 c-line-26" style="width: 705px;">
      <div>
        温馨提示：1、上传图片请尽量点击“上传图片”按钮进行上传，尽量不用粘贴复制的方式，不然内容过大，小程序端详情可能展示不出来（微信小程序的限制）
      </div>
      <div>
        2、WPS只支持文字复制，图片请单独保存上传，若要复制图文请使用Microsoft Word
      </div>
      <div>
        3、当弹出“Additional step needed to paste images”框时再次按下Ctrl+V即可复制图文， 选择关闭则只复制文字
      </div>
      <div v-show="from=='distribution'">
        4、分销商品课程介绍请勿带有公众号二维码、关注公众号、客服微信号等信息
      </div>
    </div>
    <div id="tinymce-container" class="tinymce-container editor-container relative" v-loading="loading" element-loading-text="图片上传中，请稍候">
      <textarea class="tinymce-textarea" :id="tinymceId" :placeholder="placeholderText"></textarea>
      <div class="word-number" v-if="comeFrom=='datum'">字数建议在500字以内</div>
      <div class="editor-custom-btn-container" v-if="isPic">
        <el-dropdown trigger="click" class="tiny-dropdown">
            <el-button type="primary" size="small" :disabled="!isEditabled">
              插入图片<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
              </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

      </div>
      <div class="editor-preview-btn-container" v-if="isPlugin == 0 && isshowPreview">
        <previewContent :keyVal="tid" :from="'tinymce'" class="editor-upload-btn" :content="value"></previewContent>
      </div>
      <div class="" style="" v-if="isPlugin == 1">
        <el-popover class="c-fs-14 absolute sign-absolute"
          placement="top"
          v-model="isShowSign"
          width="400"
          trigger="click">
          <el-tabs v-model="signType" @tab-click="handleClick">
            <el-tab-pane label="数学/单位" :name="1"></el-tab-pane>
            <el-tab-pane label="数学序号" :name="2"></el-tab-pane>
            <el-tab-pane label="英文音标" :name="3"></el-tab-pane>
          </el-tabs>
          <div  v-if="signType==1">
            <div class="width40 height40 c-line-40 c-textAlign-c c-fc-333 fl sign-div-hover" style="box-sizing: border-box;" v-for="(item,index) in allSign" :key="index" @click="clickSign(index)">{{item}}</div>
          </div>
          <div v-else-if="signType == 2">
            <div class="width40 height40 c-line-40 c-textAlign-c c-fc-333 fl sign-div-hover" style="box-sizing: border-box;" v-for="(item,index1) in mathSign" :key="index1" @click="clickSign(index1)">{{item}}</div>
          </div>
          <div v-else>
            <div class="width40 height40 c-line-40 c-textAlign-c c-fc-333 fl sign-div-hover" style="box-sizing: border-box;" v-for="(item,index) in englishSign" :key="index" @click="clickSign(index)">{{item}}</div>
          </div>
          <span slot="reference">符号</span>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import editorImage from './components/editorImage'
import previewContent from './components/previewContent'
// import { uploadEditImg } from '@/api/common'
import plugins from './plugins'
import toolbar from './toolbar'
import { imgConvert } from '@/api/common'
import { getToken } from '@/utils/auth'
import { encodeCompanyId } from '@/utils/permission'
let imgPasteCount = 0
let successCount = 0
let setContentCount = 0 // 请求setContent的次数 暂时没用到
let oldContent = ''
export default {
  name: 'tinymce',
  components: { editorImage, previewContent },
  props: {
    comeFrom: {
      type: String,
      default: ''
    },
    tid: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default() {
        return []
      }
    },
    isPlugin: {
      type: Number,
      default: 0
    },
    menubar: {
      default: 'file edit insert view table format '
    },
    emptyMenubar: {
      default: ''
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    isEditabled: {
      type: Boolean,
      default: true
    },
    from: {
      type: String,
      default: ''
    },
    isPic: {
      type: Boolean,
      default: true
    },
    placeholderText: {
      type: String,
      default: ''
    },
    isShowTip: {
      type: Boolean,
      default: true
    },
    isshowPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isFirstUpload: true, // 拖拽第二张图片的时候会触发两次编辑器的BeforeSetContent事件(暂时没找到哪里触发)
      hasChange: false,
      hasInit: false,
      tinymceId: this.tid || 'vue-tinymce-' + +new Date(),
      loading: false,
      allSign: ['﹢', '﹣', '·', '/', '=', '﹤', '﹥', '≦', '≧', '≡', '＋', '－', '×', '÷', '＝', '＜', '＞', '≤', '≥', '≈', '≒', '≠', '﹢', '﹣', '±', '∶', '∵', '∴', '∷', '㏒', '㏑', '∑', '∏', '∅', '∝', '∽', '∈', '∧', '∩', '⊙', '⌒', '∟', '∣', '∥', '∂', '∆', '∞', '≌', '∉', '∪', '∨', '⊕', '⊿', '⊥', '∠', '∫', '∬', '∭', '%', '‰', '％', 'º', '¹', '³', 'ⁿ', '℃', '℉', '〒', '∰', '∯', '∮', '℅ⁿ', '₁', '₂', '₃', '½', '⅓', '⅔', '¼', '¾', '°', '￠', '₠', '฿', '￡', '$', '€', '㎎', '㎏', 'μm', '㎜', '㎝', '㎞', '′', '¥', '$', '㎡', 'm³', '㏄', 'ml', 'mol', '㏕', '″', '￥'],
      mathSign: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ', 'ⅰ', 'ⅱ', 'ⅲ', 'ⅳ', 'ⅴ', 'ⅵ', 'ⅶ', 'ⅷ', 'ⅸ', 'ⅹ'],
      englishSign: ['a:', 'ɔ:', 'ə:', 'i:', 'u:', 'ʌ', 'ɔ', 'ə', 'i', 'u', 'e', 'æ', 'ei', 'ai', 'ɔi', 'iə', 'εə', 'uə', 'əu', 'au', 'p', 't', 'k', 'f', 'θ', 's', 'b', 'd', 'g', 'v', 'ð', 'z', 'ʃ', 'h', 'ts', 'tʃ', 'j', 'tr', 'ʒ', 'r', 'dz', 'dʒ', 'dr', 'w', 'm', 'n', 'ŋ', 'l'],
      isShowSign: false,
      signType: 1,
      url: '',
      uploadData: {},
      FideDir: '',
      convertCount: 0,
      contentEditCount: 0 // 在移动端可编辑内容说明有问题，需重新赋值，为预防setContent有问题，设置 一个计数，超过3次不执行了
    }
  },
  watch: {
    tid(val) {
      if (this.isPlugin == 1) {
        if (window.tinymce.get(val)) {
          this.$nextTick(() => window.tinymce.get(val).setContent(this.value))
        } else {
          window.tinymce.get(this.tinymceId).setContent(this.value)
        }
      }
    },
    placeholderText(val) {
      var _this = this
      this.$nextTick(() => {
        if (document.getElementById(_this.tinymceId + 'tinymce-placeholder')) {
          document.getElementById(_this.tinymceId + 'tinymce-placeholder').innerText = val
        }
      })
    },
    value(val) {
      // 这个原本是打算解决复制偶尔空白的问题，不过好像行不通，这样写会重复复制，先注释掉
      // var tinymceEl = document.getElementById(this.tinymceId + '_ifr')
      // var bodyElement = tinymceEl ? tinymceEl.contentWindow.document.getElementById('tinymce') : ''
      // if (bodyElement && bodyElement.children.length <= 2 && val) {
      //     // val = val.replace('position: fixed; top: 0px; width: 100px; height: 100px; overflow: hidden; opacity: 0; left: -100000px;', '')
      //     // val = val.replace('contenteditable="true"', '')
      //     var editEl = bodyElement.getElementsByClassName('ephox-sloth-bin')
      //     // 如果复制过来找到这个标签，说明赋值进去的内容有误，需要重新赋值一下标签里面的内容
      //     if(editEl && editEl[0] && editEl[0].getAttribute('contenteditable') && this.contentEditCount <= 2) {
      //       this.contentEditCount++
      //       this.$nextTick(() => {
      //         console.log('哈哈哈哈哈：',bodyElement.children[0], 'hehhhhhh', editEl[0].innerHTML)
      //       })
      //       var isEditEl = bodyElement.children.length == 1 && bodyElement.children[0].getAttribute('contenteditable')
      //       var isEmptyEl = bodyElement.children.length == 2 && bodyElement.children[0].innerHTML != editEl[0].innerHTML
      //       if(isEditEl || isEmptyEl) {
      //         this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(editEl[0].innerHTML))
      //       }
      //     }
      // } else {
      //   var ephoxEl = bodyElement ? bodyElement.getElementsByClassName('ephox-sloth-bin') : ''
      //   // console.log(ephoxEl)
      //   if(ephoxEl && ephoxEl[0]) {
      //     console.log('zhebianma ')
      //     ephoxEl[0].setAttribute('style', 'position: fixed; top: 0px; width: 100px; height: 100px; overflow: hidden; opacity: 0; left: -100000px;')
      //     ephoxEl[0].remove()
      //   }
      // }
      this.convertImages(val).then(res => {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(res))
      }).catch(err => {
        console.log('出错了', err)
      })
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted() {
    this.getImageSign({ type: 2 }).then(res => {
      const curData = res.data
      this.url = curData.host
      this.uploadData = {
        'key': '',
        'policy': curData.policy,
        'OSSAccessKeyId': curData.accessid,
        'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
        'callback': curData.callback,
        'signature': curData.signature
      }
      this.FideDir = curData.dir
    })
    if (this.isPlugin == 0) {
      this.initTinymce()
    } else {
      this.initTinymceNoPlugins()
      // document.querySelector('#mceu_23').style.display = 'none'
    }
    this.clearEditorStorage()
    // console.log('编辑器mounted：', this.tinymceId,this.value)
    // if (!this.hasChange && this.hasInit) {
    //   this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(this.value))
    // }
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    clearEditorStorage() { // 清除 编辑器的一些缓存，localStorage
      var len = localStorage.length;
      for(var i = 0; i < len; i++) {
        var getKey = localStorage.key(i);
        if(getKey && getKey.includes('tinymce-autosave')) {
          localStorage.removeItem(getKey)
        }
      }
    },
    watchBeforeSetContent(editor) {
      const _this = this

      editor.on('BeforeSetContent', function(args) {
        if (!_this.isFirstUpload) {
          return
        }
        // console.log('biaoqian', document.getElementById(_this.tinymceId + '_ifr').contentWindow.document.getElementsByClassName('ephox-sloth-bin'))
        _this.convertCount = 0
        _this.contentEditCount = 0
        // 存在未上传的图片
        // 记录每一次复制的末尾值
        var totalImg = 0
        args.content.replace(/<img [^>]*src=['"][(^blob)|(^data:image/)]([^'"]+)[^>]*>/gi, function(match, capture) {
          totalImg++
        })
        imgPasteCount = imgPasteCount > 0 ? imgPasteCount : totalImg
        const pre = imgPasteCount
        var backgroundArr = []
        args.content = args.content.replace(/background(?:\-image)? *\:[^\:;\}]*url\(([^\)]+)\)/gi, function(match, capture) {
          backgroundArr.push(match)
          return match
        })
        // console.log('srcArr', srcArr, srcArr.filter(i => i.includes('blob') || i.includes('data:image/')).length)
        // args.content.includes('<img') && (args.content.includes('blob') || args.content.includes('data:image/'))
        // if (srcArr.filter(i => i.includes('blob') || i.includes('data:image/')).length > 0) {
        if (args.content.includes('<img') && (args.content.includes('blob') || args.content.includes('data:image/'))) {
          _this.isFirstUpload = false
          var srcArr = []
          // 匹配img标签 match是img标签 capture是src的值
          args.content = args.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            // console.log('复制的图片:', match)
            // 给img一个标识 id
            match = match.replace('<img', '<img id="pastedImg' + imgPasteCount + '"')
            // 存src的值
            srcArr.push(capture)
            imgPasteCount++
            return match
          })
          // 将每张图片上传并替换src路径
          // console.log(imgPasteCount, 'imgPasteCount', imgPasteCount - pre)
          for (let i = 0; i < imgPasteCount - pre; i++) {
            if (srcArr[i].includes('data:image/')) { // 将base64 转为blob 文件 判断大小是否超过5M 然后在直传到阿里云
              _this.loading = true
              _this.$emit('loadingStatus', true)
              var blobFile = _this.base64ToBlob(srcArr[i], 'img' + (i + pre))
              if (blobFile.size / 1024 / 1024 > 5) {
              // _this.$message.error('您复制的内容中，第' + (i + 1) + '张图片超过5M，请调整大小后单独上传！')
                _this.$message({
                  duration: 5000,
                  message: '您复制的内容中，第' + (i + 1) + '张图片超过5M，请调整大小后单独上传！',
                  type: 'error'
                })
                var removeImg = document.getElementById(_this.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + (i + pre))
                if (removeImg) { removeImg.remove() }
              // _this.loading = false
              // _this.$emit('loadingStatus', false)
              // return
              }
              _this.uploadImg(blobFile, i + pre, i, imgPasteCount - pre)
            } else if (srcArr[i].includes('blob')) { // blob链接获取blob对象
              _this.loading = true
              _this.$emit('loadingStatus', true)
              var xhr = new XMLHttpRequest()
              xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                // i+pre是当前图片的id imgPasteCount - pre是要上传图片的总数
                  // console.log(this.response, this.response.type)
                  if (this.response.size / 1024 / 1024 > 5) {
                    _this.$message.error('您复制的内容中，第' + (i + 1) + '张图片超过5M，请调整大小后单独上传！')
                    document.getElementById(_this.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + (i + pre)).remove()
                    _this.loading = false
                    _this.$emit('loadingStatus', false)
                    return
                  }
                  _this.uploadImg(this.response, i + pre, i, imgPasteCount - pre)
                }
              }
              xhr.open('GET', srcArr[i])
              xhr.responseType = 'blob'
              xhr.send()
            } else {
              _this.loading = false
              _this.$emit('loadingStatus', false)
              _this.uploadImg('weblink', i + pre, i, imgPasteCount - pre)
              continue
            }
          }
        }
      })
      editor.on('SetContent', args => {
        // args.content = args.content.replace('style="position: fixed; top: 0px; width: 100px; height: 100px; overflow: hidden; opacity: 0; left: -100000px;"', '')
      })
    },
    closeConvertTip() { // 关闭转换提示
      var tipEl = document.getElementById('convertImgTip')
      if(tipEl) {
        tipEl.remove()
      }
    },
    convertImages(content) {
      var _this = this
      return new Promise((resolve, reject) => {
        if(!content){ reject() }
        var srcArr = []
        var backgroundArr = []
        // 匹配img标签 match是img标签 capture是src的值
        content = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
          // 存src的值
          srcArr.push(capture)
          return match
        })
        content = content.replace(/background(?:\-image)? *\:[^\:;\}]*url\(([^\)]+)\)/gi, function(match, capture) {
          // 存src的值
          backgroundArr.push(match)
          return match
        })
        var filterOptions = [
          '../',
          'blob',
          'data:image/',
          'oss-cn-shenzhen.aliyuncs.com',
          'knowledge-payment.oss-cn-beijing.aliyuncs.com',
          'ck-bkt-knowledge-payment.oss-cn-hangzhou.aliyuncs.com',
          'oss-cn-hangzhou.aliyuncs.com',
          'oss-cn-beijing.aliyuncs.com',
          'oss-cn-shanghai.aliyuncs.com',
          'oss-accelerate.aliyuncs.com'
        ]
        var isWebLinkImg = srcArr.filter(item => !(filterOptions.some(el => item.includes(el)))).length > 0
        var isBackgroundLink = backgroundArr.filter(item => !(filterOptions.some(el => item.includes(el)))).length > 0
        // console.log(isWebLinkImg, backgroundArr.filter(item => !(filterOptions.some(el => item.includes(el)))), 'wailianwailian')
        if((isWebLinkImg || isBackgroundLink) && _this.convertCount <= 3) { // 外链图片
          _this.convertCount++
          _this.loading = true
          _this.$emit('loadingStatus', true)
          imgConvert({ content: content }).then(res => {
            _this.loading = false
            _this.$emit('loadingStatus', false)
            // args.content = res.data.data // 重新赋值一下
            resolve(res.data.data)
            // debugger
            // console.log(args.content)
            // editor.setContent(oldContent + args.content)
          }).catch(() => {
            _this.convertCount = 0
            _this.loading = false
            _this.$emit('loadingStatus', false)
            reject()
          })
        }
      })
    },
    initTinymce() {
      // const newTextContent = this.value
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        fontsize_formats: '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px',
        lineheight_formats: '1 1.5 2 2.5 3',
        menubar: this.menubar,
        plugins: plugins,
        language: 'zh_CN',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'merge', // propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        // // CONFIG

        forced_root_block: 'p',
        force_p_newlines: true,
        importcss_append: true,

        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
        content_style: `
            *                         { padding:0; margin:0; }
            html, body                { padding: 5px;}
            img                       { display:block;height:auto; max-width:100%; display: block;}
            a                         { text-decoration: none; }
            div                       { white-space:pre-wrap;word-wrap:break-word;}
            iframe                    { width: 100%;  white-space:pre-wrap;word-wrap:break-word;}
            p                         { line-height:1.6; margin: 0px; white-space:pre-wrap;word-wrap:break-word;}
            table                     { white-space: pre-wrap; word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,

        insert_button_items: 'image link | inserttable',
        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '*[*]', // word需要它
        // paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: true, // 插入word文档需要该属性
        paste_webkit_styles: 'all',
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,

        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        style_formats: [
          {
            title: '首行缩进',
            block: 'p',
            styles: { 'text-indent': '2em' }
          },
          {
            title: '行高',
            items: [
              { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
              { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
              { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
              { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
              { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
            ]
          },
          {
            title: '字号',
            items: [
              { title: '10px', styles: { 'font-size': '10px' }, inline: 'span' },
              { title: '12px', styles: { 'font-size': '12px' }, inline: 'span' },
              { title: '14px', styles: { 'font-size': '14px' }, inline: 'span' },
              { title: '16px', styles: { 'font-size': '16px' }, inline: 'span' },
              { title: '18px', styles: { 'font-size': '18px' }, inline: 'span' },
              { title: '20px', styles: { 'font-size': '20px' }, inline: 'span' },
              { title: '22px', styles: { 'font-size': '22px' }, inline: 'span' },
              { title: '24px', styles: { 'font-size': '24px' }, inline: 'span' },
              { title: '26px', styles: { 'font-size': '26px' }, inline: 'span' },
              { title: '28px', styles: { 'font-size': '28px' }, inline: 'span' },
              { title: '30px', styles: { 'font-size': '30px' }, inline: 'span' },
              { title: '32px', styles: { 'font-size': '32px' }, inline: 'span' },
              { title: '34px', styles: { 'font-size': '34px' }, inline: 'span' },
              { title: '36px', styles: { 'font-size': '36px' }, inline: 'span' },
              { title: '38px', styles: { 'font-size': '38px' }, inline: 'span' },
              { title: '40px', styles: { 'font-size': '40px' }, inline: 'span' }
            ]
          }
        ],
        setup: function(editor) {
          // editor.on('init', () => {
          //   if (window.tinymce.get(_this.tinymceId)) {
          //     _this.$nextTick(() => window.tinymce.get(_this.tinymceId).setContent(_this.value))
          //   }
          // })
        },
        init_instance_callback: editor => {
          _this.convertCount = 0
          _this.contentEditCount = 0
          // 解决网络图片复制过来403（秀米的）背景图的不行，未解决
          try {
            var headEl = document.getElementById(_this.tinymceId + '_ifr').contentWindow.document.querySelector('head')
            var metaEl = document.createElement('meta')
            metaEl.setAttribute('name', 'referrer')
            metaEl.setAttribute('content', 'no-referrer')
            headEl.appendChild(metaEl)
          } catch {

          }
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
          window.tinymce.activeEditor.getBody().setAttribute('contenteditable', this.isEditabled)
          if (!this.isEditabled) {
            // 禁用的时候背景置灰
            editor.contentDocument.documentElement.style.background = '#f5f7f5'
            editor.contentDocument.activeElement.style.background = '#f5f7f5'
          }
          // 解决菜单menuBar遮挡问题
          var el = document.getElementsByClassName('mce-btn-has-text')
          for (var i = 0; i < el.length; i++) {
            // if (el[i].getAttribute('aria-label') == 'Font Sizes') {
            el[i].style.zIndex = 1
            // }
          }
          var spanEles = document.querySelectorAll('.mce-menubtn.mce-fixed-width span')
          for (var j = 0; j < spanEles.length; j++) {
            spanEles[j].style.width = 'auto'
          }
          _this.watchBeforeSetContent(editor)
        },
        paste_preprocess: (plugin, args) => {
          // 解决图片复制黏贴变成base64导致详情太大问题
          // 存在表格超出范围
          if (args.content.includes('<table')) {
            args.content = args.content.replace(/<table [^>]*width=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
              // table
              if (Number(capture) > 320) {
                capture = 0
              }
              match = '<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="' + capture + '">'
              return match
            })
          }
          // 图片word居中，在编辑器内不居中问题
          args.content = args.content.replace(/<p [^>]*style=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            // p
            match = match.replace('text-align: center; ', '')
            return match
          })
        }
      })
    },
    base64ToBlob(dataurl, filename) { // 转blob
      // return new Promise((res) => {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
      // })
    },
    // 上传复制黏贴的图片 直传阿里云
    uploadImg(BlobFile, count, i, totalCount) {
      if (BlobFile == 'weblink') { // 第三方的 先不传，但是successCount要++
        successCount++
        return
      }
      const that = this
      const fd = new FormData()
      this.uploadData.key = this.FideDir + 'root_admin-fe_' + encodeCompanyId() + '_tinymcePastes_' + this.randomString(20) + BlobFile.type
      // fd.append('avatar', BlobFile, 'image.png')
      // 阿里直传
      fd.append('key', this.uploadData.key)
      fd.append('policy', this.uploadData.policy)
      fd.append('OSSAccessKeyId', this.uploadData.OSSAccessKeyId)
      fd.append('success_action_status', this.uploadData.success_action_status)
      fd.append('callback', this.uploadData.callback)
      fd.append('signature', this.uploadData.signature)
      fd.append('file', BlobFile, 'image.png')
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const imgUrl = JSON.parse(this.response).data.url
          const docImg = document.getElementById(that.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + count)
          // if (docImg) {
          //   docImg.src = imgUrl
          // } else {
          //   setTimeout(() => {
          //     var container = document.getElementById(that.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + count)
          //     if (container) {
          //       container.src = imgUrl
          //     } else {
          //       that.loading = false
          //       that.$emit('loadingStatus', false)
          //     }
          //   }, 2000)
          // }
          const exitDom = new Promise((resolve, reject) => {
            if (docImg) {
              docImg.src = imgUrl
              resolve()
            }
          })
          const watchDom = new Promise((resolve, reject) => {
            let timer = null
            if (docImg) {
              clearInterval(timer)
              resolve()
            } else {
              timer = setInterval(() => {
                var container = document.getElementById(that.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + count)
                if (container) {
                  container.src = imgUrl
                } else {
                  that.loading = false
                  that.$emit('loadingStatus', false)
                }
              }, 1000)
            }
          })
          // Promise.race([exitDom, watchDom]).then(() => {
          //   successCount++
          //   if (successCount == totalCount) {
          //     successCount = 0
          //     that.isFirstUpload = true
          //     that.loading = false
          //     that.$emit('loadingStatus', false)
          //     // 给编辑器重新赋值一下
          //     window.tinymce.get(that.tinymceId).setContent(window.tinymce.get(that.tinymceId).getContent())
          //   }
          // })
          // successCount上传成功的个数 totalCount要上传的图片总数
          // 所有图片传成功后 不能重新赋值，分页符存的是<!- pagebreak >会自动转化成图片，会导致一直循环
          Promise.race([exitDom, watchDom]).then(() => {
            successCount++
            if (successCount == totalCount) {
              that.loading = false
              successCount = 0
              that.isFirstUpload = true
              that.$emit('loadingStatus', false)
            }
          })
        } else {
          if (this.readyState == 4) {
            that.isFirstUpload = true
            that.$message.error('您复制的内容中第' + (i + 1) + '张图保存失败，请点击上传按钮将此图片单独上传！')
            document.getElementById(that.tinymceId + '_ifr').contentWindow.document.getElementById('pastedImg' + count).remove()
            // window.tinymce.get(that.tinymceId).setContent('')
            that.loading = false
            successCount = 0
            that.$emit('loadingStatus', false)
          }
        }
      }
      xhr.open('POST', that.url, true)
      xhr.send(fd)
    },
    initTinymceNoPlugins() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        menubar: this.emptyMenubar,
        language: 'zh_CN',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'merge',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,

        powerpaste_html_import: 'merge', // propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_data_images: true, // 保存截图
        toolbar: [
          'undo redo styleformat bold italic underline strikethrough alignleft aligncenter alignright outdent indent subscript superscript',
          'mybutton'
        ],
        plugins: [
          'code powerpaste placeholder'
        ],
        setup: function(editor) {
          // 定义按钮，
          editor.addButton('mybutton', {
            // 按钮，名
            text: '',
            // 是否显示图标
            icon: false,
            // onclick事件
            onclick: function() {
              // 这里点击后会插入一句话
              // editor.insertContent('&nbsp;<b>It\'s my button!</b>&nbsp;')
            }
          })
          editor.on('focus', () => {
            _this.$nextTick(() => {
              if (document.getElementById(_this.tinymceId + 'tinymce-placeholder')) {
                document.getElementById(_this.tinymceId + 'tinymce-placeholder').innerText = ''
              }
            })
          })
          editor.on('blur', () => {
            _this.$nextTick(() => {
              if (document.getElementById(_this.tinymceId + 'tinymce-placeholder')) {
                document.getElementById(_this.tinymceId + 'tinymce-placeholder').innerText = _this.placeholderText
              }
            })
          })
        },
        content_style: `
          img                       { display:block;height:auto; max-width:100%; }

        `,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
          this.watchBeforeSetContent(editor)
        }
      })
    },
    // getImgSign() {
    //   imageSign({ type: 2 }).then(res => {
    //     if (res.data.statusCode == 200) {
    //       const curData = res.data.data
    //       this.url = curData.host
    //       this.uploadData = {
    //         'key': '',
    //         'policy': curData.policy,
    //         'OSSAccessKeyId': curData.accessid,
    //         'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
    //         'callback': curData.callback,
    //         'signature': curData.signature
    //       }
    //       this.FideDir = curData.dir
    //     }
    //   }).catch((err) => { console.log(err) })
    // },
    clickSign(index) {
      // 点击符号 往编辑器里插入符号
      const _this = this
      var sign = this.signType == 1 ? _this.allSign[index] : (this.signType == 2 ? _this.mathSign[index] : _this.englishSign[index])
      window.tinymce.get(_this.tinymceId).insertContent('<span>' + sign + '</span>')
      this.isShowSign = false
    },
    focusFun() {
      if (document.getElementById(this.tinymceId + 'tinymce-placeholder')) {
        document.getElementById(this.tinymceId + 'tinymce-placeholder').innerText = ''
      }
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    },
    randomString(len) {
      // 随机字符串
      len = len || 32
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const maxPos = chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    }
  },
  destroyed() {
    this.destroyTinymce()
    this.clearEditorStorage()
  },
  handleClick(tab, event) {
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 0px;
  /*z-index: 2005;*/
}
.word-number {
  position: absolute;
  right: 4px;
  bottom: 30px;
  color: #999;
}
.editor-upload-btn {
  display: inline-block;
}
.editor-preview-btn-container{
  position: absolute;
  right: 110px;
  top: 0px;
}

.sign-absolute {
  left: 10px;
  top: 32px;
  overflow: auto;
  cursor: pointer;
  color: #595959;
  line-height: 40px;
}
.sign-div-hover:hover{
  cursor: pointer;
  background-color: #409eff;
  color: #ffffff;
}
</style>
