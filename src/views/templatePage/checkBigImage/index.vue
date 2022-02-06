<template>
    <div>
         <el-dialog
          title='查看大图'
      :visible.sync="showPreviewImg"
      append-to-body
       custom-class="c-max-width700 dialogTitle"
    width="720px"    
    :close-on-click-modal="false" @close='close'>
      <div class='c-textAlign-c c-max-width700'>
        
        <img :src="dialogImage.url" alt="" style="max-width:600px" class="pointer">    
        <div class='c-textAlign-c'>{{dialogImage.name}}</div>    
      </div>
    </el-dialog>
    </div>
</template>
<script>
export default {
  props: {
    showPreviewImg: {
      default: false,
      type: Boolean
    },
    dialogImage: {
      type: Object,
      default: {
        url: '',
        name: ''
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    close() {
      this.$emit('closeBigImage')
    }
  }
}
</script>
