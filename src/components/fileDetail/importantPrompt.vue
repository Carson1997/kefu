<!-- 重要提示 -->
<template>
  <el-dialog title="重要提示" :visible="dialogVisible" width="50%" :show-close="false" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="see-area">
      你好, 欢迎进入系统！
    </div>
    <div class="center">
      <el-button type="primary" size="mini" plain @click="confrim">确定</el-button>
      <el-button type="warning" size="mini" plain @click="logout">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'importantPrompt',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'importantPrompt') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {},

    // 确定
    confrim: function () {
      let url = this.$INTERFACE.IMPORTANT_RULES;
      let send = { prompt: 1 };
      this.$NORMAL_POST(url, send).then(this.confrimPromise);
    },

    // 确定  请求后的处理函数
    confrimPromise: function () {
      sessionStorage.prompt = JSON.stringify('1'); // 是否已经查看过重要通知
      this.$store.commit('changeNormalValue', { name: 'PROMPT', value: 1 }); // 是否已经查看过重要通知
      this.$emit('confrim');
    },

    // 取消退出登录
    logout: function () {
      this.$emit('logout');
    },
  }

}
</script>

<style lang="scss" scoped>
.see-area {
  padding: 20px;
  border-top: solid 1px #f3f3f3;
}

.center {
  width: 100%;
  border-top: solid 1px #f3f3f3;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>