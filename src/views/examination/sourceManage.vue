<template>
  <div id="sourceManage" class="source-manage">
    <fileFolderComponent @seeFile="seeFile" :fileIsCanEdit="fileIsCanEdit" @exposeToBusiness="exposeToBusiness" :fileData="fileData" :fileAuth="fileAuth" class="source-file"></fileFolderComponent>
    <newSourceDialog v-if="newSourceDialogShow" @newFileHandle="newFileHandle" :sourceData="sourceData"></newSourceDialog>
    <sourceDetail @close="closeHandle" v-if="sourceDetailShow" :previewData="previewData"></sourceDetail>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import newSourceDialog from '../../components/newFileDetail/newSourceDialog';
import sourceDetail from '../../components/fileDetail/sourceDetail';
export default {
  name: 'sourceManage',

  components: { fileFolderComponent, newSourceDialog, sourceDetail },

  mounted: function () {
    this.getData();
  },

  data: function () {
    return {
      fileData: [], // 文件夹数据
      fileIsCanEdit: false, // 文件能否被编辑
      addComponent: 'uploadController', // 创建文件时添加的组件
      sourceData: '', // 资源
      newSourceDialogShow: false, // 显示新建素材的对话框
      sourceDetailShow: false, // 是否显示预览素材框
      previewData: '', // 预览的数据
    }
  },

  computed: {
    fileAuth: function () {
      if (this.$store.state.USER_STATUS == '2') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {

    // 获取文件夹数据
    getData: function () {
      let url = this.$INTERFACE.ALL_SOURCE;
      this.$NORMAL_POST(url).then(this.getDataPromise);
    },

    // 获取文件夹数据  请求后的处理函数
    getDataPromise: function (res) {
      this.fileData = res.data;
    },

    // 文件夹组件暴露给业务的接口
    exposeToBusiness: function (data) {
      let order = data.order; // 指令
      let send = data.data; // 传输过来的数据
      if (order == 'new_folder') { // 新建文件夹
        this.newFolder(send);
      } else if (order == 'delete_file') {
        this.deleteFile(send);
      } else if (order == 'new_file') {
        this.newFile(send);
      }
    },

    // 新建文件
    newFile: function (data) {
      this.newSourceDialogShow = true;
      this.$store.commit('changeNowDialog', 'newSourceDialog');
      this.sourceData = data;
    },

    // 新建文件  监听函数
    newFileHandle: function (data) {
      let url = this.$INTERFACE.NEW_SOURCE;
      this.$NORMAL_POST(url, data).then(this.newFileHandlePromise);
    },

    // 新建文件  请求后的处理函数
    newFileHandlePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.newSourceDialogShow = false;
      this.getData();
    },

    // 新建文件夹
    newFolder: function (send) {
      let url = this.$INTERFACE.NEW_SOURCE;
      this.$NORMAL_POST(url, send).then(this.newFolderPromise);
    },

    // 新建文件夹  请求后的处理函数
    newFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    },

    // 删除文件夹或者文件
    deleteFile: function (data) {
      let url = this.$INTERFACE.DELETE_SOURCE;
      this.$NORMAL_POST(url, data).then(this.deleteFilePromise);
    },

    // 删除文件夹或文件  请求后的处理函数
    deleteFilePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.newSourceDialogShow = false;
      this.getData();
    },

    // 预览文件
    seeFile: function (data) {
      let fid = data.fid;
      let arr = this.fileData.filter(item => {
        return item.id == fid;
      })
      let file = arr[0].file;
      this.sourceDetailShow = true;
      this.$store.commit('changeNowDialog', 'sourceDetail');
      this.previewData = file;
    },

    // 关闭预览对话框
    closeHandle: function () {
      this.sourceDetailShow = false;
      this.$store.commit('changeNowDialog', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.source-file {
  width: 100%;
  height: 100%;
 }
</style>