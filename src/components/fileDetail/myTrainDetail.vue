<template>
  <el-dialog title="培训详情" :visible="dialogVisible" width="98%" top="5vh" :before-close="handleClose" :close-on-click-modal="false" :show-close="false">
    <div class="input-area" :style="{ height: areaHeight + 'px' }">
      <div class="trainArea">
        <img v-if="imgSuffix.indexOf(trainData[trainIndex]['file'].substring(trainData[trainIndex]['file'].lastIndexOf('.'))) > -1" class="preview-detail" :src="baseIp + trainData[trainIndex]['file']"/>
        <iframe class="preview-detail" :src="baseIp + trainData[trainIndex]['file']"  v-if="officeSuffix.indexOf(trainData[trainIndex]['file'].substring(trainData[trainIndex]['file'].lastIndexOf('.'))) > -1"></iframe>
        <video controls="controls" v-if="videoSuffix.indexOf(trainData[trainIndex]['file'].substring(trainData[trainIndex]['file'].lastIndexOf('.'))) > -1" class="preview-detail" :src="baseIp + trainData[trainIndex]['file']"></video>
      </div>
      <el-button type="primary" plain size="mini" class="next" @click="next">{{ trainIndex + 1 == trainData.length ? '完成' : '下一题'  }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'myTrainDetail',

  computed: {
    dialogVisible: function () {
      if (this.$store.state.NOW_OPEN_DIALOG == "myTrainDetail") {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'trainData' ], 

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 140,
      trainIndex: 0, // 素材下标
      baseIp: 'http://192.168.1.5/binghuo_information/', // 服务器ip地址
      // baseName: 'https://view.officeapps.live.com/op/view.aspx?src=http://service.miniice.cn/binghuo_information/',
      imgSuffix: ['.jpg', '.png', '.jpeg', '.gif'],
      officeSuffix: ['.xls', '.csv', '.xlsx', '.doc', '.ppt', '.docx', '.pptx', '.pdf'],
      videoSuffix: ['.mp4', '.mpeg4', '.avi', '.mov', '.rmvb', '.rm', '.flv', '.mp3', '.mpeg3', '.wma', '.ogg'],
    }
  },

  mounted: function () {
    this.arrangeIp();
  },

  methods: {

    // 适配当前ip
    arrangeIp: function () {
      if (window.location.host == '192.168.1.20') {
        this.baseIp = 'http://192.168.1.5/binghuo_information/';
      } else if (window.location.host == '183.239.34.128:808') {
        this.baseIp = 'http://183.239.34.128:818/binghuo_information/';
      }
    },

    // 关闭对话框
    handleClose: function () {},

    // 下一题
    next: function () {
      if (this.trainIndex + 1 < this.trainData.length) {
        this.trainIndex++;
      } else {
        this.$emit('finishTrain');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  height: 100%;
  border-top: solid 1px #e9e9e9;
}

.preview-detail {
  width: 100%;
  height: 100%;
  border: none;
}

.trainArea {
  width: 100%;
  height: calc(100% - 40px);
  border-bottom: solid 1px #e9e9e9;
}

.next {
  margin-top: 7px;
  float: right;
  margin-right: 30px;
}
</style>