<template>
  <div class="file-show-component">
    <div class="file-area" v-if="fileShowData.length != 0">
      <div class="header">
        <div class="each-head">名称</div>
        <div class="each-head">路径</div>
        <div class="each-head alignRight">操作</div>
        <div class="clear"></div>
      </div>
      <div class="body">
        <div class="each-file" v-for="item in fileShowData" :key="item.id">
          <div class="each-file-part name">
            <div class="img-sign">
              <img src="../../../public/img/folder.png" v-if="item.file_type == 0">
              <img src="../../../public/img/file.png" v-if="item.file_type == 1">
            </div>
            <span class="file-cursor" @click="switchFile('next', item)">{{ item.name }}</span>
          </div>
          <div class="each-file-part path"><span class="file-cursor" @click="switchFile('pre', item)">{{ item.path[item.path.length - 2] }}</span></div>
          <div class="each-file-part operation">
            <el-button type="primary" size="mini" plain @click="editFileName(item)">重命名</el-button>
            <el-button type="warning" size="mini" plain>编辑文件</el-button>
            <el-button type="danger" size="mini" plain @click="deleteFile(item.id)">删除</el-button>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
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

  props: {
    fileShowData: { // 文件夹展示数据
      type: Array,
      required: true
    }
  },

  methods: {
    // 跳转文件
    switchFile: function (operation, data) {
      let path = data.path
      if (operation == 'pre') {
        path = path.slice(0, path.length - 1);
      }
      path = path.join('/');
      this.$emit('switchFile', path);
    },

    // 重命名文件夹
    editFileName: function (data) {
      this.$emit('newFolder', { id: data.id, name: data.name, authority: data.authority, grouping: data.grouping == null ? [] : data.grouping.split(','), file_type: 0 });
    },

    // 删除文件夹
    deleteFile: function (id) {
      this.$emit('deleteFile', { id: id });
    }
  }
}
</script>

<style lang="scss" scoped>
.file-show-component {
  width: 100%;
  height: calc(100% - 80px);
  box-shadow: 0 0 1px #b1b1b1;
}

.file-area {
  width: 100%;
  height: 100%;
  color: #666;
  font-size: 14px;
}

.file-area .header {
  width: 100%;
  line-height: 44px;
  padding-left: 10px;
}

.file-area .header .each-head {
  width: 33%;
  float: left;
}

.file-area .header .alignRight {
  text-align: right;
  padding-right: 50px;
}

.file-area .body {
  width: 100%;
  height: calc(100% - 45px);
  overflow: auto;
}

.file-area .body .each-file {
  width: 100%;
  line-height: 44px;
  padding-left: 10px;
  border: solid 0.3px #fafafa;
  border-left: none;
  border-right: none;
}

.file-area .body .each-file:hover {
  background: #f2faff;
  border-color: #CBEDFF;
}

.file-cursor {
  cursor: pointer;
}

.file-cursor:hover {
  color: #09AAFF;
}

.file-area .each-file .each-file-part {
  width: 33%;
  float: left;
}

.file-area .each-file .name {
  padding-left: 15px;
}

.file-area .each-file .path {
  padding-left: 10px;
}

.file-area .each-file .operation {
  text-align: right;
  padding-right: 10px;
}

.no-file {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-file-intro p {
  padding: 20px;
  color: #727272;
}

.img-sign {
  margin-right: 15px;
  height: 45px;
  display: flex;
  float: left;
  align-items: center;
}
</style>