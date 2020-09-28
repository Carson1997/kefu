<!-- 素材预览 -->
<template>
  <el-dialog title="预览多媒体文件" :visible="dialogVis" width="98%" :before-close="handleClose" top="3vh" :close-on-click-modal="false">
    <div class="peview-area" v-bind:style="{ height: peviewAreaHeight + 'px' }">
      <img v-if="imgSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1" class="preview-detail" :src="baseIp + previewData"/>
      <!-- <iframe class="preview-detail" :src="baseName + previewData"  v-if="officeSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1"></iframe> -->
      <iframe class="preview-detail" :src="baseIp + previewData"  v-if="IframeSuffix.indexOf(previewData.substring(previewData.lastIndexOf('.'))) > -1"></iframe>
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
      peviewAreaHeight: document.body.clientHeight - 120,
      baseIp: 'http://192.168.1.5/binghuo_information/', // 服务器ip地址
      // baseName: 'https://view.officeapps.live.com/op/view.aspx?src=http://service.miniice.cn/binghuo_information/',
      imgSuffix: ['.jpg', '.png', '.jpeg', '.gif'],
      officeSuffix: ['.xls', '.csv', '.xlsx', '.doc', '.ppt', '.docx', '.pptx'],
      IframeSuffix: ['.pdf'],
      videoSuffix: ['.mp4', '.mpeg4', '.avi', '.mov', '.rmvb', '.rm', '.flv', '.mp3', '.mpeg3', '.wma', '.ogg'],
    }
  },

  mounted: function () {
    this.arrangeIp();
  },

  methods: {

    // 适配当前ip
    arrangeIp: function () {
      if (window.location.host == '192.168.1.20') {
        this.baseIp = 'http://192.168.1.5/binghuo_information/';
      } else if (window.location.host == '183.239.34.128:808') {
        this.baseIp = 'http://183.239.34.128:818/binghuo_information/';
      }
    },

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
  height: 99%;
  border: none;
}
</style>