<template>
  <div id="examHistory" class="exam-history">
    <el-input class="search-input" placeholder="请输入用户姓名搜索" v-model="searchInput">
      <template slot="append">
        <span class="el-icon-search"></span>
      </template>
    </el-input>
    <el-table :data="tableDataShow" border style="width: 100%" :height="tableHeight">
      <el-table-column prop="name" label="用户名" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="seeScore(scope.row.id)">查看学生的成绩</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 学生成绩 -->
    <studentScore @close="closeStudentScore" :scoreData="scoreData" :userId="userId" v-if="studentScoreShow"></studentScore>
  </div>
</template>

<script>
import studentScore from '../../components/fileDetail/studentScore';
export default {
  name: 'examHistory',

  components: { studentScore },

  mounted: function () {
    this.getData();
  },

  data: function () {
    return {
      searchInput: '', // 搜索内容
      tableData: [], // 表格数据
      tableHeight: 0, // 表格高度
      scoreData: [], // 成绩数据
      userId: '', // 用户id
      studentScoreShow: false, // 是否显示学生成绩对话框
    }
  },

  computed: {
    tableDataShow: function () { // 显示的表格数据
      if (this.searchInput == '') {
        return this.tableData;
      } else {
        let arr = this.tableData.filter(item => {
          return item.name.indexOf(this.searchInput) > -1;
        })
        return arr;
      }
    }
  },

  methods: {
    
    // 获取数据
    getData: function () {
      let url = this.$INTERFACE.ALL_STUDENT_SCORE;
      this.$NORMAL_POST(url).then(this.getDataPromise);
    },

    // 获取数据  请求后的处理函数
    getDataPromise: function (res) {
      this.tableData = res.data;
      let func = this.$PUBILC.setTableHeight('examHistory', this, 130);
      func();
    },

    // 查看成绩
    seeScore: function (id) {
      this.userId = id;
      let url = this.$INTERFACE.STUDENT_SCORE_DETAIL;
      let send = { user_id: id };
      this.$NORMAL_POST(url, send).then(this.seeScorePromise);
    },

    // 查看成绩  请求后的处理函数
    seeScorePromise: function (res) {
      this.scoreData = res.data;
      this.studentScoreShow = true;
      this.$store.commit('changeNowDialog', 'studentScore');
    },

    // 关闭查看成绩对话框
    closeStudentScore: function () {
      this.studentScoreShow = false;
      this.$store.commit('changeNowDialog', '');
      this.userId = '';
      this.scoreData = [];
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 400px;
  margin-bottom: 15px;

}
</style>