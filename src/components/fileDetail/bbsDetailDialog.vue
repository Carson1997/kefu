<!-- 帖子详细内容 -->
<template>
  <el-dialog title="帖子详细内容" :visible="dialogVisible" width="60%" top="4vh" :close-on-click-modal="false" :before-close="handleClose">
    <div class="input-area" :style="{ height: areaHeight + 'px' }">
      <div class="question-content" ref="questionContent"> <!-- 问题区域 -->
        <h2 class="title"><span>帖子问题:</span></h2>
        <div class="each-detail">
          <span class="name">提问人: </span>
          <span class="value">{{ bbsContent.name }}</span>
        </div>
        <div class="each-detail">
          <span class="name">问题: </span>
          <span class="value">{{ bbsContent.title }}</span>
        </div>
        <div class="each-detail">
          <span class="name">问题描述: </span>
          <span class="value" v-html="bbsContent.content"></span>
        </div>
      </div>
      
      <div class="answer-content"> <!-- 回答区域 -->
        <h2 class="title">帖子问答:</h2>
        <div class="answer-content-area" :style="{ height: answerHeight + 'px' }">
          <div v-for="(item, index) in contentArr" :key="index" class="each-answer">
            <div class="name">
              <span>{{ (index + 1) + '楼: ' + item.name }}:</span>
            </div>
            <div class="value">
              <p class="quote" v-if="item.fatherContent" v-html="item.fatherContent.content">
              </p>
              <p class="answer" v-html="item.content"></p>
            </div>
            <div class="clear"></div>
          </div>
        </div>

      </div>

      <!-- 按钮区域 -->
      <div class="button-area">
        <!-- <el-button type="warning" plain size="mini" v-if="userId == bbsContent.user_id" @click="addAnwer(bbsContent)">追加提问</el-button> -->
        <el-button type="primary" plain size="mini" v-if="userId == bbsContent.teacher_id || userId == bbsContent.user_id" @click="addAnwer">发表评论</el-button>
      </div>
    </div>
    <newBbsContent v-if="newBbsContentShow" @close="closeNewBbsContent" :quote="quoteContent" @submit="submitAnswer"></newBbsContent>
  </el-dialog>
</template>

<script>
import newBbsContent from './newBbsContent';
export default {
  name: 'bbsDetailDialog',

  components: { newBbsContent },

  computed: {

    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'bbsDetailDialog') {
        return true;
      } else {
        return false;
      }
    },

    userId: function () { // 用户的id
      return this.$store.state.USER_ID;
    }

  },

  props: [ 'bbsId' ],

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 160, // 区域高度
      answerHeight: 200, // 回答区域高度
      bbsContent: {}, // 帖子的内容
      contentArr: [], // 帖子的回答
      quoteContent: {}, // 引用时回答的内容
      newBbsContentShow: false, // 是否显示追加对话框
    }
  },

  mounted: function () {
    this.getData();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 获取帖子详细内容
    getData: function () {
      let url = this.$INTERFACE.BBS_CONTENT;
      let send = { id: this.bbsId };
      this.$NORMAL_POST(url, send).then(this.getDataHandle);
    },

    // 获取帖子详细内容  请求后的处理函数
    getDataHandle: function (res) {
      let _this = this;
      this.arrangeAnswerData(res.data.data);
      this.bbsContent = res.data;
      this.$nextTick(function () {
        _this.setHeight();
      })
    },

    // 整理帖子回复的详细数据
    arrangeAnswerData: function (data) {
      let arr = [];
      for (let i in data) {
        if (data[i]['fid'] != data[i]['id']) {
          let obj = JSON.parse(JSON.stringify(data[i]));
          if (data[data[i]['superior_id']]) {
            obj['fatherContent'] = JSON.parse(JSON.stringify(data[data[i]['superior_id']]));
            obj['fatherContent']['content'] = '<span style="margin-left: -10px">' + obj['fatherContent']['name'] + ': </span><span>' + obj['fatherContent']['content'] + '</span>';
          }
          arr.push(obj);
        } else {
          arr.push(data[i]);
        }
      }
      this.contentArr = arr;
    },

    // 设置高度  answerHeight
    setHeight: function () {
      let height = this.$refs.questionContent.clientHeight;
      this.answerHeight = this.areaHeight - height - 105;
    },

    // 回答问题或者追加
    addAnwer: function () {
      this.newBbsContentShow = true;
      this.$store.commit('changeNowSecDialog', 'newBbsContent');
      this.quoteContent = this.contentArr;
    },

    // 关闭回答问题的对话框
    closeNewBbsContent: function () {
      this.newBbsContentShow = false;
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' });
      this.$store.commit('changeNowSecDialog', '');
    },

    // 提交回答或者提问
    submitAnswer: function (data) {
      let url = this.$INTERFACE.ANSWER_BBS;
      data['fid'] = this.bbsId;
      this.$NORMAL_POST(url, data).then(this.submitAnswerPromise);
    },

    // 提交  请求后的处理函数
    submitAnswerPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.closeNewBbsContent();
      this.getData();
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #e2e2e2;
  position: relative;
}

.question-content {
  width: 98%;
  margin: 0 auto;
  margin-top: 10px;
  font-size: 16px;
  border: solid 1px #f3f3f3;
  box-shadow: 0 0 1px #b1b1b1;
}

.title {
  font-size: 14px;
  line-height: 30px;
  font-weight: 400;
  border-bottom: solid 1px #e9e9e9;
  padding-left: 20px;
  color: #333;
}

.question-content .each-detail {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-left: 30px;
}

.question-content .each-detail .name {
  display: block;
  float: left;
  width: 100px;
  padding-left: 5px;
}

.question-content .each-detail .value {
  letter-spacing: .5px;
  border-bottom: solid 1px lightgray;
}

.answer-content {
  width: 98%;
  margin: 0 auto;
  margin-top: 10px;
  border: solid 1px #f3f3f3;
  box-shadow: 0 0 1px #b1b1b1;
  font-size: 16px;
}

.answer-content-area {
  overflow: auto;
}

.each-answer {
  width: 98%;
  margin: 15px auto;
  padding-left: 15px;
  line-height: 25px;
  border-bottom: solid 1px #dddddd;
  padding-bottom: 5px;
}

.each-answer .name {
  display: block;
  float: left;
  width: 130px;
  font-size: 14px;
}

.each-answer .quote {
  background: #f1f1f1;
  padding: 5px 20px;
  font-size: 14px;
  border-radius: 5px;
  line-height: 23px;
  margin-bottom: 5px;
  color: #777777;
}

.add-button {
  margin-left: 10px;
}

.each-answer .value {
  letter-spacing: .5px;
  width: calc(100% - 130px);
  float: left;
  font-size: 15px;
  padding-left: 10px;
}

.answer {
  padding: 0 10px;
}

.answer-button {
  margin-left: 30px;
  font-size: 14px;
}

.button-area {
  position: absolute;
  left: 20px;
  bottom: 10px;
}

</style>