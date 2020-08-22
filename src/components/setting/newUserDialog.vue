<template>
  <el-dialog title="创建用户" :visible="dialogVisible" width="30%" append-to-body :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="content">
      <el-input v-if="isBatch != true" class="each-input" placeholder="请输入账号" v-model="username">
        <template slot="prepend">账号: </template>
      </el-input>
      <el-input v-if="isBatch != true" class="each-input" show-password placeholder="请输入密码" v-model="password">
        <template slot="prepend">密码: </template>
      </el-input>
      <el-input v-if="isBatch != true" class="each-input" placeholder="请输入姓名" v-model="name">
        <template slot="prepend">姓名: </template>
      </el-input>
      <el-input class="each-input" v-if="isBatch != true" placeholder="请输入手机" v-model="phone">
        <template slot="prepend">手机: </template>
      </el-input>

      <div class="each-input" v-if="projectId == undefined">
        <span class="name">群组: </span>
        <el-select class="value" v-model="groupValue" placeholder="请选择群组" multiple collapse-tags>
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>

      <div class="each-input" v-if="projectId == undefined">
        <span class="name">用户角色: </span>
        <el-select @change="statusLis" class="value" v-model="statusValue" placeholder="请选择用户角色">
          <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>

      <div class="each-input" v-if="projectId == undefined">
        <span class="name">模块权限: </span>
        <el-select class="value" v-model="authValue" placeholder="请选择模块权限" multiple collapse-tags>
          <el-option v-for="item in authOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disable"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>

      <el-button class="add-button" type="primary" size="small" @click="addUser">添加用户</el-button>
    </div>
  </el-dialog>
</template>

<script>
const Crypto = require("crypto"); // 加密模块
export default {
  name: 'newUser',

  props: [ 'projectId', 'userData', 'isBatch', 'batchData' ],

  computed: {

    dialogVisible: function () { // 控制框的显示
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'newUser' || this.$store.state.NOW_OPEN_DIALOG == 'newUser') {
        return true;
      } else {
        return false;
      }
    }

  },

  data: function () {
    return {
      username: '', // 账号
      password: '', // 密码
      name: '', // 姓名
      phone: '', // 手机
      groupValue: '', // 用户所属群组
      groupOptions: [], // 用户所属群组的选项
      authValue: '', // 用户的模块权限
      authOptions: [], // 用户的模块权限的选项
      statusValue: '', // 角色值
      statusOptions: [], // 角色选项
    }
  },

  mounted: function () {
    this.initDialog();
  },

  methods: {

    // 初始化对话框
    initDialog: function () {
      this.getGroup();
      this.getAuth();
      this.getStatus();
    },

    // 将用户数据转换
    transformUserData: function () {
      if (Object.keys(this.userData).length != 0) {
        this.username = this.userData.username;
        this.name = this.userData.name;
        this.phone = this.userData.phone;
        this.groupValue = this.userData.grouping.split(',');
        this.statusValue = this.userData.status;
        this.statusLis();
        this.authValue = this.userData.authority.split(',');
      }
    },

    // 获取分组
    getGroup: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_GROUP).then(this.getGroupPromise);
    },

    // 获取分组  请求后的处理函数
    getGroupPromise: function (res) {
      this.groupOptions = res.data;
    },

    // 获取权限
    getAuth: function () {
      let send = { 'shop_id': this.projectId };
      this.$NORMAL_POST(this.$INTERFACE.ALL_MODULE_AUTH, send).then(this.getAuthPromise);
    },

    // 获取权限  请求后的处理函数
    getAuthPromise: function (res) {
      this.authOptions = res.data;
      this.transformUserData();
    },

    // 获取角色
    getStatus: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_ROLE).then(this.getStatusPromise);
    },

    // 获取角色  请求后的处理函数
    getStatusPromise: function (res) {
      this.statusOptions = res.data;
    },

    // 角色发生变化
    statusLis: function () {
      for (let i in this.authOptions) {
        if (this.authOptions[i]['type'] == 0) {
          this.authOptions[i]['disable'] = false;
        }else if ((this.authOptions[i]['type'] == 1) && (this.statusValue == 0 || this.statusValue == 1)) {
          this.authOptions[i]['disable'] = false;
        }else if ((this.authOptions[i]['type'] == 2) && this.statusValue == 2) {
          this.authOptions[i]['disable'] = false;
        } else {
          this.authOptions[i]['disable'] = true;
        }
      }
      this.authValue = '';
    },

    // 关闭对话框
    handleClose: function () {
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'newUser') {
        this.$store.commit('changeNowSecDialog', '');
      } else if (this.$store.state.NOW_OPEN_DIALOG == 'newUser') {
        this.$store.commit('changeNowDialog', '');
      }
      this.$emit('update');
    },

    // 添加用户
    addUser: function () {
      let send = {};
      let legitimacy = this.checkLegitimacy();
      let sha = Crypto.createHash("sha1");
      if (legitimacy == true) {
        let password = JSON.parse(JSON.stringify(this.password));
        if (this.isBatch != true) {
          send['username'] = this.username;
          send['password'] = sha.update(password).digest("hex");;
          send['name'] = this.name;
          send['phone'] = this.phone;
        }
        if (this.projectId == undefined) {
          send['grouping'] = this.groupValue.join(',');
          send['status'] = this.statusValue;
          send['authority'] = this.authValue.join(',');
        } else {
          send['shop_id'] = this.projectId;
          send['status'] = 3;
        }
        if (this.userData != undefined && Object.keys(this.userData).length > 0) {
          send['user_id'] = this.userData['id']
        }
        let url = this.$INTERFACE.NEW_USER;
        if (this.isBatch == true) {
          url = this.$INTERFACE.BATCH_USER_UPLOAD;
          send['data'] = JSON.stringify(this.batchData);
        }
        this.$NORMAL_POST(url, send).then(this.addUserPromise);
      }
    },

    // 检查输入的合法性
    checkLegitimacy: function () {
      if (this.isBatch != true) {
        if (this.username == '') {
          this.alert('请输入用户名!');
          return false;
        }
        if (this.password == '') {
          this.alert('请输入密码!');
          return false;
        }
        if (this.name == '') {
          this.alert('请输入姓名!');
          return false;
        }
        if (this.phone == '' || this.phone.length != 11) {
          this.alert('请输入正确的手机!');
          return false;
        }
      }
      if (this.projectId == undefined) {
        if (this.groupValue.length == 0) {
          this.alert('请选择用户所属群组!');
          return false;
        }
        if (this.statusValue == '') {
          this.alert('请选择用户角色!');
          return false;
        }
        if (this.authValue.length == 0) {
          this.alert('请选择用户的模块权限!');
          return false;
        }
      }
      return true;
    },

    // 弹出警告框
    alert: function (message) {
      this.$alert(message, '警告', { confirmButtonText: '确定' });
    },

    // 添加用户  请求后的处理函数
    addUserPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.handleClose();
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  border-top: solid 1px #e0e0e0;
  padding-top: 20px;
  padding-bottom: 20px;
}

.content .each-input {
  width: 100%;
  padding: 10px 5%;
}

.content .each-input .name {
  background-color: #F5F7FA;
  color: #909399;
  width: 75px;
  display: block;
  float: left;
  line-height: 38px;
  text-align: center;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  border-right: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.content .each-input .value {
  width: calc(100% - 75px);
  display: block;
  float: left;
}

.add-button {
  margin: 0 auto !important;
  margin-top: 10px !important;
  display: block !important;
}
</style>