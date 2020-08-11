<template>
  <div class="file-path-component">
    <div class="file-controller">
      <el-button class="control-button" type="primary" size="small" plain @click="newFolder" :disabled="searchInput != ''">新建文件夹</el-button>
      <el-button class="control-button" type="success" size="small" plain :disabled="searchInput != ''">新建文件</el-button>
       <el-input class="control-input" placeholder="请输入内容" v-model="searchInput" @input="searchHandle">
        <template slot="append">
          <span class="el-icon-search"></span>
        </template>
      </el-input>

    </div>
    <div class="file-path">
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
    }
  },

  data: function () {
    return {
      path: [], // 文件夹路径
      searchInput: '', // 搜索内容
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
    newFolder: function () {
      this.$emit('newFolder');
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
}

.file-path-component .file-controller .control-button {
  margin-left: 15px;
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
</style>