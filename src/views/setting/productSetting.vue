<template>
  <div id="productSetting">
    <fileFolderComponent class="product-file" :fileData="fileData" @exposeToBusiness="exposeToBusiness"></fileFolderComponent>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
export default {
  name: 'productSetting',

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
      this.$NORMAL_POST(this.$INTERFACE.ALL_PRODUCT_CATEGORY).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求的处理函数
    getTableDataPromise: function (res) {
      this.fileData = res.data;
    },

    // 文件夹的业务逻辑
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'new_folder') {
        this.newProductCate(send);
      } else if (order == 'delete_file') {
        this.deleteProductCate(send);
      }
    },

    // 新增产品分类
    newProductCate: function (send) {
      send['file_type'] = 0;
      this.$NORMAL_POST(this.$INTERFACE.NEW_PRODUCT_CATEGORY, send).then(this.operateFolderPromise);
    },

    // 操作文件夹后的操作
    operateFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTableData();
    },

    // 删除产品分类
    deleteProductCate: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DEL_PRODUCT_CATEGORY, send).then(this.operateFolderPromise);
    },
  }


}
</script>

<style lang="scss" scoped>
.product-file {
  width: 100%;
  height: 100%;
}
</style>