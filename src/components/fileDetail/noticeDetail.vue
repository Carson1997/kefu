<template>
  <el-dialog title="文章详情" append-to-body :visible="dialogVisible" width="98%" top="3vh" :before-close="handleClose" :close-on-click-modal="false">
    <div class="detail-area" v-bind:style="{ height: detailHeight + 'px' }">
      <h2 class="detail-title">{{ noticeDataDetail.title }}</h2>
      <div class="keyword">
        <span>关键词: </span>
        <span>{{ noticeDataDetail.keyword }}</span>
      </div>
      <div class="detail-message">
        <span>{{ noticeDataDetail.author }}: </span>
        <span span class="detail-time">{{ noticeDataDetail.update_time }}</span>
        <span class="code">文章编码: {{ noticeDataDetail.showId }}</span>
      </div>
      <div class="clear"></div>
      <div class="detail-content" v-html="detailContent"></div>

    </div>  
  </el-dialog>
</template>

<script>
export default {
  name: 'noticeDetail',

  computed: {
    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'noticeDetail' || this.$store.state.NOW_OPEN_SEC_DIALOG == 'noticeDetail') {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'noticeDataDetail' ],

  data: function () {
    return {
      detailHeight: document.body.clientHeight - 140,
      detailContent: '', // 文章内容
    }
  },

  mounted: function () {
    this.detailContent = this.$PUBILC.html_decode(this.noticeDataDetail.content);
    this.getNewMessage();
  },

  methods: {

    // 获取新消息通知
    getNewMessage: function () {
      let url = this.$INTERFACE.NEW_MESSAGE_PROMPT;
      this.$NORMAL_POST(url).then(this.getNewMessagePromise);
    },

    // 获取新消息通知  请求后的处理函数
    getNewMessagePromise: function (res) {
      let obj = {};
      for (let i in res.data) {
        if (obj[res.data[i].id] == undefined) {
          obj[res.data[i].type] = [];
        }
        obj[res.data[i].type].push(res.data[i]);
      }
      this.$store.commit('changeNormalValue', { name: 'NEW_MESSAGE', value: obj });
    },

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    }
  },
}
</script>

<style lang="scss" scoped>
.detail-area {
  border-top: solid 1px #e9e9e9;
  font-size: 16px;
  padding: 10px;
}

.detail-title {
  text-align: center;
  color: #333333;
}

.keyword {
  float: left;
  margin-left: 20px;
}

.detail-message {
  text-align: right;
  padding-right: 20px;
}

.detail-content {
  width: 98%;
  height: calc(100% - 90px);
  background: white;
  margin: 15px auto;
  background: white;
  border: solid 1px #f0f0f0;
  box-shadow: 0 0 1px #c2c2c2;
  padding: 10px;
}

.code {
  padding-left: 15px;
}

</style>