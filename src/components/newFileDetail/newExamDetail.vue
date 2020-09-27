<!-- 考试详细 -->
<template>
  <el-dialog title="试卷详细" :visible="dialogVisible" append-to-body width="98%" top="4vh" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="input-area" :style="{ height: areaHeight + 'px' }">
      <div class="now-fraction yours" v-if="Object.keys(fatherExamData).length > 0"><span>您的得分: </span><span>{{ yourFraction }}分</span></div>
      <div class="control-area" v-if="examAuth"> <!-- 控制按钮区域 -->
        <span class="now-fraction"><span>当前已分配: </span><span>{{ nowFraction }}分</span></span>
        <el-button class="each-button" type="primary" plain size="small" @click="uploadWord">word文档导入试题</el-button>
        <input type="file" class="none" ref="wordUpload" @change="uploadWordChange">
        <el-button class="each-button" type="success" plain size="small" @click="download">下载试题模版</el-button>
        <el-button class="each-button" type="warning" plain size="small" @click="createSubject">创建试题</el-button>
      </div>
      <div class="detail-area"> <!-- 详细区域 -->
        <el-tabs v-model="subjectType" type="card">
          <el-tab-pane label="单选题" name="1"></el-tab-pane>
          <el-tab-pane label="多选题" name="2"></el-tab-pane>
        </el-tabs>
        <div class="subject-detail">
          <div class="each-subject" v-for="(item, index) in examData[subjectType]" :key="index">
            <div class="each-subject-title">
              <span class="subject-index">{{ index + 1 }}: </span>
              <span class="subject-title">{{ item.title }}: </span>
              <span class="subject-fraction">({{ item.fraction }}分)</span>
              <span class="your-choose" v-if="Object.keys(fatherExamData).length > 0">你的选择: {{ item.userSelect }}</span>
              <div class="each-subject-control">
                <el-button type="primary" size="mini" plain @click="editSubject(item)" v-if="examAuth">修改</el-button>
                <el-button type="danger" size="mini" plain @click="deleteSubject(item.id)" v-if="examAuth">删除</el-button>
              </div>
            </div>
            <div class="option-area">
              <div class="each-option-area" v-for="(itemSec, index) in item.opt" :key="index" :class="itemSec.isAnswer == true ? 'answer' : ''">
                <span class="each-option-area-name">{{ itemSec.index }}.</span>
                <span class="each-option-area-value">{{ itemSec.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <createSubjectDialog @closeExamDetail="closeExamDetail" @addSubject="addSubject" @operateOptions="operateOptions" v-if="createSubjectDialogShow" :subjectData="subjectData"></createSubjectDialog>
  </el-dialog>
</template>

<script>
import createSubjectDialog from '../newFileDetail/createSubjectDialog';
import mammoth from "mammoth";
export default {
  name: 'newExamDetail.vue',

  props: [ 'examId', 'examAuth', 'fatherExamData' ],
  
  computed: {

    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newExamDetail' || this.$store.state.NOW_OPEN_SEC_DIALOG == 'newExamDetail') {
        return true;
      } else {
        return false;
      }
    }

  },

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 150, // 输入区域的高度
      subjectType: '1', // 当前的题目的类型
      createSubjectDialogShow: false, // 是否显示创建试题的对话框
      subjectData: {}, // 编辑的试题
      examData: {}, // 考试数据
      nowFraction: 0, // 已经分配的分数
      showAnser: false,
      yourFraction: '', // 你的得分
    }
  },

  components: { createSubjectDialog },

  mounted: function () {
    this.getExamContent();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('closeExamDetail');
    },

    // 获取试卷内容
    getExamContent: function () {
      if (Object.keys(this.fatherExamData).length == 0) {
        let url = this.$INTERFACE.EXAM_DETAIL;
        let send = { fid: this.examId };
        this.$NORMAL_POST(url, send).then(this.getExamContentPromise);
        this.showAnser = false;
      } else {
        this.yourFraction = this.fatherExamData.score;
        this.showAnser = true;
        let data = { data: this.fatherExamData.list };
        this.getExamContentPromise(data);
      }
    },

    // 获取试卷内容  请求后的处理函数
    getExamContentPromise: function (res) {
      let data = res.data;
      let obj = { '1': [], '2': [] };
      for (let i in data) {
        obj[data[i].type].push(data[i]);
        this.nowFraction += parseFloat(data[i].fraction);
      }
      this.examData = obj;
    },

    // 创建试题
    createSubject: function () {
      let subject = { id: undefined, title: '', type: '', fraction: '', options: [{ index: 'A', value: '' }] };
      this.subjectData = subject;
      this.createSubjectDialogShow = true;
      this.$store.commit('changeNowSecDialog', 'createSubjectDialog');
    },

    // 关闭创建试题对话框
    closeExamDetail: function () {
      this.createSubjectDialogShow = false;
      this.$store.commit('changeNowSecDialog', '');
    },

    // 创建试题组件: 添加选项 或者 删除选项 
    operateOptions: function (data) {
      let obj = JSON.parse(JSON.stringify(this.subjectData));
      if (data == 'add') { // 添加
        let index = obj['options'][obj['options'].length - 1].index;
        index = index.charCodeAt(0) + 1;
        obj['options'].push({ index: String.fromCharCode(index), value: '' });
      }else if (data == 'pop') { // 删除
        obj['options'].pop();
      }
      this.subjectData = JSON.parse(JSON.stringify(obj));
    },

    // 提交试题
    addSubject: function (data) {
      let url = this.$INTERFACE.ADD_SUBJECT;
      data['fid'] = this.examId;
      this.$NORMAL_POST(url, data).then(this.addSubjectPromise);
    },

    // 提交试题  请求后的处理函数
    addSubjectPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getExamContent();
    },

    // 删除试题
    deleteSubject: function (data) {
      let _this = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        let url = _this.$INTERFACE.DEL_SUBJECT;
        let send = { fid: _this.examId, id: data };
        _this.$NORMAL_POST(url, send).then(_this.deleteSubjectPromise);
      }).catch();
    },

    // 删除试题  请求后的处理函数
    deleteSubjectPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getExamContent();
    },

    // 编辑试题
    editSubject: function (data) {
      let subject = { id: data.id, options: data.opt, fraction: data.fraction, type: data.type, title: data.title };
      this.subjectData = subject;
      this.createSubjectDialogShow = true;
      this.$store.commit('changeNowSecDialog', 'createSubjectDialog'); 
    },

    // word文档导入试题按钮被点击
    uploadWord: function () {
      this.$refs.wordUpload.click();
    },

    // 上传word文档导入试题  上传的文件发生改变
    uploadWordChange: function (event) {
      let _this = this;
      let file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = function (event) {
        let data = event.target.result;
        _this.parseWord(data);
      }
      fileReader.readAsArrayBuffer(file);
    },

    // 解析上传的word文档
    parseWord: function (data) {
      mammoth.convertToHtml({ arrayBuffer: data }).then(this.arranWordData).done();
    },

    // 整理word文档的数据
    arranWordData: function (res) {
      let subjects = res.value.split("</p>");
      let arr = []; // 所有的题目
      let eachSubject; // 每一道题目
      try {
        for (let i = 0; i < subjects.length; i++) {
          if (subjects[i] != '') {
            subjects[i] = subjects[i].substring(3);
            if (subjects[i].substr(0, 1) == '*') { // 题目
              if (typeof eachSubject == 'object') {
                eachSubject['opt'] = JSON.stringify(eachSubject['opt']);
                arr.push(eachSubject);
              }
              eachSubject = { opt: [] };
              let fractionBegin = subjects[i].lastIndexOf('【'); // 分数
              let fractionEnd = subjects[i].lastIndexOf('】');
              let answerBegin = subjects[i].lastIndexOf('（'); // 选项
              let answerEnd = subjects[i].lastIndexOf('）');
              eachSubject['title'] = subjects[i].slice(3, answerBegin);
              eachSubject['answers'] = subjects[i].slice(answerBegin + 1, answerEnd);
              eachSubject['fraction'] = subjects[i].slice(fractionBegin + 1, fractionEnd -1);
              eachSubject['type'] = eachSubject['answers'].length > 1 ? '2' : '1';
            } else {
              let indexIndex = subjects[i].indexOf('.');
              let each = { index: subjects[i].slice(0, indexIndex), value: subjects[i].slice(indexIndex + 1) };
              if (eachSubject['answers'].indexOf(each['index']) > -1) {
                each['isAnswer'] = true;
              }
              eachSubject['opt'].push(each);
            }
          }
          
        }
        eachSubject['opt'] = JSON.stringify(eachSubject['opt']);
        arr.push(eachSubject);
        this.batchAddSubject(arr);
      } catch (error) {
        this.$message({ type: 'error', message: '文档格式有问题' + error + ', 请检查后再上传' });
        return false;
      }
    },

    // 批量上传试题
    batchAddSubject: function (data) {
      let url = this.$INTERFACE.BATCH_ADD_SUBJECT;
      let send = { data: JSON.stringify(data), fid: this.examId };
      this.$NORMAL_POST(url, send).then(this.batchAddSubjectPromise);
    },

    // 批量上传试题  请求后的处理函数
    batchAddSubjectPromise: function (res) {
      this.$refs.wordUpload.value = '';
      this.$message({ type: 'success', message: res.info });
      this.getExamContent();
    },

    // 下载试题模版
    download: function () {
      let url = this.$INTERFACE.ADD_SUBJUECT_TEMPLATE;
      console.log(url)
      window.open(url);
    }
  }
}
</script>

