<!-- 查看重要通知 -->
<template>
  <el-dialog title="重要通知" top="6vh" :visible="dialogVisible" width="50%" :before-close="handleClose">
    <div class="input-area" :style="{ 'max-height': areaHeight + 'px' }">
      <div class="each-information" v-for="(item, index) in informationData" :key="index">
        <h3 class="each-information-title">{{ item.name }}</h3>
        <p v-html="item.content" class="each-information-body"></p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'seeImformation',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'seeImformation') {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'informationData' ],

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 170
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  border-top: solid 1px lightgray;
  padding: 20px;
  padding-top: 10px;
  overflow: auto;
}

.each-information {
  padding: 10px;
  border-bottom: solid 1px lightgray;
}

.each-information-title {
  margin-bottom: 10px;
  color: #333;
}

.each-information-body {
  padding: 5px 10px;
  color: #666;
}

</style>