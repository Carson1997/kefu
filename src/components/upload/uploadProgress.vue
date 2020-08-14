<template>
  <div class="upload-progress">
    <div class="progress-head">
      <h3 class="progress-head-title">上传文件进度</h3>
      <div class="control-area">
        <span class="el-icon-upload2 showIcon" @click="showUploadProgress" :class="{ showUploadProgressClass: showUploadProgressClass == true }"></span>
      </div>
    </div>

    <div class="progress-body">
      <div v-for="(item, index) in uploadProgressData" :key="index" class="each-upload-progress">
        <div v-if="item.status == 0" class="now-progress" :style="'width:' + item.index / item.totalLenth * 100 + '%'"></div>
        <div class="file-name">
          {{ item.name }}
          <span class="right">{{ item.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'uploadProgress',

  computed: {
    uploadProgressData: function () {
      let arr = this.$store.state.UOLOAD_PROGRESS.filter(item => {
        return item.show == true;
      })
      return arr;
    },

    showUploadProgressClass: function() {
      return this.$store.state.SHOW_UPLOAD_PROGRESS;
    }
  },

  methods: {

    // 修改上传框的显示
    showUploadProgress: function () {
      let boolean = this.$store.state.SHOW_UPLOAD_PROGRESS;
      boolean = boolean == true ? false : true;
      this.$store.commit('changeShowUploadProgress', boolean)
    }
  }
  
}
</script>

<style lang="scss" scoped>
.progress-head {
  width: 100%;
  height: 40px;
  border-bottom: solid 1px #ececec;
  position: relative;
}

.progress-head-title {
  color: #666;
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  padding-left: 20px;
}

.control-area {
  position: absolute;
  height: 40px;
  line-height: 40px;
  top: 0;
  right: 20px;
}

.showIcon {
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.progress-body {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

.each-upload-progress {
  position: relative;
  width: 100%;
  height: 45px;
  border-bottom: solid 1px #eeeeee;
}

.file-name {
  color: #424e67;
  width: 100%;
  padding-left: 20px;
  font-size: 14px;
  line-height: 45px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.now-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  background: #e2eeff;
}

.right {
  line-height: 45px;
  float: right;
  margin-right: 20px;
}

.showUploadProgressClass {
  transform:rotate(180deg);
}
</style>