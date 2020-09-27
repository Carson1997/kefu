<template>
  <el-dialog title="学生历史考试成绩" :visible="dialogVisible" top="7vh" width="50%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <el-table :data="scoreData" style="width: 100%" border :height="tableHeight">
        <el-table-column prop="name" label="试卷名称" align="center"></el-table-column>
        <el-table-column prop="score" label="试卷分数" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="seeDetail(scope.row.fid)">查看详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <newExamDetail @closeExamDetail="closeExamDetail" v-if="newExamDetailShow" :examAuth="false" :fatherExamData="examData"></newExamDetail>
  </el-dialog>
</template>

<script>
import newExamDetail from '../../components/newFileDetail/newExamDetail';
export default {
  name: 'studentScore',

  props: [ 'scoreData', 'userId' ],

  components: { newExamDetail },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'studentScore') {
        return true;
      } else {
        return false;
      }
    },
  },

  data: function () {
    return {
      tableHeight: document.body.clientHeight - 250, // 表格高度
      examData: [], // 表格数据
      newExamDetailShow: false, // 是否显示考试详细
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 查看详细成绩
    seeDetail: function (fid) {
      let url = this.$INTERFACE.EXAM_SCORE_DETAIL;
      let send = { fid: fid, user_id: this.userId };
      this.$NORMAL_POST(url, send).then(this.seeDetailPromise);
    },

    // 查看详细成绩  请求后的处理函数
    seeDetailPromise: function (res) {
      this.examData = res.data;
      this.newExamDetailShow = true;
      this.$store.commit('changeNowSecDialog', 'newExamDetail');
    },

    // 关闭试卷详细
    closeExamDetail: function () {
      this.examData = [];
      this.newExamDetailShow = false;
      this.$store.commit('changeNowSecDialog', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #e7e7e7;
  padding: 20px;
}
</style>
