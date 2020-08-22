<template>
  <div class="product-inquiry">
    <fileFolderComponent @seeFile="seeFile" :fileData="fileData" :fileAuth="fileAuth" class="product-file" @exposeToBusiness="exposeToBusiness"></fileFolderComponent>
    <productCatDetail @close="closeDetail" :editAuth="fileAuth" v-if="productCatDetailShow" :productCatData="productCatData"></productCatDetail>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import productCatDetail from '../../components/fileDetail/productCatDetail';
export default {
  name: 'productInquiry',

  components: { fileFolderComponent, productCatDetail },

  data: function () {
    return {
      fileData: [], // 文件数据
      productCatData: {}, // 产品分类详细数据
      productCatDetailShow: false, // 是否显示产品详细对话框
    }
  },

  computed: {
    fileAuth: function () {
      return this.$store.state.USER_STATUS == '2'
    }
  },

  mounted: function () {
    this.getData();
  },

  methods: {

    // 获取数据
    getData: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_PRODUCT_CATEGORY).then(this.getDataPromise);
    },

    // 获取数据  请求后的处理函数
    getDataPromise: function (res) {
      this.fileData = res.data;
    },

    // 文件夹的业务逻辑
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'new_folder' || order == 'new_file') {
        this.newProductCate(order, send);
      } else if (order == 'delete_file') {
        this.deleteProductCate(send);
      } else if (order == 'edit_file') {
        this.editFile(send);
      }
    },

    // 编辑产品分类
    editFile: function (data) {
      this.productCatDetailShow = true
      this.$store.commit('changeNowDialog', 'productCatDetail');
      let obj = { fid: data.id };
      this.productCatData = { fid: data.id };
    },

    // 查看产品
    seeFile: function (data) {
      this.productCatDetailShow = true
      this.$store.commit('changeNowDialog', 'productCatDetail');
      this.productCatData = data;
    },

    // 新增产品分类
    newProductCate: function (order, send) {
      send['file_type'] = order == 'new_folder' ? 0 : 1;
      this.$NORMAL_POST(this.$INTERFACE.NEW_PRODUCT_CATEGORY, send, 0, ['file_type']).then(this.operateFolderPromise);
    },

    // 操作文件夹后的操作
    operateFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
      if (res.needToRes['file_type'] == 1) {
        this.productCatDetailShow = true
        this.$store.commit('changeNowDialog', 'productCatDetail');
        let obj = { fid: res.data.id };
        this.productCatData = { fid: res.data.id };
      }
    },

    // 删除产品分类
    deleteProductCate: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DEL_PRODUCT_CATEGORY, send).then(this.operateFolderPromise);
    },

    // 关闭详细对话框
    closeDetail: function () {
      this.productCatDetailShow = false;
      this.$store.commit('changeNowDialog', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.product-file {
  padding: 20px 40px;
  width: 100%;
  height: 100%;
}
</style>