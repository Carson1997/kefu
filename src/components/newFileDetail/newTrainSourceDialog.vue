<!-- 创建培训选择素材对话框 -->
<template>
  <el-dialog title="选择素材文件" :visible="dialogVisible" top="3vh" :close-on-click-modal="false" width="80%" :before-close="handleClose">
    <div class="input-area" :style="{ height: areaHeight + 'px' }">
      <div class="left">
        <fileFolderComponent @exposeToBusiness="exposeToBusiness" :isCanDrag="fileIsCanDrag" class="file-area" :fileData="fileData" :fileAuth="fileAuth"></fileFolderComponent>
      </div>
      <div class="right">
        <p class="prompt">将左侧文件拖拉到下方区域完成素材的选择</p>
        <h2 class="title">培训的素材</h2>
        <div class="train-source-area">
          <div class="name">文件名</div>
          <div class="train-source" @dragover="dragover" @drop="drop">
            <div :style="{ display: propmtDisplay }" class="add-icon-area"><span class="el-icon-plus"></span></div>
            <div class="each-source" v-for="(item, index) in sourceData" :key="item.id">
              <div class="img-sign">
                <img src="../../../public/img/file.png" alt="">
              </div>
              <span>{{ item.name }}</span>
              <el-button size="mini" type="danger" plain class="del-button" @click="delSource(index)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <el-button type="primary" size="small" plain class="add-button" @click="next">提交, 下一步</el-button>
    </div>
  </el-dialog>
</template>

<script>
import fileFolderComponent from '../file/fileFolderComponent';
export default {
  name: 'newTrainSourceDialog',

  components: { fileFolderComponent },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newTrainSourceDialog') {
        return true;
      } else {
        return false;
      }
    },
  },

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 140, // 高度
      fileData: [], // 素材文件夹数据
      fileAuth: false, // 编辑素材文件的权限
      fileIsCanDrag: true, // 文件能否拖拉
      dragData: {}, // 拖拉的数据
      propmtDisplay: 'none', // 提示框
      sourceData: [], // 素材文件
    }
  },

  props: [ 'trainData' ],

  mounted: function () {
    this.getAllSource();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 获取所有素材
    getAllSource: function () {
      let url = this.$INTERFACE.ALL_SOURCE;
      this.$NORMAL_POST(url).then(this.getAllSourcePromise);
    },

    // 获取所有素材  请求后的处理函数
    getAllSourcePromise: function (res) {
      this.fileData = res.data;
    },

    // 文件夹组件暴露给业务的接口
    exposeToBusiness: function (data) {
      let order = data.order;
      let value = data.data;
      if (order == 'dragstart') {
        this.dragData = value;
        this.propmtDisplay = 'flex';
      } else if (order == 'dragend') {
        this.dragData = '';
        this.propmtDisplay = 'none';
      }
    },

    // 拖拉到顶端
    dragover: function (event) {
      event.preventDefault();
    },

    // 拖拉投下
    drop: function (event) {
      this.propmtDisplay = 'none';
      if (this.dragData.file_type == 1) {
        this.sourceData.push(this.dragData);
        let arr = this.fileData.filter(item => {
          return item.id != this.dragData.id;
        })
        this.fileData = arr.slice(0);
      } else {
        this.$PUBILC.alert(this, '不能拖拉文件夹');
      }
    },

    // 删除所选数据
    delSource: function (index) {
      let data = this.sourceData[index];
      this.fileData.push(data);
      this.sourceData.splice(index, 1);
    },

    // 下一步
    next: function () {
      let arr = [];
      if (this.sourceData.length == 0) {
        this.$PUBILC.alert(this, '请选择素材文件');
      } else {
        for (let i in this.sourceData) {
          arr.push(this.sourceData[i].id);
        }
        let obj = JSON.parse(JSON.stringify(this.trainData));
        obj['training_id'] = arr.join(',');
        obj['type'] = 2;
        this.$emit('next', obj);
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  overflow: auto;
  border-top: solid 1px #f1f1f1;
  overflow: hidden;
}

.input-area .left, .input-area .right {
  box-sizing: border-box;
  padding: 20px;
  padding-bottom: 0;
  width: 50%;
  height: calc(100% - 50px);
  float: left;
}

.input-area .left {
  border-right: solid 1px #f1f1f1;
}

.input-area .file-area {
  width: 100%;
  height: 100%;
}

.right .title {
  color: #474747;
  font-size: 14px;
  font-weight: 400;
  margin-top: 20px;
}

.prompt {
  color: indianred;
  font-size: 16px;
  margin-top: 10px;
}

.train-source-area {
  width: 100%;
  margin-top: 10px;
  height: calc(100% - 82px);
  background: white;
  box-shadow: 0 0 1px #b1b1b1;
}

.train-source-area .name {
  width: 100%;
  line-height: 44px;
  padding-left: 10px;
  border-bottom: solid 1px #f1f1f1;
}

.train-source {
  width: 100%;
  height: calc(100% - 46px);
  background: white;
  position: relative;
}

.add-icon-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  background: #dfdfdf1a;
  display: none;
}

.each-source {
  width: 100%;
  line-height: 44px;
  padding-left: 20px;
  border-bottom: solid 1px #f1f1f1;
}

.each-source .img-sign {
  margin-right: 15px;
  height: 45px;
  display: flex;
  float: left;
  align-items: center;
}

.each-source .del-button {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}

.add-button {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}

</style>