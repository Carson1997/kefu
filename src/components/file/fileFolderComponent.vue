<!-- 文件夹组件 -->
<template>
  <div class="file-folder-component">
    <filePathComponent :fatherNowFileArrange="fatherNowFileArrange" :isFileArrange="isFileArrange" @fileArrange="fileArrange" :fileAuth="fileAuth" @newFolder="newFolder" @searchHandle="searchHandle" @switchFile="switchFile" :filePath="filePath" :fatherSearchInput="fatherSearchInput"></filePathComponent>
    <fileShowComponent :showCode="showCode" :rankingType="rankingType" @customClick="customClick" :customButton="customButton" @dragend="dragend" @dragstart="dragstart" :isCanDrag="isCanDrag" :isCanEdit="fileIsCanEdit" @editFile="editFile" @seeFile="seeFile" :fileAuth="fileAuth" @deleteFile="deleteFile" @newFolder="newFolder" @switchFile="switchFile" :fileShowData="fileShowData"></fileShowComponent>
    <newfileDialog :fileAuth="newFileAuth" :fileGrouping="newFileGroup" @closeHandle="closeHandle" @newFolderApply="newFolderApply" v-if="newfileDialog" :nowFile="fileShowData" :editFileData="editFileData"></newfileDialog>
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
    },
    fileIsCanEdit: { // 文件能否编辑
      type: Boolean,
      required: false,
      default: true,
    },
    isCanDrag: { // 文件能否拖拉
      type: Boolean,
      required: false,
      default: false,
    },
    customButton: { // 自定义按钮
      type: Object,
      required: false,
    },
    isFileArrange: { // 是否显示文件排行选项
      type: Boolean,
      required: false,
      default: false,
    },
    showCode: { // 是否显示二维码
      type: Boolean,
      required: false,
      default: false
    }
  },

  components: { filePathComponent, fileShowComponent, newfileDialog },

  data: function () {
    return {
      filePath: '', // 文件夹地址
      fileShowData: [], // 文件夹展示的数据
      fileDataObj: {}, // 文件层级数据
      allName: '全部文件', // 全部文件的名称
      fatherSearchInput: '', // 文件夹搜索的文字
      newfileDialog: false, // 新建文件框是否显示
      editFileData: '', // 目前修改的数据
      rankingType: '', // 文件排行的根据
      fatherNowFileArrange: '', // 当前文件排行方式
      nowLevelData: [], // 现在的数据
      newFileAuth: '', // 新建文件时父文件夹的权限
      newFileGroup: '' // 新建文件时父文件夹的群组
    }
  },

  watch: {
    fileData: function () {
      if (this.fatherNowFileArrange == '') {
        this.initFileData();
      } else {
        this.fileArrange(this.fatherNowFileArrange);
      }
    }
  },

  mounted: function () {
    if (this.isFileArrange == true) { // 选择显示文件排行方式
      this.fatherNowFileArrange = 'month_click';
      this.fileArrange('month_click');
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
      this.nowLevelData = this.fileShowData;
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
      if (value == '') { // 无搜索内容
        if (this.fatherNowFileArrange == '' || this.fatherNowFileArrange == 'all') { // 显示全部
          this.arrangeFileData();
        } else { // 显示当前的部分
          this.fileArrange(this.fatherNowFileArrange);
        }
      } else { // 有搜索内容
        if (this.fatherNowFileArrange == '' || this.fatherNowFileArrange == 'all') { // 在全部中搜索
          arr = this.searchFile(value);
        } else { // 在当前部分搜索
          arr = this.searchFileCurrent(value);
        }
        this.fileShowData = arr;
      }
    },

    // 在全部文件中搜索文件
    searchFile: function (value) {
      let arr = this.fileData.filter(item => {
        if (Array.isArray(item.path) == false) {
          item.path = item.path.split('/');
        }
        return (item.name.indexOf(value) > -1) || (item.keyword != undefined && item.keyword.indexOf(value) > -1) || (item.showId != undefined && item.showId.indexOf(value) > -1);
      })
      return arr;
    },

    // 在当前文件中搜索文件
    searchFileCurrent: function (value) {
      let arr = this.nowLevelData.filter(item => {
        if (Array.isArray(item.path) == false) {
          item.path = item.path.split('/');
        }
        return (item.name.indexOf(value) > -1) || (item.keyword != undefined && item.keyword.indexOf(value) > -1) || (item.showId != undefined && item.showId.indexOf(value) > -1);
      })
      return arr;
    },

    // 编辑或者新建文件夹
    newFolder: function (data) {
      let obj = this.findFatherAuth();
      data.authority = obj.authority;
      data.grouping = obj.grouping;
      this.newfileDialog = true;
      this.$store.commit('changeNowDialog', 'newfileDialog');
      this.editFileData = data;
    },

    // 寻找当前文件夹的权限
    findFatherAuth: function () {
      let obj = JSON.parse(JSON.stringify(this.fileDataObj));
      let path = this.filePath.split('/');
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]]['children'];
      }
      obj = obj[path[path.length - 1]];
      return {
        authority: obj.authority == undefined ? '' : obj.authority,
        grouping: obj.grouping == undefined ? [] : obj.grouping.split(',')
      }
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
      data['fid'] = fid;
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

    // 文件显示组件文件开始拖拉
    dragstart: function (data) {
      this.exposeToBusiness('dragstart', data);
    },

    // 文件显示组件拖拉结束
    dragend: function () {
      this.exposeToBusiness('dragend');
    },

    // 自定义点击
    customClick: function (data) {
      this.exposeToBusiness(data.order, data.data);
    },

    // 改变文件排序
    fileArrange: function (order) {
      this.fatherSearchInput = '';
      this.fatherNowFileArrange = order;
      this.rankingType = order;
      let arr = this.filterFile();
      let data;
      if (order == 'all') {
        this.rankingType = '';
        this.initFileData();
      }else if (order == 'topping') {
        data = this.filterTopFile(arr);
        this.fileShowData = data;
        this.nowLevelData = this.fileShowData;
      } else if (order == 'week_click' || order == 'month_click' || order == 'total_click') {
        data = this.fileRanking(arr, order);
        this.fileShowData = data;
        this.nowLevelData = this.fileShowData;
      } else if (order == 'date') {
        data = this.fileTimeRanking(arr, order);
        this.fileShowData = data;
        this.nowLevelData = this.fileShowData;
      }
    },

    // 过滤文件
    filterFile: function () {
      let arr = this.fileData.filter(item => {
        return item.file_type == '1';
      })
      return arr;
    },

    // 过滤置顶文件
    filterTopFile: function (arr) {
      let data = arr.filter(item => {
        return item.top == '1'
      })
      return data;
    },

    // 文件点击次数排行
    fileRanking: function (data, attr) {
      data.sort(function (a, b) {
        return b[attr] - a[attr];
      })
      return data;
    },

    // 文件时间排序
    fileTimeRanking: function (data, attr) {
      data.sort(function (a, b) {
        return new Date(b[attr]).getTime() - new Date(a[attr]).getTime();
      })
      return data;
    },

    // 暴露给业务的接口
    exposeToBusiness: function (order, data) {
      this.$emit('exposeToBusiness', { order: order, data: data });
    }

  }
}
</script>