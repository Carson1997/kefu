<template>
  <div id="examManage" class="exam-manage">
    <fileFolderComponent :customButton="customButton" @seeFile="seeFile" @exposeToBusiness="exposeToBusiness" :fileData="fileData" :fileAuth="fileAuth" class="exam-file"></fileFolderComponent>
    <newExamDialog @newFileHandle="newFileHandle" v-if="newExamDialogShow" :examFileData="examFileData"></newExamDialog>
    <newExamDetail :fatherExamData="newExamDetailData" :examAuth="examAuth" :examId="examId" v-if="newExamDetailShow" @closeExamDetail="closeExamDetail"></newExamDetail>
    <seeScoreDialog @reExam="reExam" @close="closeSeeScoreDialog" @seeExamDetail="seeExamDetail" v-if="seeScoreDialogShow" :tableData="scoreData"></seeScoreDialog>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import newExamDialog from '../../components/newFileDetail/newExamDialog';
import newExamDetail from '../../components/newFileDetail/newExamDetail';
import seeScoreDialog from '../../components/fileDetail/seeScoreDialog';
export default {
  name: 'examManage',

  components: { fileFolderComponent, newExamDialog, newExamDetail, seeScoreDialog },

  data: function () {
    return {
      fileData: [], // 文件夹数据
      newExamDialogShow: false, // 是否显示考试信息基础框
      examFileData: {}, // 考试文件的基础信息
      newExamDetailShow: false, // 是否显示考试纤细框
      examId: '', // 试卷id
      examAuth: false, // 考试编辑的权限
      seeScoreDialogShow: false, // 是否显示查看成绩对话框
      scoreData: [], // 成绩数据
      newExamDetailData: [], // 试卷的数据
      customButton: { // 自定义按钮
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
    this.getData();
  },

  methods: {

    // 获取文件夹数据
    getData: function () {
      let url = this.$INTERFACE.ALL_EXAMS;
      this.$NORMAL_POST(url).then(this.getDataPromise);
    },

    // 获取文件夹数据  请求后的处理函数
    getDataPromise: function (res) {
      let data = res.data;
      for (let i in data) {
        if (new Date(data[i].deadline).getTime() <= new Date().getTime()) {
          data[i]['isCanEdit'] = false;
        }
      }
      this.fileData = res.data;
    },

    // 文件夹组件暴露出来的业务逻辑
    exposeToBusiness: function (data) {
      let order = data.order;
      let value = data.data;
      if (order == 'new_file') { // 新建文件
        this.newFile(value);
      } else if (order == 'new_folder') { // 新建文件夹
        this.newFolder(value);
      } else if (order == 'delete_file') { // 删除文件夹
        this.deleteFileAndFolrder(value);
      } else if (order == 'edit_file') { // 编辑文件
        this.editFile(value);
      } else if (order == 'seeScore') { // 查看成绩
        this.seeScore(value);
      }
    },

    // 查看成绩
    seeScore: function (data) {
      let url = this.$INTERFACE.EXAM_SCORE;
      let send = { id: data.id };
      this.examId = data.id;
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
      let url = this.$INTERFACE.NEW_EXAMS;
      this.$NORMAL_POST(url, data).then(this.newFolderPromise);
    },

    // 新建文件夹  请求后的处理函数
    newFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    },

    // 新建文件
    newFile: function (data) {
      this.newExamDialogShow = true;
      this.$store.commit('changeNowDialog', 'newExamDialog');
      data['type'] = 1;
      this.examFileData = data;
    },

    // 新建文件 请求
    newFileHandle: function (data) {
      let url = this.$INTERFACE.NEW_EXAMS;
      this.$NORMAL_POST(url, data).then(this.newFileHandlePromise);
    },

    // 新建文件  请求后的处理函数
    newFileHandlePromise: function (res) {
      this.examId = res.data.id;
      this.$message({ type: 'success', message: res.info });
      this.newExamDialogShow = false;
      this.getData();
      this.newExamDetailShow = true;
      this.examAuth = true;
      this.$store.commit('changeNowDialog', 'newExamDetail');
    },

    // 关闭试卷对话框
    closeExamDetail: function () {
      this.newExamDetailShow = false;
      if (this.$store.state.NOW_OPEN_DIALOG == 'newExamDetail') {
        this.$store.commit('changeNowDialog', '');
      } else if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'newExamDetail') {
        this.$store.commit('changeNowSecDialog', '');
      }
    },

    // 删除文件或者文件夹
    deleteFileAndFolrder: function (data) {
      let url = this.$INTERFACE.DELETE_EXAM;
      this.$NORMAL_POST(url, data).then(this.deleteFileAndFolrderPromise)
    },

    // 删除文件或者文件夹  请求后的处理函数
    deleteFileAndFolrderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    },

    // 编辑文件
    editFile: function (value) {
      this.examId = value.id;
      this.newExamDetailShow = true;
      this.examAuth = true;
      this.$store.commit('changeNowDialog', 'newExamDetail');
    },

    // 查看文件
    seeFile: function (data) {
      this.examId = data.fid;
      this.newExamDetailShow = true;
      this.examAuth = false;
      this.$store.commit('changeNowDialog', 'newExamDetail');
    },

    // 查看学生的详细考试状况
    seeExamDetail: function (data) {
      let url = this.$INTERFACE.EXAM_SCORE_DETAIL;
      data['fid'] = this.examId;
      this.$NORMAL_POST(url, data).then(this.seeExamDetailPromise);
  },

    // 查看学生的详细考试状况  请求后的处理函数
    seeExamDetailPromise: function (res) {
      this.examAuth = false;
      this.newExamDetailShow = true;
      this.newExamDetailData = res.data;
      this.$store.commit('changeNowSecDialog', 'newExamDetail');
    },

    // 关闭查看成绩查看对话框
    closeSeeScoreDialog: function () {
      this.seeScoreDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 安排补考
    reExam: function (data) {
      let url = this.$INTERFACE.REEXAM;
      data['fid'] = this.examId;
      data['review'] = 3;
      this.$NORMAL_POST(url, data).then(this.reExamPromise); 
    },

    // 安排补考  请求后的处理函数
    reExamPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.seeScore({ id: this.examId });
    }

  }
}
</script>

<style lang="scss" scoped>
.exam-file {
  width: 100%;
  height: 100%;
 }
</style>