<style lang="scss" scoped>

.input-area {
  width: 100%;
  border-top: solid 1px #e9e9e9;
}

.control-area {
  padding: 20px;
  padding-bottom: 0px;
}

.now-fraction {
  margin-right: 10px;
  color: indianred;
  font-weight: 500;
}

.each-button {
  margin-right: 10px;
}

.detail-area {
  width: 98%;
  margin: 0 auto;
  height: calc(100% - 90px);
  background: white;
  margin-top: 20px;
}

.subject-detail {
  width: 100%;
  height: calc(100% - 42px);
  box-shadow: 0 0 1px #b8b8b8;
  background: white;
  overflow: auto;
}

.subject-detail {
  padding: 20px;
}

.subject-detail .each-subject {
  padding: 15px;
  font-size: 16px;
  border-bottom: solid 1px rgb(238, 238, 238);
}

.subject-detail .each-subject .each-subject-title {
  font-size: 18px;
}

.each-subject-control {
  display: inline;
  margin-left: 20px;
}

.subject-detail .each-subject .each-subject-title .subject-index {
  margin-right: 5px;
  font-weight: 500;
}

.subject-detail .each-subject .each-subject-title .subject-title {
  font-weight: 500;
  letter-spacing: .5px;
}

.subject-detail .each-subject .each-subject-title .subject-fraction {
  font-weight: 400;
  font-size: 16px;
}

.subject-detail .each-subject .option-area {
  padding-left: 20px;
  margin-top: 10px;
}

.subject-detail .each-subject .option-area .each-option-area {
  margin: 5px 0;
}

.subject-detail .each-subject .option-area .each-option-area-name {
  margin-right: 10px;
  font-weight: 500;
}

.subject-detail .each-subject .option-area .each-option-area-value {
  letter-spacing: .5px;
}

.answer {
  color: #118f11;
}

.none {
  display: none;
}

.yours {
  padding-top: 20px;
  padding-left: 20px; 
}

.your-choose {
  margin-left: 20px;
  color: indianred;
}

</style>
