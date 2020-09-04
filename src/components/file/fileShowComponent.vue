<template>
  <div class="file-show-component">
    <div class="file-area" v-if="fileShowData.length != 0">
      <div class="header">
        <div class="each-head">名称</div>
        <!-- <div class="each-head">所属路径</div> -->
        <div class="each-head alignRight" v-if="fileAuth == true">操作</div>
        <div class="clear"></div>
      </div>
      <div class="body">
        <div class="each-file" v-for="item in fileShowData" :key="item.id" :draggable="isCanDrag"  @dragstart="dragstart(item, $event)" @dragend="dragend">
          <div class="each-file-part name">
            <div class="img-sign">
              <img src="../../../public/img/folder.png" v-if="item.file_type == 0">
              <img src="../../../public/img/file.png" v-if="item.file_type == 1">
            </div>
            <span class="file-cursor" @click="switchFile('next', item)">{{ item.name }}</span>
            <div class="img-sign hot-area" v-if="rankingType != '' && rankingType != 'topping'">
              <img class="hot-img" src="../../../public/img/hot.png" alt="" v-if="rankingType != 'date'">
              {{ item[rankingType] }}
            </div>
          </div>
          <!-- <div class="each-file-part path"><span class="file-cursor" @click="switchFile('pre', item)">{{ item.path[item.path.length - 2] }}</span></div> -->
          <div class="each-file-part operation" v-if="fileAuth == true">
            <!-- <el-button type="primary" size="mini" plain @click="editFileName(item)">重命名</el-button> -->
            <el-button v-if="customButton && item.file_type == 1" type="primary" size="mini" plain @click="customClick(item, customButton.order)">{{ customButton.name }}</el-button>
            <el-button class="orange" type="warning" plain size="mini" @click="editFile(item)" v-if="item.file_type == 1 && isCanEdit == true && item.isCanEdit != false">编辑文件</el-button>
            <el-button class="red" type="danger" plain size="mini" @click="deleteFile(item.id)">删除</el-button>
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
    },
    fileAuth: { // 文件夹操作权限
      type: Boolean,
      required: true
    },
    isCanEdit: { // 是否能够编辑文件
      type: Boolean,
      required: false,
      default: true
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
    rankingType: { // 排行类型
      type: String,
      required: false,
    }
  },

  methods: {

    // 跳转文件
    switchFile: function (operation, data) {
      if (data.file_type == 0) {
        let path = data.path
        if (operation == 'pre') {
          path = path.slice(0, path.length - 1);
        }
        path = path.join('/');
        this.$emit('switchFile', path);
      } else if (data.file_type == 1) {
        data[this.rankingType] = parseFloat(data[this.rankingType]) + 1;
        this.$emit('seeFile', { fid: data.id });
      }
    },

    // 重命名文件夹
    editFileName: function (data) {
      this.$emit('newFolder', { id: data.id, name: data.name, authority: data.authority, grouping: data.grouping == null ? [] : data.grouping.split(','), file_type: data.file_type });
    },

    // 删除文件夹
    deleteFile: function (id) {
      this.$emit('deleteFile', { id: id });
    },

    // 编辑文件
    editFile: function (data) {
      this.$emit('editFile', data);
    },

    // 拖拉开始
    dragstart: function (data, event) {
      this.$emit('dragstart', data);
    },

    // 拖拉结束
    dragend: function (data, event) {
      this.$emit('dragend');
    },

    // 自定义按钮被点击
    customClick: function (data, order) {
      this.$emit('customClick', { order: order, data: data });
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

@media screen and (max-device-width: 1366px) {
  .file-show-component {
    height: calc(100% - 120px);
  }
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
  float: right;
  text-align: right;
  padding-right: 30px;
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
  max-width: calc(100% - 100px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  float: left;
}

.file-cursor:hover {
  color: #09AAFF;
}

.file-area .each-file .each-file-part {
  width: 40%;
  float: left;
}

.file-area .each-file .name {
  padding-left: 15px;
  float: left;
}

.file-area .each-file .path {
  padding-left: 10px;
}

.file-area .each-file .operation {
  float: right;
  text-align: right;
  padding-right: 20px;
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

.hot-area {
 margin-left: 15px;
 color: indianred;
 font-weight: 500;
}

.hot-img {
  height: 20px;
  margin-right: 10px;
}

</style>