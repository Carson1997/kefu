<!-- 创建数据统计表格  基本信息 -->
<template>
  <el-dialog title="表格基本信息" :visible="dialogVisible" width="40%" :close-on-click-modal="false" :before-close="handleClose">
    <div class="input-area">
      <div class="each-input">
        <span class="name">表格名称: </span>
        <el-input class="value" v-model="tableName" placeholder="请输入内容"></el-input>
      </div>
      <div class="each-input">
        <span class="name">报表说明: </span>
        <el-input class="value" v-model="tableExplain" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" plain size="mini" class="button" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newTableBase',

  computed: {

    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == "newTableBase") {
        return true;
      } else {
        return false;
      }
    }

  },

  data: function () {
    return {
      tableName: '', // 表格名称
      tableExplain: '', // 报表说明
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 提交按钮
    submit: function () {
      if (this.tableName == '') {
        this.$PUBILC.alert(this, '请输入表格名称');
        return false;
      }
      if (this.tableExplain == '') {
        this.$PUBILC.alert(this, '请输入表格说明');
        return false;
      }
      this.$emit('submit', { name: this.tableName, description: this.tableExplain });
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  padding: 20px;
  border-top: solid 1px #e9e9e9;
}

.each-input {
  margin-bottom: 15px;
}

.each-input .name {
  padding-left: 10px;
  padding-bottom: 5px;
  display: block;
}

.button {
  margin: 0 auto;
  display: block;
}
</style>