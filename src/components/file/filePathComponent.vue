<template>
  <div class="file-path-component">
    <div class="file-controller">
      <el-button class="control-button" v-if="fileAuth" type="primary" size="small" plain @click="newFolder(0)" :disabled="searchInput != '' || nowFunc != 'all'">新建文件夹</el-button>
      <el-button class="control-button" v-if="fileAuth" type="success" size="small" plain :disabled="searchInput != '' || nowFunc != 'all'" @click="newFolder(1)">新建文件</el-button>
      <el-input class="control-input" placeholder="请输入内容" v-model="searchInput" @input="searchHandle" :disabled="nowFunc != 'all'">
        <template slot="append">
          <span class="el-icon-search"></span>
        </template>
      </el-input>
      <div class="file-arrange" id="fileArrange">
        <div class="file-arrange-name">文件排行</div>
        <div class="file-arrange-body">
          <div class="each-arrange" v-for="(item, index) in functionData" :key="index" @click="changeFunc(item.order)">
            {{ item.name }}
            <span v-if="nowFunc == item.order" class="el-icon-back"></span>
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
  float: left;
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
  position: relative;
  width: 100px;
  float: left;
  background: white;
  margin-left: 20px;
  margin-top: 5px;
}

.file-arrange-name {
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 30px;
  color: #409EFF;
  background: #ecf5ff;
  border: solid 1px #b3d8ff;
  cursor: pointer;
  box-shadow: 0 0 1px #808080;
  border-radius: 5px;
}

.file-arrange:hover .file-arrange-body {
  display: block;
}

.file-arrange-body {
  background: white;
  position: absolute;
  display: none;
  width: 100%;
  font-size: 13px;
  text-align: center;
  line-height: 25px;
  border: solid 1px #b3d1eb;
  box-shadow: 0 0 1px #349cf6;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.each-arrange {
  cursor: pointer;
  border-bottom: solid 1px #f5f5f5;
  color: #555555;
  transition: all .5s;
}

.each-arrange:hover {
  color: #f3f3f3;
  background: #53afff;
}
</style>