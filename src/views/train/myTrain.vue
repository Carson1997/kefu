<template>
  <div class="my-train" id="myTrain">
    <el-table class="table-area" :data="tableData" border style="width: 100%" :height="tableHeight">
      <el-table-column prop="name" label="培训名" align="center"></el-table-column>
      <el-table-column prop="score" label="测试分数" align="center"></el-table-column>
      <el-table-column prop="score_line" label="分数线" align="center"></el-table-column>
      <el-table-column prop="date" label="时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="takeTrain(scope.row)" v-if="scope.row.review == 0">参加学习</el-button>
          <span v-if="scope.row.review == 1">已过关</span>
          <span v-if="scope.row.review == 2">不及格, 待安排补考</span>
          <el-button type="primary" plain size="mini" @click="takeTrain(scope.row)" v-if="scope.row.review == 3">参加补考</el-button>
        </template>
      </el-table-column>
    </el-table>
    <myTrainDetail @finishTrain="finishTrain" v-if="myTrainDetailShow" :trainData="trainData"></myTrainDetail>
    <takeExam :examTime="examTime" v-if="takeExamShow" :examData="examData" @postExam="postExam"></takeExam>
    <newExamDetail @closeExamDetail="closeExamDetail" v-if="newExamDetailShow" :fatherExamData="postExamData" :examAuth="false"></newExamDetail>

  </div>
</template>

<script>
import myTrainDetail from '../../components/fileDetail/myTrainDetail';
import takeExam from '../../components/fileDetail/takeExam';
import newExamDetail from '../../components/newFileDetail/newExamDetail';
export default {
  name: 'myTrain',

  components: { myTrainDetail, takeExam, newExamDetail },

  data: function () {
    return {
      tableData: [], // 表格数据
      tableHeight: document.body.clientHeight - 160,
      myTrainDetailShow: false, // 是否显示培训框
      trainData: [], // 培训的数据
      time: '', // 开始培训的时间
      nowTrainData: {}, // 当前培训的数据
      takeExamShow: false, // 是否显示考试
      examData: [], // 考试数据
      newExamDetailShow: false, // 是否显示考试详细框
      postExamData: [], // 提交考试的答案
      examTime: '', // 考试时间
    }
  },

  mounted: function () {
    this.getAllTrain();
  },

  methods: {

    // 获取所有的培训
    getAllTrain: function () {
      let url = this.$INTERFACE.STUDENT_TRAIN;
      this.$NORMAL_POST(url).then(this.getAllTrainPromise);
    },

    // 获取所有的培训  请求后的处理函数
    getAllTrainPromise: function (res) {
      this.tableData = res.data;
    },

    // 参加培训
    takeTrain: function (data) {
      this.examTime = data.countdown;
      this.nowTrainData = data;
      let url = this.$INTERFACE.STUDENT_TRAIN_DETAIL;
      let send = { id: data.id };
      this.$NORMAL_POST(url, send).then(this.takeTrainPromise);
    },

    // 参加培训  请求后的处理函数
    takeTrainPromise: function (res) {
      this.trainData = res.data;
      this.time = new Date().getTime();
      this.myTrainDetailShow = true;
      this.$store.commit('changeNowDialog', 'myTrainDetail');
    },

    // 完成培训  请求考试
    finishTrain: function () {
      let url = this.$INTERFACE.EXAM_DETAIL;
      let send = { fid: this.nowTrainData.examination_id };
      this.$NORMAL_POST(url, send).then(this.finishTrainPromise);
    },

    // 请求考试  请求后的处理函数
    finishTrainPromise: function (res) {
      this.myTrainDetailShow = false;
      this.takeExamShow = true;
      this.$store.commit('changeNowDialog', 'takeExam');
      this.examData = res.data;
    },

    // 提交考试
    postExam: function (data) {
      let url = this.$INTERFACE.POST_EXAM;
      let send = { fid: this.nowTrainData.examination_id, result: data, time_consuming: new Date().getTime() - this.time };
      this.$NORMAL_POST(url, send).then(this.postExamPromise);
      this.getAllTrain();
    },

    // 提交考试  请求后的处理函数
    postExamPromise: function (res) {
      this.newExamDetailShow = true;
      this.postExamData = res.data;
      this.$store.commit('changeNowDialog', 'newExamDetail');
      this.takeExamShow = false;
      this.$message({ type: 'success', message: '提交成功' });
      this.getAllTrain();
    },

    // 关闭考试详细
    closeExamDetail: function () {
      this.newExamDetailShow = false;
      this.$store.commit('changeNowDialog', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.table-area {
  width: 100%;
  box-shadow: 0 0 1px lightgray;
}
</style>