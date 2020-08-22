<!-- 参加考试 -->
<template>
  <el-dialog title="考试详情" :visible="dialogVisible" width="50%" :before-close="handleClose" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="exam-area">
      <div class="each-subject">
        <div class="subject-title">
          <span class="subject-index">{{ examIndex + 1 }}. </span>
          <span class="subject-title-title">{{ examData[examIndex]['title'] }}: </span>
        </div>
        <div class="subject-options">
          <div class="subject-each-option" v-for="item in examData[examIndex].opt" :key="item.index">
            <el-radio v-if="examData[examIndex].type == 1" :label="item.index" v-model="examData[examIndex].userSelect">{{ item.value }}</el-radio> <!-- 单选 -->
            <el-checkbox-group v-else v-model="examData[examIndex].userSelect"> <!-- 多选 -->
              <el-checkbox :label="item.index">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div>
        <el-progress class="progress" :percentage="parseFloat((100 * (examIndex + 1) / examData.length).toFixed(0))"></el-progress>
        <el-button @click="next" type="primary" plain size="mini">{{ examIndex + 1 == examData.length ? '提交' : '下一题' }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'takeExam',

  computed: {

    dialogVisible: function () { // 控制框的显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'takeExam') {
        return true;
      } else {
        return false;
      }
    }

  },
  
  data: function () {
    return {
      examIndex: 0, // 做题的下标
    }
  },

  props: [ 'examData' ],

  methods: {

    // 关闭参加考试框
    handleClose: function () {},

    // 下一题
    next: function () {
      if (this.examData[this.examIndex].userSelect != '') {
        if (this.examIndex + 1 < this.examData.length) {
          this.examIndex++;
        } else {
          let arr = [];
          let obj = JSON.parse(JSON.stringify(this.examData));
          for (let i in obj) {
            if (Array.isArray(obj[i].userSelect)) {
              obj[i].userSelect = obj[i].userSelect.join('|');
            }
            arr.push(obj[i].userSelect);
          }
          this.$emit('postExam', arr.toString());
        }
      } else {
        this.$message({ type: 'error', message: '请选择了这题的答案后再做下一题' });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.exam-area {
  width: 100%;
  padding: 10px;
  border-top: solid 1px #e7e7e7;
}

.subject-title {
  font-size: 16px;
  font-weight: 500;
}

.subject-title .subject-index {
  margin-right: 10px;
}

.each-subject {
  padding: 0 10px;
  padding-top: 10px;
  border-bottom: solid 1px #e7e7e7;
  margin-bottom: 10px;
}

.subject-options {
  padding: 10px 20px;
}

.subject-each-option {
  margin: 8px 0;
}

.subject-each-option .index {
  margin-right: 5px;
}

.progress {
  line-height: 30px;
  float: left;
  width: 90%;
  margin-right: 15px;
}
</style>