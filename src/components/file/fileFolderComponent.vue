<template>
  <div class="file-folder-component">
    <filePathComponent @newFolder="newFolder" @searchHandle="searchHandle" @switchFile="switchFile" :filePath="filePath" :fatherSearchInput="fatherSearchInput"></filePathComponent>
    <fileShowComponent @deleteFile="deleteFile" @newFolder="newFolder" @switchFile="switchFile" :fileShowData="fileShowData"></fileShowComponent>
  </div>
</template>

<script>
import filePathComponent from '../../components/file/filePathComponent';
import fileShowComponent from '../../components/file/fileShowComponent';
export default {
  name: 'fileFolderComponent',

  props: {
    fileData: { // 文件数据
      type: Array,
      required: true
    }
  },

  components: { filePathComponent, fileShowComponent },

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
      return arr;
    },

    // 跳转文件夹
    switchFile: function (path) {
      this.fatherSearchInput = '';
      this.arrangeFilePath(path);
      this.arrangeFileData();
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
      let id = data == undefined ? undefined : data.id;
      let value = data == undefined ? undefined : data.value;
      this.promptBox('文件夹名称', id, value, this.fileNameCheck)
    },

    // 弹出输入提示框
    promptBox: function (title, id, value, callback) {
      this.$prompt('请输入' + title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value,
      }).then(function (value) {
        callback(id, value.value)
      }).catch();
    },

    // 提示弹框
    alertBox: function (content) {
      this.$alert(content, '提示', { confirmButtonText: '确定' })
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

    // 文件名检测
    fileNameCheck: function (id, value) {
      for (let i in this.fileShowData) {
        if (this.fileShowData[i]['name'] == value) {
          this.alertBox('该文件夹下存在同名文件或者文件夹');
          return false;
        }
      }
      this.newFolderApply(id, value);
    },

    // 申请新建编辑文件夹
    newFolderApply: function (id, name) {
      let path = JSON.parse(JSON.stringify(this.filePath));
      let fid = this.findFile(path).fid;
      fid = fid == undefined ? 0 : fid;
      path = path.split('/');
      path.splice(0, 1, '');
      path.push(name);
      path = path.join('/');
      let send = { id: id, name: name, path: path, fid: fid };
      this.exposeToBusiness('new_folder', send)
    },

    // 删除文件
    deleteFile: function (data) {
      let _this = this;
      this.confirmBox('此操作将无法撤销', function () {
        let id = data.id;
        _this.exposeToBusiness('delete_file', { id: id });
      })
    },

    // 暴露给业务的接口
    exposeToBusiness: function (order, data) {
      this.$emit('exposeToBusiness', { order: order, data: data });
    }

  }
}
</script>