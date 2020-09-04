<!-- 编辑产品参数表身的对话框 -->
<template>
  <el-dialog title="编辑产品参数" :visible="dialogVisible" append-to-body width="45%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area" :style="{ 'max-height': areaHeight + 'px' }">
      <div class="each-input" v-for="(item, index) in rowData" :key="index">
        <span class="name">{{ item.colName + ' :' }}</span>
        <div class="value">
          <el-input v-if="item.isImg == false" class="input" v-model="item.value" placeholder="请输入详细数据"></el-input>
          <div class="img-area" v-if="item.isImg == true">
            <uploadController class="uoload" :index="index" @uploadSuccess="uploadSuccess"></uploadController>
            <img class="img" :src="imgUrl + item.value" alt="">
          </div>
          <div class="switch">
            <span class="switch-name">图片:</span>
            <el-switch v-model="item.isImg" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>

    <div class="button-area">
      <el-button type="success" size="small" plain @click="submit">提交更改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import uploadController from '../upload/uploadController'
export default {
  name: 'editPrdTbodyDialog',

  computed: {
    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'editPrdTbodyDialog') {
        return true;
      } else {
        return false;
      }
    },
  },

  components: { uploadController },

  props: [ 'rowData' ],

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 250, // 对话框高度
      imgUrl: 'http://service.miniice.cn/binghuo_information/', // 图片服务器地址
    }
  },

  methods: {
    // 对话框关闭
    handleClose: function () {
      this.$emit('close');
    },

    // 图片上传成功
    uploadSuccess: function (data) {
      this.rowData[data.index]['value'] = data.data;
    },

    // 提交修改
    submit: function () {
      for (let i in this.rowData) {
        if (this.rowData[i]['value'] == '') {
          this.$PUBILC.alert(this, '请输入必须的内容或者等待图片上传成功后再上传');
          return false;
        }
      }
      this.$emit('submit', this.rowData);
    },
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #f1f1f1;
  padding-bottom: 10px;
  overflow: auto;
}

.each-input {
  width: 90%;
  margin: 20px auto;
}

.each-input .name {
  width: 100px;
  float: left;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}

.each-input .value {
  width: calc(100% - 100px);
  float: left;
  line-height: 40px;
}

.input {
  width: 80%;
  float: left;
}

.img-area {
  width: 80%;
  float: left;
}

.switch {
  line-height: 40px;
  float: left;
  margin-left: 10px;
}

.switch-name {
  font-size: 13px;
  margin-right: 10px;
}

.button-area {
  width: 100%;
  border-top: solid 1px #f3f3f3;
  padding-bottom: 10px;
  padding-top: 10px;
  text-align: center;
}

.uoload {
  float: left;
}

.img {
  display: block;
  width: 40px;
  float: left;
  margin-left: 20px;
}
</style>