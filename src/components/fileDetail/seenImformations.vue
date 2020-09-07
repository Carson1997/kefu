<!-- 查看了重要通知的成员 -->
<template>
  <el-dialog title="已阅成员" :visible="dialogVisible" width="50%" top="10vh" :before-close="handleClose" :close-on-click-modal="false">
    <div class="padding">
      <el-table :data="tableData" border style="width: 98%; margin: 10px auto" height="500">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="date" label="查看时间" align="center"></el-table-column>
      </el-table>
    </div>
    
  </el-dialog>
</template>

<script>
export default {
  name: 'seenImformations',

  props: [ 'tableData' ],

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'seenImformations') {
        return true;
      } else {
        return false;
      }
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
.padding {
  padding-bottom: 5px;
}
</style>