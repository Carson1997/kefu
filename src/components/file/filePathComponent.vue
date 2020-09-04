<template>
  <div class="file-path-component">
    <div class="file-controller">
      <el-button class="control-button" v-if="fileAuth" type="primary" size="small" plain @click="newFolder(0)" :disabled="searchInput != '' || nowFunc != 'all'">新建文件夹</el-button>
      <el-button class="control-button" v-if="fileAuth" type="success" size="small" plain :disabled="searchInput != '' || nowFunc != 'all'" @click="newFolder(1)">新建文件</el-button>
      <el-input class="control-input" placeholder="请输入文件名, 关键字，或文章编码搜索" v-model="searchInput" @input="searchHandle">
        <template slot="append">
          <span class="el-icon-search"></span>
        </template>
      </el-input>
      <div class="file-arrange" id="fileArrange" v-if="isFileArrange">
        <div class="file-arrange-name">文件排行: </div>
        <div class="file-arrange-body">
          <div class="each-arrange" v-for="(item, index) in functionData" :key="index" @click="changeFunc(item.order)">
            {{ item.name }}
            <span v-if="nowFunc == item.order" class="el-icon-check"></span>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="file-path" v-if="nowFunc == 'all'">
      <span class="each-path" v-for="(item, index) in path" :key="index">
        <span class="path-name" @click="switchFile(index)">{{ item }}</span>
        <span class="next-icon" v-if="index + 1 < path.length"> > </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filePathComponent',

  props: { 
    filePath: {
      type: String,
      required: true
    },
    fatherSearchInput: {
      type: String,
      required: true
    },
    fileAuth: { // 文件夹操作权限
      type: Boolean,
      required: true
    },
    isFileArrange: { // 是否显示文件排行选项
      type: Boolean,
      required: false,
      default: false,
    },
    fatherNowFileArrange: { // 文件排行方式
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      path: [], // 文件夹路径
      searchInput: '', // 搜索内容
      functionData: [ // 文件排行数据
        { order: 'all', name: '全部文件' },
        { order: 'topping', name: '置顶文件' },
        { order: 'week_click', name: '周热点文件' },
        { order: 'month_click', name: '月热点文件' },
        { order: 'total_click', name: '总共点击数' },
        { order: 'date', name: '时间' },
      ],
      nowFunc: 'all', // 当前的排行
    }
  },

  watch: {
    filePath: function () { // 文件路径
      this.arrangeFilePath();
    },

    fatherSearchInput: function () {
      if (this.searchInput != this.fatherSearchInput) {
        this.searchInput = this.fatherSearchInput;
      }
    },

    fatherNowFileArrange: function () {
      if (this.nowFunc != this.fatherNowFileArrange) {
        this.nowFunc = this.fatherNowFileArrange;
      }
    }
  },

  methods: {

    // 整理文件路径
    arrangeFilePath: function () {
      let path = this.filePath.split('/');
      this.path = path;
    },

    // 跳转文件
    switchFile: function (index) {
      let path = this.path.slice(0, index + 1);
      path = path.join('/');
      this.$emit('switchFile', path);
    },

    // 搜索文件处理函数
    searchHandle: function () {
      this.$emit('searchHandle', this.searchInput);
    },

    // 新建文件夹
    newFolder: function (type) {
      this.$emit('newFolder', { id: undefined, name: '', authority: '', grouping: [], file_type: type });
    },

    // 点击切换功能点
    changeFunc: function (order) {
      this.nowFunc = order;
      this.$emit('fileArrange', order);
    }
  }
}
</script>

<style lang="scss" scoped>
.file-path-component {
  width: 100%;
  color: #474747;
  font-size: 14px;
}

.file-path-component .file-controller {
  width: 100%;
  margin-bottom: 10px;
  position: relative;
}

.file-path-component .file-controller .control-button {
  margin-left: 15px;
  float: left;
  margin-top: 5px;
}

.file-path-component .file-controller .control-input {
  width: 350px;
  margin-left: 20px;
}

.file-path-component .file-path {
  width: 100%;
  margin-left: 15px;
  margin-bottom: 10px;
  line-height: 22px;
}

.file-path-component .path-name {
  cursor: pointer;
}

.file-path-component .path-name:hover {
  color: #09AAFF;
}

.file-arrange {
  margin-left: 20px;
  width: calc(100% - 600px);
  line-height: 40px;
}

@media screen and (min-device-width: 1366px) {
  .file-arrange {
    float: left;
  }

  .file-path-component .file-controller .control-input {
    width: 350px;
    margin-left: 20px;
    float: left;
  }
}

@media screen and (max-device-width: 1366px) {
  .file-arrange {
    width: 100%;
    margin-top: 10px;
  }
}

.file-arrange-name {
  color: #666;
  width: 80px;
  float: left;
  padding-left: 10px;
}

.file-arrange-body {
  width: calc(100% - 90px);
  float: left;
  margin-left: 10px;
}

.file-arrange-body .each-arrange {
  line-height: 30px;
  margin-top: 5px;
  width: 100px;
  float: left;
  text-align: center;
  margin-right: 15px;
  border: solid 1px #e0e0e0;
  border-radius: 5px;
  color: #5c5c5c;
  box-shadow: 0 0 1px lightgray;
  cursor: pointer;
}

.file-arrange-body .each-arrange:hover {
  box-shadow: 0 0 3px lightgray;
}
</style>