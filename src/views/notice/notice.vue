<template>
  <div id="notice">
    <div class="notice-detail">
      <fileFolderComponent  class="notice-folder" @exposeToBusiness="exposeToBusiness" :fileData="fileData"></fileFolderComponent>
    </div>
    <newNoticeDetail></newNoticeDetail>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import newNoticeDetail from '../../components/newFileDetail/newNoticeDetail';
export default {
  name: 'notice',

  components: { fileFolderComponent, newNoticeDetail },

  data: function() {
    return {
      fileData: [], // 文件夹的数据
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
      this.fileData = res.data;
    },

    // 组件暴露到业务层的方法
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'new_file') {
        this.newNotice(send);
      } else if (order == 'delete_file') {
        this.deleteNotice(send);
      }
    },

    // 新建知识库详细
    newNotice: function (send) {
      send['file_type'] = 1;
      this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.newNoticeHandle);
    },
    
    // 编辑后的处理函数
    newNoticeHandle: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getNoticeDetailData();
      this.$store.commit('changeNowDialog', 'newNoticeDetail');
    },

    // 删除知识库文章
    deleteNotice: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DELETE_CATEGORY, send).then(this.deleteNoticePromise);
    },

    // 删除知识库文章  请求后的处理函数
    deleteNoticePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getNoticeDetailData();
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