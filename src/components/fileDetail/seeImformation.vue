<!-- 查看重要通知 -->
<template>
  <el-dialog title="重要通知" top="6vh" :visible="dialogVisible" width="50%" :before-close="handleClose">
    <div class="input-area" :style="{ 'max-height': areaHeight + 'px' }">
      <div class="each-information" v-for="(item, index) in showInformationData" :key="index">
        <h3 class="each-information-title">
          <span>{{ item.name }}</span>
          <el-button type="primary" plain size="mini" class="left" v-if="item.type == 0" @click="confirm(item)">确认查看</el-button>
        </h3>
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
    },
    
    showInformationData: function () { // 展示的信息
      if (this.force != true) {
        let arr = this.informationData.filter(item => {
          return item.type == 0;
        });
        if (arr.length == 0) {
          this.handleClose();
        }
        return arr;
      } else {
        return this.informationData;
      }
    }
  },

  props: [ 'informationData', 'force' ],

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 170
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 确认查看
    confirm: function (data) {
      this.$emit('confirm', data.id);
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

.left {
  margin-left: 20px;
}

</style>