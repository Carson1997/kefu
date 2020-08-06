<template>
  <el-dialog title="创建群组" :visible="dialogVisible" width="30%" :before-close="handleClose"  :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="input-area">
      <el-input class="each-input" placeholder="请输入群组名" v-model="groupName">
        <template slot="prepend">群组名: </template>
      </el-input>
      <el-button type="primary" size="small" class="add-button" @click="addGroup">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'createGroupDialog',

  props: ['groupData'],

  data: function () {
    return {
      groupName: '', // 群组名
      groupId: '', // 群组id
    }
  },

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'createGroupDialog') {
        return true;
      } else {
        return false
      }
    }

  },

  mounted: function () {
    this.initDialog();
  },

  methods: {

    // 初始化弹框数据
    initDialog: function () {
      this.groupName = this.groupData.name;
      this.groupId = this.groupData.id;
    },

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$emit('update');
    },

    // 添加群组
    addGroup: function () {
      let send = { name: this.groupName };
      if (this.groupId != '') {
        send['id'] = this.groupId;
      }
      this.$NORMAL_POST(this.$INTERFACE.NEW_GROUP, send).then(this.addGroupPromise);
    },

    // 添加群组  请求后的处理函数
    addGroupPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.handleClose();
    },
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  height: 150px;
  padding-top: 10px;
  border-top: solid 1px #e0e0e0;
  overflow: auto;
}

.input-area .each-input {
  width: 90%;
  margin: 20px 5%;
}

.add-button {
  display: block !important;
  margin: 10px auto !important;
}
</style>
