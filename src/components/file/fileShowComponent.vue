<!-- 文件展示组件 -->
<template>
  <div class="file-show-component">
    <!-- 有文件存在 -->
    <div v-if="fileData != undefined" class="has-file">
      <div class="file-header"> <!-- 列指示 -->
        <div class="each-file-header">文件名</div>
        <div class="each-file-header" v-if="searchInput != ''">路径</div>
        <div class="each-file-header"  v-if="fileControlAuth == true">操作</div>
        <div class="clear"></div>
      </div>
      <div class="each-file" v-for="item in fileData" :key="item.id">

        <!-- 文件行左侧 -->
        <div class="each-file-left">
          <!-- 文件类型指示 -->
          <div class="file-category">
            <img src="../../../public/img/folder.png" alt="">
          </div>
          <!-- 文件名 -->
          <span class="file-name" @click="switchFolder('next', item)">{{ item.name }}</span>
        </div>

        <!-- 文件行中间 -->
        <div class="each-file-middle" v-if="searchInput != ''">
          <span @click="switchFolder('pre', item)">{{ item.path[item.path.length - 1] }}</span>
        </div>

        <!-- 文件行右侧 -->
        <div class="each-file-right" v-if="fileControlAuth == true">
          <el-button type="text" class="button" @click="renameFileFolder(item)">重命名</el-button>
          <el-button type="text" class="button delete" @click="deleteFolder(item)">删除</el-button>
        </div>
        <div class="clear"></div>
      </div>
    </div>

    <!-- 无文件存在 -->
    <div class="no-file" v-else>
      <div class="no-file-intro">
        <img src="../../../public/img/no_file.png" alt="">
        <p>该文件夹还没有文件!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileShowComponent',

  props: [ 'fileData', 'fileControlAuth', 'searchInput' ],

  methods: {

    // 切换文件夹
    switchFolder: function (operation, data) {
      let path = data['path'];
      if (operation == 'next') {
        path.push(data.name);
      }
      this.$emit('switchFolder', { operation: operation, path: path });
    },

    // 删除文件夹
    deleteFolder: function (data) {
      let _this = this;
      this.$confirm('此操作将无法撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this.$emit('deleteFolder', { id: data.id });
      }).catch(function () {});
    },

    // 重命名文件夹
    renameFileFolder: function (data) {
      let _this = this;
      this.$prompt('请输入文件夹新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        inputValue: data.name
      }).then(function (value) {
        _this.$emit('newFolder', { id: data.id, name: value.value });
      }).catch(function () {});
    }

  }
}
</script>

<style lang="scss" scoped>
.has-file, .no-file {
  width: 100%;
  height: 100%;
}

.no-file {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-file-intro p {
  padding: 20px;
  color: #727272;
}

.file-header {
  width: 100%;
  border-bottom: solid .3px #f2f6fd;
  padding: 0 10px;
  color: #666;
  font-size: 14px;
}

.file-header .each-file-header {
  width: 30%;
  float: left;
  line-height: 44px;
}

.file-header .each-file-header:nth-child(2) {
  text-align: center;
}

.file-header .each-file-header:nth-last-child(2) {
  float: right;
  text-align: right;
  padding-right: 30px;
}

.each-file {
  width: 100%;
  color: #666;
  border-bottom: solid .3px #f2f6fd;
  padding: 0 20px;
  line-height: 44px;
  border-left: none;
  border-right: none;
}

.each-file:hover {
  background: #f4fbff;
  border-top: solid .3px #f2f6fd;
  border-color: #d9ebfd;;
}

.each-file .each-file-left {
  width: 30%;
  float: left;
}

.each-file  .each-file-middle {
  width: 30%;
  float: left;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
}

.each-file  .each-file-middle span {
  border-bottom: solid .5px rgb(216, 216, 216);
}

.each-file  .each-file-middle span:hover {
  color: #09aaff;
}

.each-file .each-file-left .file-category {
  width: 25px;
  height: 44px;
  display: flex;
  align-items: center;
  float: left;
}

.each-file .each-file-left .file-category img {
  width: 100%;
}

.each-file .each-file-left .file-name {
  color: #424e67;
  cursor: pointer;
  font-size: 13px;
  margin-left: 15px;
}

.each-file .each-file-left .file-name:hover {
  color: #09aaff;
}

.each-file-right {
  width: 30%;
  float: right;
  text-align: right;
}

.button {
  font-size: 13px;
}

.delete {
  color: indianred;
}

</style>