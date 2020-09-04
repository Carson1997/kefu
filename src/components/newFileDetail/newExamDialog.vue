<!-- 新建考试对话框 -->
<template>
  <el-dialog title="编辑考试的基础信息" :visible="dialogVisible" width="45%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">试卷文件名: </span>
        <el-input class="value" v-model="examFileData.name" placeholder="请输入内容" :disabled="true"></el-input>
      </div>
      <div class="each-input">
        <span class="name">考试通过后得到的学分:</span>
        <el-input class="value" v-model="credit" placeholder="请输入内容" @change="formatValue('credit')"></el-input>
      </div>
      <div class="each-input">
        <span class="name">通过考试的最低分数:</span>
        <el-input class="value" v-model="minScore" placeholder="请输入内容" @change="formatValue('minScore')"></el-input>
      </div>
      <div class="each-input">
        <span class="name">考试时长:</span>
        <el-input type="number" class="value" placeholder="请输入考试时间" v-model="examTime" @change="formatValue('examTime')">
          <template slot="append">分钟</template>
        </el-input>
      </div>
      <div class="each-input" v-if="examFileData.type == 1">
        <span class="name">系统自动下发试卷的时间:</span>
        <el-date-picker :picker-options="pickerOptions" class="value" v-model="distributionTime" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <el-button type="primary" plain class="button" size="small" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newExamDialog',

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'newExamDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  data: function () {
    return {
      credit: '', // 学分
      minScore: '', // 通过的最低分数
      distributionTime: '', // 发布的时间
      examTime: '', // 考试时间
      pickerOptions: { // 配置日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      }
    }
  },

  props: [ 'examFileData' ],

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 限制输入框
    formatValue: function (value) {
      if (parseInt(this[value]).toString() == 'NaN') {
        this[value] = '';
        this.$PUBILC.alert(this, '请输入正整数');
      } else {
        this[value] = parseInt(this[value]);
      }
    },

    // 提交
    submit: function () {
      if (this.credit == '') {
        this.$PUBILC.alert(this, '请输入考试通过后得到的学分:');
        return false;
      }
      if (this.minScore == '') {
        this.$PUBILC.alert(this, '请输入通过考试的最低分数:');
        return false;
      }
      if (this.examTime == '') {
        this.$PUBILC.alert(this, '请输入考试的时长:');
        return false;
      }
      if (this.examFileData.type == 1 && this.distributionTime == '') {
        this.$PUBILC.alert(this, '请选择系统自动下发试卷的时间:');
        return false;
      }
      let obj = JSON.parse(JSON.stringify(this.examFileData));
      obj['passing'] = this.credit;
      obj['score_line'] = this.minScore;
      obj['countdown'] = this.examTime;
      if (this.examFileData.type == 1) {
        obj['deadline'] = this.distributionTime;
      }
      obj['type'] = this.examFileData.type;
      this.handleClose();
      this.$emit('newFileHandle', obj);
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  padding: 10px 20px;
  border-top: solid 1px lightgray;
}

.each-input{
  width: 100%;
  margin-bottom: 10px;
}

.each-input .name {
  padding: 8px 5px;
  display: block;
}

.each-input .value {
  margin: 5px 10px;
  width: 98%;
}

.button {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}

</style>
