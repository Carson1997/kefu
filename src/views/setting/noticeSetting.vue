<template>
  <div id="noticeSetting">
    <fileFolderComponent class="notice-file" @exposeToBusiness="exposeToBusiness" :fileFolderData="fileFolderData" :fileControlAuth="fileControlAuth"></fileFolderComponent>
  </div>
</template>

<script>

import fileFolderComponent from '../../components/file/fileFolderComponent';
export default {
  name: 'noticeSetting',

  components: { fileFolderComponent },

  data: function () {
    return {
      fileFolderData: [],
      fileControlAuth: true, // 文件夹操作权限
      receiveFrombusiness: {}, // 业务逻辑传入组件的数据
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

    // 文件夹的业务逻辑
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'newFolder') {
        this.newCate(send);
      } else if (order == 'deleteFolder') {
        this.delCate(send);
      }
    },

    // 创建新的分类
    newCate: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.operateFolderPromise);
    },

    // 删除分类
    delCate: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DELETE_CATEGORY, send).then(this.operateFolderPromise);
    },

    // 操作文件夹后的操作
    operateFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTableData();
    },

    // 获取表格数据  请求的处理函数
    getTableDataPromise: function (res) {
      this.fileFolderData = res.data;
    }
    
  }
}
</script>

<style lang="scss" scoped>
.notice-file {
  width: 100%;
  height: 100%;
}
</style>