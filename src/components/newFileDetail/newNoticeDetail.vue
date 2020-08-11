<template>
  <el-dialog title="编辑知识库详细内容" :visible="dialogVisible" width="50%" top="8vh" :before-close="handleClose">
    <div class="input-area">

    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newNoticeDetail',

  computed: {
    dialogVisible: function () { // 显示框显示控制
      if (this.$store.state.NOW_OPEN_DIALOG == 'newNoticeDetail') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
    },

    
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  height: 650px;
  border-top: solid 1px lightgray;
}
</style>