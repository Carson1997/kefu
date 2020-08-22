<!-- 创建试题 -->
<template>
  <el-dialog title="编辑试题" append-to-body top="5vh" :visible="dialogVisible" width="40%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">题目名称:</span>
        <el-input class="value" v-model="subjectData.title" placeholder="请输入题目名称"></el-input>
      </div>
      <div class="each-input">
        <span class="name">题目分数:</span>
        <el-input class="value" v-model="subjectData.fraction" placeholder="请输入题目分数"></el-input>
      </div>
      <div class="each-input">
        <span class="name">题目类型:</span>
        <el-select class="value" v-model="subjectData.type" placeholder="请选择题目类型" @change="subjectTypeChange">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="each-input">
        <span class="name">题目答案:</span>
        <el-select :key="eachIndex" class="value" v-model="answers" placeholder="请选择题目类型" :multiple="subjectData.type == 2">
          <el-option v-for="item in subjectData.options" :key="item.index" :label="item.index" :value="item.index"></el-option>
        </el-select>
      </div>

      <div class="answer-options">
        <h2 class="answer-options-title">题目的被选项</h2>
        <div class="each-option" v-for="(item, index) in subjectData.options" :key="index">
          <span class="each-option-name">{{ item.index }}</span>
          <el-input class="each-option-value" v-model="item.value" placeholder="请输入内容"></el-input>
          <div class="each-control-area">
            <el-button type="primary" icon="el-icon-plus" circle plain size="mini" v-if="index + 1 == subjectData.options.length" @click="operateOptions('add')"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle plain size="mini" v-if="index + 1 == subjectData.options.length && subjectData.options.length > 1" @click="operateOptions('pop')"></el-button>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <el-button type="primary" plain size="small" class="center" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'createSubjectDialog',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'createSubjectDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  data: function () {
    return {
      typeOptions: [ // 题目类型选项
        { id: '1', name: '单选题' },
        { id: '2', name: '多选题' },
      ],
      answers: '', // 题目的答案
      eachIndex: 1,
    }
  },

  props: [ 'subjectData' ],

  mounted: function () {
    this.initAnswers();
  },

  methods: {

    // 初始化答案
    initAnswers: function () {
      let arr = [];
      for (let i in this.subjectData.options) {
        console.log(this.subjectData.options[i])
        if (this.subjectData.options[i]['isAnswer'] == true) {
          arr.push(this.subjectData.options[i]['index']);
        }
      }
      this.answers = this.subjectData.type == '1' ? arr.join(',') : arr;
    },

    // 关闭对话框
    handleClose: function () {
      this.$emit('closeExamDetail');
    },

    // 操作被选项
    operateOptions: function (order) {
      this.$emit('operateOptions', order);
    },

    // 题目类型发生变化
    subjectTypeChange: function () {
      if (this.subjectData.type == 1) {
        this.answers = '';
      } else {
        this.answers = [];
      }
      this.eachIndex += 1;
    },

    // 提交试题
    submit: function () {
      let legitimacy = this.checkLegitimacy();
      if (legitimacy == true) {
        let obj = JSON.parse(JSON.stringify(this.subjectData));
        let options = obj.options;
        for (let i in options) {
          if (this.answers.indexOf(options[i].index) > -1) {
            options[i]['isAnswer'] = true;
          } else {
            options[i]['isAnswer'] = false;
          }
        }
        obj.options = JSON.stringify(obj.options);
        this.handleClose();
        this.$emit('addSubject', obj);
      }
    },

    // 检测合法性
    checkLegitimacy: function () {
      if (this.subjectData.title == '') {
        this.$PUBILC.alert(this, '请输入题目名');
        return false;
      }
      if (this.subjectData.fraction == '') {
        this.$PUBILC.alert(this, '请输入分数');
        return false;
      }
      if (this.subjectData.type === '') {
        this.$PUBILC.alert(this, '请选择类型');
        return false;
      }
      if (this.answers == '' || this.answers.length == 0) {
        this.$PUBILC.alert(this, '请选择题目的答案');
        return false;
      }
      if (this.subjectData.options.length == 1) {
        this.$PUBILC.alert(this, '备选项只有一个');
        return false;
      }
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  padding: 20px;
  overflow: auto;
  border-top: solid 1px #e6e6e6;
  max-height: 600px;
  padding-bottom: 10px;
}

.each-input {
  width: 100%;
  margin-bottom: 10px;
}

.each-input .name {
  margin-bottom: 5px;
  display: block;
  padding-left: 5px;
}

.each-input .value {
  width: 100%;
}

.each-option {
  width: 100%;
  margin-bottom: 10px;
}

.each-option .each-option-name {
  width: 60px;
  float: left;
  display: block;
  text-align: center;
  line-height: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: solid 1px #dcdfe6;
  border-right: none;
}

.each-option .each-option-value {
  width: calc(100% - 160px);
  float: left;
}

.each-control-area {
  width: 100px;
  line-height: 40px;
  float: left;
  padding-left: 10px;
}

.answer-options {
  width: 100%;
}

.answer-options-title {
  font-size: 16px;
  margin-bottom: 10px;
}

.center {
  display: block;
  margin: 0 auto;
  margin-top: 15px;
}
</style>