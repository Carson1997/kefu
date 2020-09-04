<!-- 新消息详细对话框 -->
<template>
  <el-dialog title="新的消息" :visible="dialogVisible" top="5vh" width="50%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="show-area">
      <el-tabs v-model="activeName">
        <el-tab-pane label="知识库" name="6"></el-tab-pane>
      </el-tabs>
      <div class="content" :style="{ 'height': contentArea + 'px' }">
        <div class="each-content" v-for="(item, index) in messageData[activeName]" :key="index">
          <div class="name">{{ item.name }}</div>
          <el-button type="primary" plain size="mini" class="value" @click="seeDetail(item)">查看详细</el-button>
        </div>
      </div>
      <noticeDetail @close="closeNoticeDetail" v-if="noticeDataShow" :noticeDataDetail="noticeDataDetail"></noticeDetail>
    </div>
  </el-dialog>
</template>

<script>
import noticeDetail from '../../components/fileDetail/noticeDetail';
export default {
  name: 'newMessageDetails',

  components: { noticeDetail },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newMessageDetails') {
        return true;
      } else {
        return false;
      }
    },

    messageData: function () { // 显示的数据
      return this.$store.state.NEW_MESSAGE;
    }
  },

  data: function () {
    return {
      activeName: '6', // 目前打开的选项框
      contentArea: document.body.clientHeight - 350, // 对话框高度
      noticeDataDetail: {}, // 知识库的详细
      noticeDataShow: false, // 是否显示对话框知识库
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 查看详细内容
    seeDetail: function (data) {
      let url;
      let send = { fid: data.fid };
      if (this.activeName == '6') { // 知识库
        url = this.$INTERFACE.CATEGORY_DETAIL;
      }
      this.$NORMAL_POST(url, send).then(this.seeDetailPromise);
    },

    // 查看详细内容  请求后的处理函数
    seeDetailPromise: function (res) {
      this.noticeDataShow = true;
      this.$store.commit('changeNowSecDialog', 'noticeDetail');
      res.data.showId = this.completeId(res.data.id);
      this.noticeDataDetail = res.data;
    },

    // 关闭知识库详细对话框
    closeNoticeDetail: function () {
      this.noticeDataShow = false;
      this.$store.commit('changeNowSecDialog', '');
    },

    // 补全id
    completeId: function (id) {
      let showId = '';
      if (id.length < 5) {
        for (let i = 0; i < 5 - id.length; i++) {
          showId = showId + '0';
        }
        showId = showId + id;
      }
      return showId;
    },
  }

}
</script>

<style lang="scss" scoped>
.show-area {
  padding: 5px;
  padding-left: 20px;
  border-top: solid 1px #f0f0f0;
}

.content {
  margin-top: 10px;
  width: calc(100% - 10px);
  border: solid 1px #f1f1f1;
  overflow: auto;
}

.each-content {
  padding: 20px;
  border-bottom: solid 1px #f1f1f1;
}

.name {
  width: calc(100% - 100px);
  float: left;
  font-size: 15px;
  letter-spacing: .3px;
}

.value {
  margin-left: 20px;
}
</style>