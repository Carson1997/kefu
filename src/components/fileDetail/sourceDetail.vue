<!-- 素材预览 -->
<template>
  <el-dialog title="预览多媒体文件" :visible="dialogVis" width="98%" :before-close="handleClose" top="3vh" :close-on-click-modal="false">
    <div class="peview-area" v-bind:style="{ height: peviewAreaHeight + 'px' }">
      <img v-if="imgSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1" class="preview-detail" :src="baseIp + previewData"/>
      <iframe class="preview-detail" :src="baseName + previewData"  v-if="officeSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1"></iframe>
      <video controls="controls" v-if="videoSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1" class="preview-detail" :src="baseIp + previewData"></video>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'sourceDetail.vue',

  computed: {
    dialogVis: function () {
      if (this.$store.state.NOW_OPEN_DIALOG == "sourceDetail") {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'previewData' ], 

  data: function () {
    return {
      peviewAreaHeight: document.body.clientHeight - 140,
      baseIp: 'http://service.miniice.cn/binghuo_information/', // 服务器ip地址
      baseName: 'https://view.officeapps.live.com/op/view.aspx?src=http://service.miniice.cn/binghuo_information/',
      imgSuffix: ['.jpg', '.png', '.jpeg', '.gif'],
      officeSuffix: ['.xls', '.csv', '.xlsx', '.doc', '.ppt', '.docx', '.pptx', '.pdf'],
      videoSuffix: ['.mp4', '.mpeg4', '.avi', '.mov', '.rmvb', '.rm', '.flv', '.mp3', '.mpeg3', '.wma', '.ogg'],
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    }

  }
}
</script>

<style lang="scss" scoped>
.peview-area {
  width: 100%;
  overflow: auto;
  border-top: solid 1px lightgray;
}
.preview-detail {
  width: 100%;
  height: 100%;
  border: none;
}
</style>