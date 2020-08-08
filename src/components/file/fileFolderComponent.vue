<!-- 文件夹面向业务的封装 -->
<template>
  <div class="file-folder-component">

    <!-- 文件控制区域-->
    <fileControlComponent class="fileControlComponent" @search="searchHandle" @newFolder="newFolder" :fileControlAuth="fileControlAuth" :fatherSearchInput="searchInput"></fileControlComponent>

    <!-- 文件路径区域 -->
    <filePathComponent @switchFolder="switchFolder" class="filePathComponent" :filePathData="filePathData"></filePathComponent>

    <!-- 文件展示区域 -->
    <fileShowComponent @deleteFolder="deleteFolder" @newFolder="newFolder" @switchFolder="switchFolder" class="fileShowComponent" :searchInput="searchInput" :fileData="fileData" :fileControlAuth="fileControlAuth"></fileShowComponent>

  </div>
</template>

<script>

import fileControlComponent from '../../components/file/fileControlComponent';
import filePathComponent from '../../components/file/filePathComponent';
import fileShowComponent from '../../components/file/fileShowComponent';

export default {
  name: 'fileFolderComponent',
  
  components: { fileControlComponent, filePathComponent, fileShowComponent },

  props: {
    fileFolderData: { // 文件夹数据 -- 必须传入
      type: Array,
      required: true
    },
    fileControlAuth: { // 文件夹操作权限  -- 必须传入
      type: Boolean,
      required: true
    }
  },

  watch: {
    fileFolderData: function () {
      this.init();
    }
  },

  data: function () {
    return {
      fileFolderDataObj: '', // 文件数据的对象形式
      filePathData: [], // 文件路径位置
      fileData: {}, // 展示的文件数据
      searchInput: '', // 搜索框输入
      fileFolderLevelData: {}, // 分层级的文件夹数据
    }
  },

  methods: {

    // 初始化
    init: function () {
      let hierarchy = this.$PUBILC.changeArrToHierarchy(this.fileFolderData);
      let obj = hierarchy.returnObj;
      this.fileFolderDataObj = hierarchy.all;
      this.fileFolderLevelData = { '全部文件': { id: 0, name: '全部文件', father: '-', fileType: 1, children: obj } };
      if (this.filePathData.length == 0) { // 初级文件夹
        this.fileData = Object.keys(this.fileFolderLevelData['全部文件']['children']).length == 0 ? undefined : this.fileFolderLevelData['全部文件']['children'];
        this.filePathData.push('全部文件');
      } else { // 非初级文件夹
        let path = this.filePathData; // 当前文件路径
        this.switchFolder({ path: path });
      }
    },

    // 搜索 处理函数 -- 搜索文件
    searchHandle: function (searchData) {
      let fileFolderData = this.fileFolderData
      let _this = this;
      let searchInput = searchData.searchInput;
      this.searchInput = searchInput;
      let searchArr = [];
      if (searchInput == '') {
        this.switchFolder({ path: ['全部文件'] });
      } else {
        for(let i in fileFolderData) {
          if (fileFolderData[i].name.indexOf(searchInput) > -1) {
            let arr = _this.getPath(fileFolderData[i]);
            searchArr.push({ id: fileFolderData[i].id, name: fileFolderData[i].name, path: arr, fileType: fileFolderData[i].fileType });
          }
        }
        this.filePathData = ['全部文件 (搜索:' + searchInput + ')'];
        this.fileData = searchArr;
      }
    },

    // 搜索时寻找文件的路径
    getPath: function (data) {
      let arr = [];
      let id = data.id;
      while(id != 0) {
        if(this.fileFolderDataObj[id]['fid'] != 0) {
          arr.unshift(this.fileFolderDataObj[this.fileFolderDataObj[id]['fid']]['name']);
          id = this.fileFolderDataObj[id]['fid'];
        } else {
          id = 0;
        }
      }
      arr.unshift('全部文件');
      return arr;
    },

    // 根据路径取得文件夹的内容
    switchFolder: function (data) {
      if (this.searchInput != '') {
        this.$alert('当前已是搜索' + this.searchInput + '的列表', '标题名称', {confirmButtonText: '确定', callback: action => {}});
      } else {
        this.searchInput = '';
        let path = data.path;
        let obj = this.fileFolderLevelData;
        for (let i in path) {
          obj = obj[path[i]]['children'] == undefined ? {} : obj[path[i]]['children'];
        }
        for (let i in obj) {
          obj[i]['path'] = path;
        }
        this.fileData = Object.keys(obj).length == 0 ? undefined : JSON.parse(JSON.stringify(obj));
        this.filePathData = path;
      }
    },

    // 新建文件夹
    newFolder: function (data) {
      this.searchInput = '';
      let _this = this;
      let obj = this.fileFolderLevelData;
      let pathData = JSON.parse(JSON.stringify(this.filePathData));
      for (let i = 0; i < pathData.length - 1; i++) {
        obj = obj[pathData[i]]['children'];
      }
      obj = obj[pathData[pathData.length - 1]];
      obj['children'] == undefined ? obj['children'] = {} : '';
      let send = { name: data.name, fid: obj.id, path: pathData.splice(1) };
      send['id'] = data['id'] == undefined ? undefined : data['id'];
      if (Object.keys(obj['children']).indexOf(data.name) > -1) { // 同名
        this.$confirm('该目录下已存在同名文件, 是否继续添加', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          send['name'] = send['name'] + '_' + new Date().getTime();
          send['path'].push(send['name']);
          send['path'] = '/' + send['path'].join('/');
          _this.exposeToBusiness('newFolder', send);
        }).catch(function () {});
      } else {
        send['path'].push(send['name']);
        send['path'] = '/' + send['path'].join('/');
        this.exposeToBusiness('newFolder', send);
      }
    },

    // 删除文件夹
    deleteFolder: function (data) {
      this.searchInput = '';
      let send = { id: data.id };
      this.exposeToBusiness('deleteFolder', send);
    },
 
    // 请求业务逻辑  与接口交互
    exposeToBusiness: function (oder, orderData) {
      this.$emit('exposeToBusiness', { order: oder, data: orderData });
    },
    
  }
}
</script>

<style lang="scss" scoped>
.fileControlComponent {
  width: 100%;
  margin-bottom: 15px;
}
.filePathComponent {
  width: 100%;
  margin-bottom: 15px;
}
.fileShowComponent {
  width: 100%;
  height: calc(100% - 90px);
  border: solid 1px #f0f0f0;
  box-shadow: 0 0 1px #bebebe;
}
</style>