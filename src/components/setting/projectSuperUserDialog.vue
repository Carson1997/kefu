<!-- 项目超级管理员设置 -->
<template>
  <el-dialog title="设置项目超级员" :visible="dialogVisible" width="30%" :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="content">
      <el-button class="new-user-button" type="primary" size="mini" @click="newSupperUser">创建项目管理员</el-button>
      <el-table :data="tableData" style="width: 90%; margin: 0 auto; margin-top: 20px" border :height="tableHeight">
      <el-table-column prop="username" label="账号" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button :type="scope.row.prison == '1' ? 'danger' : 'primary'" size="mini" @click="frozenUser(scope.row)">{{ scope.row.prison == '1' ? '冻结' : '解冻' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <newUser v-if="newUser" :projectId="projectId" @update="getSuperUsers"></newUser>
  </el-dialog>
</template>

<script>
import newUser from '../../components/setting/newUserDialog';
export default {
  name: 'projectSuperUserDialog',

  components: { newUser },

  computed: {

    dialogVisible: function () { // 对话框显示控制
      if (this.$store.state.NOW_OPEN_DIALOG == 'projectSuperUserDialog') {
        return true;
      } else {
        return false;
      }
    }

  },

  data: function () {
    return {
      tableData: [], // 表格数据
      tableHeight: '300px', // 表格高度
      newUser: false, // 是否显示对话框
    }
  },

  props:[ 'projectId' ],

  mounted: function () {
    this.getSuperUsers();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$emit('superUserClose');
    },

    // 获取该项目的超级管理员
    getSuperUsers: function () {
      this.newUser = false;
      this.$NORMAL_POST(this.$INTERFACE.ALL_USER, { shop_id: this.projectId }).then(this.getSuperUsersPromise);
    },

    // 获取该项目的超级管理员  请求后的处理函数
    getSuperUsersPromise: function (res) {
      this.tableData = res.data;
    },

    // 创建该项目的超级用户
    newSupperUser: function () {
      this.newUser = true;
      this.$store.commit('changeNowSecDialog', 'newUser');
    },

    // 冻结用户
    frozenUser: function (data) {
      let prison = data.prison == 1 ? 0 : 1;
      let send = { shop_id: this.projectId, user_id: data.id, prison: prison };
      this.$NORMAL_POST(this.$INTERFACE.FROZEN_USER, send).then(this.deleteUserPromise);
    },

    // 冻结用户 请求后的处理函数
    deleteUserPromise: function (res) {
      this.$message({ type: 'success', message: '操作成功' });
      this.getSuperUsers();
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 390px;
  border-top: solid 1px #e0e0e0;
}

.new-user-button {
  margin-top: 15px !important;
  margin-left: 15px !important;
}
</style>