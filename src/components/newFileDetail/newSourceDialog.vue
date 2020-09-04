<!-- 新建素材文件  上传文件 -->
<template>
  <el-dialog title="上传素材文件" :visible="dialogVisible" :show-close="false" :close-on-click-modal="false" width="30%" :before-close="handleClose">
    <div class="upload-area">
      <div class="each-message">
        <span class="name">文件名: </span>
        <el-input class="value" v-model="sourceData.name" :disabled="true"></el-input>
        <div class="clear"></div>
      </div>
      <uploadController class="uploadController" @uploadSuccess="uploadSuccess"></uploadController>
      <span class="source-path">{{ sourcePath }}</span>
      <div class="clear"></div>
      <el-button type="success" size="mini" plain class="button" :disabled="sourcePath == ''" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import uploadController from '../upload/uploadController';
export default {
  name: 'newSourceDialog',

  components: { uploadController },

  props: [ 'sourceData' ],

  data: function () {
    return {
      sourcePath: '', // 文件的地址
    }
  },

  computed: {

    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newSourceDialog') {
        return true;
      } else {
        return false;
      }
    },

  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
    },

    // 文件上传成功  处理函数
    uploadSuccess: function (data) {
      this.sourcePath = data.data;
    },

    // 上传绑定文件
    submit: function () {
      let obj = JSON.parse(JSON.stringify(this.sourceData));
      obj['file'] = this.sourcePath;
      this.$emit('newFileHandle', obj);
      this.handleClose();
    }

  }
}
</script>

<style lang="scss" scoped>
.upload-area {
  width: 100%;
  padding: 20px;
  border-top: solid 1px lightgray;
}

.uploadController {
  float: left;
}

.source-path {
  width: calc(100% - 150px);
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 30px;
  margin-left: 20px;
}

.button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}

.each-message {
  margin-top: 10px;
  margin-bottom: 20px;
}

.each-message .name {
  width: 80px;
  float: left;
  line-height: 40px;
  text-align: center;
}

.each-message .value {
  width: calc(100% - 150px);
  float: left;
}
</style>