<!-- 上传控制器 -->
<template>
  <span id="uploadController">
    <el-button type="primary" size="small" plain @click="uploadLis" :disabled="canClick">上传文件</el-button>
    <!-- <span v-if="uploadSuccess" class="fileName">{{ fileName }}</span> -->
    <input type="file" ref="uploadInput" class="none" @change="uploadInputLis">
    <el-dialog title="提示" :visible="dialogVisible" width="30%" append-to-body :show-close="false">
      <div class="reading-box">正在读取文件...</div>
    </el-dialog>
  </span>
</template>

<script>
import SparkMD5 from 'spark-md5'
export default {
  name: 'uploadController',

  props: {
    index: {
      required: false
    }
  },

  data: function () {
    return {
      chunks: [], // 上传文件的切片
      hash: '', // 上传文件的hash
      fileName: '', // 上传文件的名称
      dialogVisible: false, // 读取文件提示框
      progressIndex: '', // 在进度条数据中的下标
      uploadSuccess: false, // 上传成功
      canClick: false,
    }
  },

  methods: {

    // 上传按钮被点击
    uploadLis: function () {
      this.clear();
      this.$refs.uploadInput.click();
    },
    
    // 上传文件组件被点击
    uploadInputLis: function (event) {
      this.$emit('uploadChange');
      this.canClick = true;
      let file = event.target.files[0];
      this.dialogVisible = true;
      this.readFileDetail(file);
    },

    // 读取文件的详细内容
    readFileDetail: function (file) {
      let _this = this;
      let fileReader = new FileReader(); // 读取文件的对象
      let size = 3 * 1024 * 1024; // 切片的大小限制为3m
      let start = 0;
      let end = size;
      let chunks = []; // 文件切片
      let spark = new SparkMD5.ArrayBuffer();
      fileReader.onload = function (event) {
        let res = event.target.result;
        spark.append(res); // 获取hash的数组
        chunks.push(file.slice(start, end)); // 获取断片内容
        if (end < file.size) {
          start = end;
          end = start + size;
          fileReader.readAsArrayBuffer(file.slice(start, end));
        } else {
          let hash = spark.end(); // 将文件内容变成hash值
          _this.checkFileExist(chunks, hash, file.name);
        }
      }
      fileReader.readAsArrayBuffer(file.slice(start, end));
    },

    // 测试文件在服务器中是否已经存在
    checkFileExist: function (chunks, hash, fileName) {
      this.chunks = chunks;
      this.hash = hash;
      this.fileName = fileName;
      let send = { total_blob_num: chunks.length, hash: hash, file_name: fileName };
      this.$NORMAL_POST(this.$INTERFACE.FILE_TEST, send).then(this.checkFileExistPromise);
    },

    // 测试文件在服务器中是否已经存在  请求后的处理函数
    checkFileExistPromise: function (res) {
      let data = res.data;
      this.uploadFile(data);
    },

    // 上传文件
    uploadFile: function (fileData) {
      this.dialogVisible = false;
      this.$store.commit('changeShowUploadProgress', true);
      let arr = []; // 请求的方法集合
      let url = this.$INTERFACE.FILE_UPLOAD;
      for (let i = 0; i < this.chunks.length; i++) {
        if ((fileData.indexOf((i + 1).toString())) == -1) {
          let send = { file: this.chunks[i], blob_num: i + 1, total_blob_num: this.chunks.length, file_name: this.fileName, hash: this.hash };
          arr.push(this.$FILE_POST(url, send, this.$store.state.UOLOAD_PROGRESS.length));
        }
      }
      this.progressIndex = this.$store.state.UOLOAD_PROGRESS.length;
      this.$store.commit('changeUploadProgress', { name: this.fileName, index: 0, totalLenth: this.chunks.length - fileData.length + 1, message: '上传中', status: 0, show: true });
      Promise.all(arr).then(this.uploadFilePromise).catch(this.uploadFileCatch);
    },

    // 上传文件  请求后的处理函数  -- 合并文件
    uploadFilePromise: function (res) {
      let url = this.$INTERFACE.FILE_MERGE;
      let send = { total_blob_num: this.chunks.length, hash: this.hash, file_name: this.fileName }; 
      this.$NORMAL_POST(url, send).then(this.uploadMerge);
    },

    // 上传合并
    uploadMerge: function (res) {
      let _this = this;
      this.$store.commit('changeUploadProgressBar', this.progressIndex);
      this.canClick = false;
      this.$store.commit('changeUploadProgressMessage', { index: this.progressIndex, status: 1, message: '上传成功', show: true });
      setTimeout(() => {
        _this.$store.commit('changeUploadProgressMessage', { index: this.progressIndex, status: 1, message: '上传成功', show: false });
        _this.$store.commit('changeShowUploadProgress', false);
      }, 1000);
      this.uploadSuccess = true;
      this.$emit('uploadSuccess', { index: this.index, data: res.data });
      this.$refs.uploadInput.value = '';
    },

    // 上传失败
    uploadFileCatch: function (error) {
      this.$store.commit('changeUploadProgressBar', this.progressIndex);
      this.canClick = true;
      this.$store.commit('changeUploadProgressMessage', { index: this.progressIndex, status: 1, message: '上传失败', show: true });
    },

    // 清理
    clear: function () {
      this.chunks = [];
      this.hash = '';
      this.fileName = '';
    }
    
  }

}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.reading-box {
  border-top: solid 1px #e6e6e6;
  padding: 20px;
  font-size: 16px;
}

.fileName {
  margin-left: 20px;
}
</style>
