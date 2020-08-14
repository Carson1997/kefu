<template>
  <div class="file-folder-component">
    <filePathComponent :fileAuth="fileAuth" @newFolder="newFolder" @searchHandle="searchHandle" @switchFile="switchFile" :filePath="filePath" :fatherSearchInput="fatherSearchInput"></filePathComponent>
    <fileShowComponent @editFile="editFile" @seeFile="seeFile" :fileAuth="fileAuth" @deleteFile="deleteFile" @newFolder="newFolder" @switchFile="switchFile" :fileShowData="fileShowData"></fileShowComponent>
    <newfileDialog @closeHandle="closeHandle" @newFolderApply="newFolderApply" v-if="newfileDialog" :nowFile="fileShowData" :editFileData="editFileData"></newfileDialog>
  </div>
</template>

<script>
import filePathComponent from '../../components/file/filePathComponent';
import fileShowComponent from '../../components/file/fileShowComponent';
import newfileDialog from '../../components/newFileDetail/newfileDialog';
export default {
  name: 'fileFolderComponent',

  props: {
    fileData: { // 文件数据
      type: Array,
      required: true
    },
    fileAuth: { // 文件夹操作权限
      type: Boolean,
      required: true
    }
  },

  components: { filePathComponent, fileShowComponent, newfileDialog },

  watch: {
    fileData: function () {
      this.initFileData();
    }
  },

  data: function () {
    return {
      filePath: '', // 文件夹地址
      fileShowData: [], // 文件夹展示的数据
      fileDataObj: {}, // 文件层级数据
      allName: '全部文件', // 全部文件的名称
      fatherSearchInput: '', // 文件夹搜索的文字
      newfileDialog: false, // 新建文件框是否显示
      editFileData: '', // 目前修改的数据
    }
  },

  methods: {

    // 整理文件数据成为层级关系
    initFileData: function () {
      let allName = this.allName;
      if (this.filePath == '') {
        this.arrangeFilePath(this.allName);
      }
      let obj = {};
      obj[this.allName] = { name: this.allName, children: this.$PUBILC.changeArrToHierarchy(this.fileData) };
      this.fileDataObj = obj;
      this.arrangeFileData();
    },

    // 整理文件地址
    arrangeFilePath: function (path) {
      this.filePath = path;
    },

    // 整理展示的文件数据
    arrangeFileData: function () {
      let data = this.fileDataObj[this.allName]['children'];
      if (this.filePath != this.allName) {
        data = this.findFile(this.filePath).obj;
      }
      this.fileShowData = this.changeToArr(data);
    },

    // 通过层级关系寻找文件夹
    findFile: function (path) {
      let obj = this.fileDataObj;
      path = path.split('/');
      let fid;
      for (let i = 0; i < path.length; i++) {
        fid = obj[path[i]]['id'];
        obj = obj[path[i]]['children'];
      }
      return { fid: fid, obj: obj };
    },

    // 将数据转换为数组形式
    changeToArr: function (obj) {
      let arr = [];
      for (let i in obj) {
        if (Array.isArray(obj[i]['path']) == false) {
          obj[i]['path'] = obj[i]['path'].split('/');
        }
        arr.push(obj[i])
      }
      arr.sort(function (a, b) {
        if (a.file_type == '0') {
          return -1;
        }else {
          return 1;
        }
      })
      return arr;
    },

    // 跳转文件夹
    switchFile: function (path) {
      this.fatherSearchInput = '';
      this.arrangeFilePath(path);
      this.arrangeFileData();
    },

    // 查看文件
    seeFile: function (data) {
      this.$emit('seeFile', data);
    },

    // 搜索内容
    searchHandle: function (value) {
      this.fatherSearchInput = value;
      this.filePath = this.allName;
      let arr
      if (value != '') {
        arr = this.searchFile(value);
        this.fileShowData = arr;
      } else {
        this.arrangeFileData();
      }
    },

    // 搜索文件
    searchFile: function (value) {
      let arr = this.fileData.filter(item => {
        if (Array.isArray(item.path) == false) {
          item.path = item.path.split('/');
        }
        return item.name.indexOf(value) > -1;
      })
      return arr;
    },

    // 编辑或者新建文件夹
    newFolder: function (data) {
      this.newfileDialog = true;
      this.$store.commit('changeNowDialog', 'newfileDialog');
      this.editFileData = data;
    },

    // 关闭新建对话框
    closeHandle: function () {
      this.newfileDialog = false;
      this.editFileData = '';
    },

    // 确认弹框
    confirmBox: function (title, callback) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        callback();
      }).catch(function () {});
    },

    // 申请新建编辑文件夹
    newFolderApply: function (data) {
      let path = JSON.parse(JSON.stringify(this.filePath));
      let fid = this.findFile(path).fid;
      fid = fid == undefined ? 0 : fid;
      path = path.split('/');
      path.splice(0, 1, '');
      path.push(data.name);
      path = path.join('/');
      data['path'] = path;
      let order = data.file_type == '' ? 'new_folder' : 'new_file';
      this.exposeToBusiness(order, data);
    },

    // 删除文件
    deleteFile: function (data) {
      let _this = this;
      this.confirmBox('此操作将无法撤销', function () {
        let id = data.id;
        _this.exposeToBusiness('delete_file', { id: id });
      })
    },

    // 编辑文件
    editFile: function (data) {
      this.exposeToBusiness('edit_file', data);
    },

    // 暴露给业务的接口
    exposeToBusiness: function (order, data) {
      this.$emit('exposeToBusiness', { order: order, data: data });
    }

  }
}
</script>