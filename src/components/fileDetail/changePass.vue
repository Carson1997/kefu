<!-- 修改密码 -->
<template>
  <el-dialog title="修改密码" :visible="dialogVisible" width="30%" :before-close="handleClose">
    <div class="input-area">
      <el-input class="each-input" placeholder="账号" v-model="username" :disabled="true">
        <template slot="prepend">账号</template>
      </el-input>
      <el-input class="each-input" placeholder="密码" v-model="password" show-password>
        <template slot="prepend">密码</template>
      </el-input>
      <el-button size="small" class="center" type="primary" plain @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
const Crypto = require("crypto"); // 加密模块
export default {
  name: 'changePass',

  computed: {
    dialogVisible: function () {
      console.log(this.$store.state.NOW_OPEN_DIALOG)
      if (this.$store.state.NOW_OPEN_DIALOG == 'changePass') {
        return true;
      } else {
        return false;
      }
    },

    username: function () {
      return this.$store.state.USER_NAME;
    }
  },

  data: function () {
    return {
      password: '', // 密码
    }
  },
  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 提交
    submit: function () {
      if (this.password != '') {
        let sha = Crypto.createHash("sha1");
        let password = sha.update(this.password).digest("hex");
        this.$emit('submit', { password: password });
      } else {
        this.$PUBILC.alert(this, '密码不能为空');
        return false;
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  padding: 20px;
  border-top: solid 1px lightgray;
}

.each-input {
  margin-bottom: 20px;
}

.center {
  display: block;
  margin: 0 auto;
}
</style>