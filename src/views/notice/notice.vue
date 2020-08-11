<template>
  <div id="notice">
    <div class="notice-detail">
      <fileFolderComponent :newFileType="newFileType" :fileFolderData="fileFolderData" :fileControlAuth="fileControlAuth" class="notice-folder"></fileFolderComponent>
    </div>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
export default {
  name: 'notice',

  components: { fileFolderComponent },

  data: function() {
    return {
      fileFolderData: [], // 文件夹的数据
      fileControlAuth: false, // 文件夹的控制权限
      newFileType: 'newNotice', // 新建文件的类型
    }
  },

  mounted: function () {
    this.getNoticeDetailData();
  },

  methods: {

    // 获取知识库数据
    getNoticeDetailData: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_CATEGORY).then(this.getNoticeDetailDataPromise);
    },

    // 获取知识库数据  请求后的处理函数
    getNoticeDetailDataPromise: function (res) {
      this.fileFolderData = res.data;
    }

  }
}

</script>

<style lang="scss" scoped>
.notice-detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 40px;
}

.notice-folder {
  width: 100%;
  height: 100%;
}
</style>