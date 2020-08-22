<!-- 查看培训或者考试的成绩 -->
<template>
  <el-dialog title="查看学生情况" top="10vh" :visible="dialogVisible" width="70%" :before-close="handleClose" :close-on-click-modal="false">
    <el-table :data="tableData" style="width: 100%" border :height="tableHeight">
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="time_consuming" label="学习时间" align="center"></el-table-column>
      <el-table-column prop="score" label="考试成绩" align="center"></el-table-column>
      <el-table-column prop="score" label="考试状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.review == 0 ? '未参加考试' : scope.row.review == 1 ? '过关' : scope.row.review == 2 ? '不及格, 待安排补考' : '已安排补考' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="seeDetail(scope.row.id)">查看详细试卷</el-button>
          <el-button type="warning" size="mini" plain v-if="scope.row.review == 2" @click="reExam(scope.row.id)">安排补考</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'seeScoreDialog',

  computed: {
    dialogVisible: function () { // 显示框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'seeScoreDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'tableData' ],

  data: function () {
    return {
      tableHeight: '500px'
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 查看详细试卷
    seeDetail: function (id) {
      this.$emit('seeExamDetail', { user_id: id });
    },

    // 安排补考
    reExam: function (id) {
      this.$emit('reExam', { user_id: id });
    }
  }
}
</script>