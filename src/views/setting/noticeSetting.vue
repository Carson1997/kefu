<template>
  <div id="noticeSetting">
    <fileFolderComponent class="notice-setting" :fileData="fileData" @exposeToBusiness="exposeToBusiness"></fileFolderComponent>
  </div>
</template>

<script>

import fileFolderComponent from '../../components/file/fileFolderComponent';
export default {
  name: 'noticeSetting',

  components: { fileFolderComponent },

  data: function () {
    return {
      fileData: [], // 文件数据
    }
  },

  mounted: function () {
    this.getTableData();
  },

  methods: {

    // 获取表格数据
    getTableData: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_CATEGORY).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求的处理函数
    getTableDataPromise: function (res) {
      this.fileData = res.data;
    },

    // 接收组件命令  通向业务逻辑
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'new_folder') {
        this.newNotice(send);
      } else if (order == 'delete_file') {
        this.deleteNotice(send);
      }
    },

    // 新建知识库分类
    newNotice: function (send) {
      send['file_type'] = 0;
      this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.editHandle);
    },

    // 删除知识库分类
    deleteNotice: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DELETE_CATEGORY, send).then(this.editHandle);
    },
    
    // 编辑后的处理函数
    editHandle: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTableData();
    }
    
  }
}
</script>

<style lang="scss" scoped>
.notice-setting {
  width: 100%;
  height: 100%;
}
</style>