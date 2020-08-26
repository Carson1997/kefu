<template>
  <div id="trainManage" class="train-manage">
    <fileFolderComponent :customButton="customButton" :fileIsCanEdit="false" @exposeToBusiness="exposeToBusiness" class="train-file" :fileData="fileData" :fileAuth="fileAuth"></fileFolderComponent>
    <newTrainSourceDialog @next="newExam" :trainData="trainData" v-if="newTrainSourceDialogShow"></newTrainSourceDialog>
    <newExamDialog @close="closeNewExamDialog" v-if="newExamDialogShow" @newFileHandle="newExamHandle" :examFileData="trainData"></newExamDialog>
    <newExamDetail :fatherExamData="newExamDetailData" @closeExamDetail="closeExamDetail" v-if="newExamDetailShow" :examId="trainExamId" :examAuth="examAuth"></newExamDetail>
    <seeScoreDialog @reExam="reExam" @close="closeSeeScoreDialog" @seeExamDetail="seeExamDetail" :v-if="seeScoreDialogShow" :tableData="scoreData"></seeScoreDialog>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import newExamDialog from '../../components/newFileDetail/newExamDialog';
import newTrainSourceDialog from '../../components/newFileDetail/newTrainSourceDialog';
import newExamDetail from '../../components/newFileDetail/newExamDetail';
import seeScoreDialog from '../../components/fileDetail/seeScoreDialog';
export default {
  name: 'trainManage',

  components: { fileFolderComponent, newTrainSourceDialog, newExamDialog, newExamDetail, seeScoreDialog },

  data: function () {
    return {
      fileData: [], // 文件夹数据
      newTrainSourceDialogShow: false, // 是否显示素材对话框
      trainData: {}, // 新建的培训数据
      newExamDialogShow: false, // 是否显示新建试卷
      trainExamId: '', // 培训考试的id
      trainId: '', // 训练的id
      newExamDetailShow: false, // 是否显示培训考试的框
      seeScoreDialogShow: false, // 是否显示成绩对话框
      newExamDetailData: [], // 学生考试的详细成绩
      scoreData: [], // 学生成绩数据
      examAuth: true,
      customButton: { // 文件夹自定义按钮
        name: '查看学生成绩',
        order: 'seeScore'
      }
    }
  },

  computed: {
    fileAuth: function () { // 文件权限
      if (this.$store.state.USER_STATUS == '2') {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted: function () {
    this.getTrainData();
  },

  methods: {

    // 获取培训数据
    getTrainData: function () {
      let url = this.$INTERFACE.ALL_TRAIN;
      this.$NORMAL_POST(url).then(this.getTrainDataPromise);
    },

    // 获取培训数据  请求后的处理函数
    getTrainDataPromise: function (res) {
      this.fileData = res.data
    },

    // 组件暴露给业务的接口
    exposeToBusiness: function (data) {
      let order = data.order;
      let value = data.data;
      if (order == 'new_folder') {
        this.newFolder(value);
      } else if (order == 'delete_file') {
        this.deleteFileAndFolder(value);
      } else if (order == 'new_file') {
        this.newFile(value);
      } else if (order == 'seeScore') {
        this.seeScore(value);
      }
    },

    // 查看成绩
    seeScore: function (data) {
      let url = this.$INTERFACE.ALL_TRAIN_SCORE;
      let send = { id: data.id };
      this.trainId = data.id;
      this.trainExamId = data.examination_id;
      this.$NORMAL_POST(url, send).then(this.seeScorePromise);
    },

    // 查看成绩  请求后的处理函数
    seeScorePromise: function (res) {
      this.scoreData = res.data;
      this.seeScoreDialogShow = true;
      this.$store.commit('changeNowDialog', 'seeScoreDialog');
    },

    // 新建文件夹
    newFolder: function (data) {
      let url = this.$INTERFACE.ADD_TRAIN;
      this.$NORMAL_POST(url, data).then(this.newFolderPromise);
    },

    // 新建文件夹  请求后的处理函数
    newFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTrainData();
    },

    // 新建文件
    newFile: function (data) {
      this.newTrainSourceDialogShow = true;
      this.$store.commit('changeNowDialog', 'newTrainSourceDialog');
      this.trainData = data;
    },

    // 新建考试
    newExam: function (data) {
      this.newTrainSourceDialogShow = false;
      this.trainData = data;
      this.newExamDialogShow = true;
      this.$store.commit('changeNowDialog', 'newExamDialog');
    },

    // 关闭新建考试对话框
    closeNewExamDialog: function () {
      this.newExamDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 新建考试
    newExamHandle: function (data) {
      let url = this.$INTERFACE.NEW_EXAMS;
      this.$NORMAL_POST(url, data).then(this.newExamHandlePromise);
    },

    // 新建考试  请求后的处理函数
    newExamHandlePromise: function (res) {
      this.trainData['examination_id'] = res.data.id;
      this.trainExamId = res.data.id;
      this.newTrain();
    },

    // 新建培训
    newTrain: function () {
      let url = this.$INTERFACE.ADD_TRAIN;
      this.$NORMAL_POST(url, this.trainData).then(this.newTrainPromise);
    },

    // 新建培训  请求后的处理函数
    newTrainPromise: function (res) {
      this.getTrainData();
      this.closeNewExamDialog();
      this.newExamDetailShow = true;
      this.$store.commit('changeNowDialog', 'newExamDetail');
    },

    // 关闭考试对话框
    closeExamDetail: function () {
      if (this.examAuth == true) {
        let _this = this;
        this.$confirm('关闭考试编辑框, 将无法再编辑考试, 是否关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _this.newExamDetailShow = false;
          _this.$store.commit('changeNowDialog', '');
        }).catch();
      } else {
        this.newExamDetailShow = false;
        this.$store.commit('changeNowSecDialog', '');
      }
      
    },

    // 删除文件夹或者文件
    deleteFileAndFolder: function (data) {
      let url = this.$INTERFACE.DEL_TRAIN;
      this.$NORMAL_POST(url, data).then(this.deleteFileAndFolderPromise);
    },

    // 删除文件夹或者文件  请求后的处理函数
    deleteFileAndFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTrainData();
    },

    // 查看学生的详细考试状况
    seeExamDetail: function (data) {
      let url = this.$INTERFACE.EXAM_SCORE_DETAIL;
      data['fid'] = this.trainExamId;
      this.$NORMAL_POST(url, data).then(this.seeExamDetailPromise);
    },

    // 查看学生的详细考试状况  请求后的处理函数
    seeExamDetailPromise: function (res) {
      this.examAuth = false;
      this.newExamDetailShow = true;
      this.newExamDetailData = res.data;
      this.examAuth = false;
      this.$store.commit('changeNowSecDialog', 'newExamDetail');
    },

    // 关闭查看成绩对话框
    closeSeeScoreDialog: function () {
      this.seeScoreDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 安排重考
    reExam: function (data) {
      let url = this.$INTERFACE.REEXAM;
      data['fid'] = this.trainExamId;
      data['review'] = 3;
      this.$NORMAL_POST(url, data).then(this.reExamPromise); 
    },

    // 安排重考  请求后的处理函数
    reExamPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.seeScore({ id: this.trainId, examination_id: this.trainExamId });
    }
  }
}
</script>

<style lang="scss" scoped>
.train-file {
  width: 100%;
  height: 100%;
 }
</style>