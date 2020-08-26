<template>
  <div class="my-exam" id="myExam">
    <el-table class="table-area" :data="tableData" border style="width: 100%" :height="tableHeight">
      <el-table-column prop="name" label="试卷名" align="center"></el-table-column>
      <el-table-column prop="score" label="我的分数" align="center"></el-table-column>
      <el-table-column prop="score_line" label="及格分数线" align="center"></el-table-column>
      <el-table-column prop="passing" label="通过后获得学分" align="center"></el-table-column>
      <el-table-column label="考试时长" align="center">
        <template slot-scope="scope">
          {{ scope.row.countdown + '分钟' }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="发布时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="takeExam(scope.row)" v-if="scope.row.review == 0">参加考试</el-button>
          <span v-if="scope.row.review == 1">已过关</span>
          <span v-if="scope.row.review == 2">不及格, 等待补考</span>
          <el-button type="warning" size="mini" plain @click="takeExam(scope.row)" v-if="scope.row.review == 3">参加补考</el-button>
        </template>
      </el-table-column>
    </el-table>
    <takeExam v-if="takeExamShow" :examTime="examTime" :examData="examData" @postExam="postExam"></takeExam>
    <newExamDetail @closeExamDetail="closeExamDetail" v-if="newExamDetailShow" :fatherExamData="postExamData" :examAuth="false"></newExamDetail>
  </div>
</template>

<script>
import takeExam from '../../components/fileDetail/takeExam';
import newExamDetail from '../../components/newFileDetail/newExamDetail';
export default {
  name: 'myExam',

  components: { takeExam, newExamDetail },

  data: function () {
    return {
      tableData: [], // 表格数据
      tableHeight: document.body.clientHeight - 160,
      takeExamShow: false, // 是否显示考试框
      examData: [], // 考试的数据
      examId: '', // 考试id
      postExamData: [], // 提交后的考试数据
      newExamDetailShow: false, // 是否显示试卷详细对话框
      examTime: '', // 考试时长
    }
  },

  mounted: function () {
    this.getExamsData();
  },

  methods: {

    // 获取所有的考试数据
    getExamsData: function () {
      let url = this.$INTERFACE.STUDENT_ALL_EXAMS;
      this.$NORMAL_POST(url).then(this.getExamsDataPromise)
    },

    // 获取所有的考试数据  请求后的处理函数
    getExamsDataPromise: function (res) {
      this.tableData = res.data;
    },

    // 参加考试
    takeExam: function (data) {
      this.examTime = data.countdown; // 考试时长
      let url = this.$INTERFACE.EXAM_DETAIL;
      let send = { fid: data.id };
      this.examId = data.id;
      this.$NORMAL_POST(url, send).then(this.takeExamPromise);
    },

    // 参加考试  请求后的处理函数
    takeExamPromise: function (res) {
      this.examData = res.data;
      this.takeExamShow = true;
      this.$store.commit('changeNowDialog', 'takeExam');
    },

    // 提交考试
    postExam: function (data) {
      let url = this.$INTERFACE.POST_EXAM;
      let send = { fid: this.examId, result: data };
      this.$NORMAL_POST(url, send).then(this.postExamPromise);
    },

    // 提交考试  请求后的处理函数
    postExamPromise: function (res) {
      this.takeExamShow = false;
      this.postExamData = res.data;
      this.newExamDetailShow = true;
      this.getExamsData();
      this.$store.commit('changeNowDialog', 'newExamDetail');
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