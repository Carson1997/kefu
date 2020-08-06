<!-- 登录页面 -->
<template>
  <div class="login" id="login">
    <div class="login-div">
      <img class="web-name-logo" src="../../public/img/miniice-logo.png" alt="">
      <h1 class="web-name-title">客服支撑系统</h1>
      <div class="login-input-div" ref="loginInputDiv">
        <div class="each-input">
          <el-input placeholder="输入账号或手机号" v-model="username">
            <template slot="prepend">账号:</template>
          </el-input>
        </div>
        <div class="each-input">
          <el-input show-password placeholder="请输入密码" v-model="password">
            <template slot="prepend">密码:</template>
          </el-input>
        </div>
        <el-button class="login-button" type="primary" @click="loginLis">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const Crypto = require("crypto"); // 加密模块
import JsCookie from 'js-cookie'; // 引入js-cookir库
export default {
  name: 'Login',

  data: function () {
    return {
      username: '', // 输入的账号
      password: '', // 输入的密码
    }
  },
  
  mounted: function () {
    this.clearLoginData();
    this.enterLis();
  },

  methods: {

    // 清除所有登录信息
    clearLoginData: function () {
      this.$PUBILC.clearVuex(this);
      this.$PUBILC.clearSession(this);
    },

    // enter键监听
    enterLis: function () {
      let _this = this;
      let body = document.getElementById("login");
      body.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          _this.loginLis();
        }
      })
    },

    // 登录按钮监听
    loginLis: function () {
      let legitimacy = this.checkLegitimacy();
      if (legitimacy != false) {
        this.getCode()
      }
    },

    // 判断输入的内容是否合法
    checkLegitimacy: function () {
      if (this.username == '') { // 账号为空
        this.$alert('请输入账号或手机号', { onfirmButtonText: '确定' });
        return false;
      } 
      if (this.password == '') { // 密码为空
        this.$alert('请输入密码', { onfirmButtonText: '确定' });
        return false;
      }
      return true;
    },

    // 请求加密密钥
    getCode: function () {
      this.$NORMAL_POST(this.$INTERFACE.LOGIN_CODE, { username: this.username }).then(this.getCodePromise);
    },

    // 请求加密密钥 请求后的处理函数
    getCodePromise: function (res) {
      let password = JSON.parse(JSON.stringify(this.password));
      let sha = Crypto.createHash("sha1");
      password = sha.update(password).digest("hex");
      password = password + res.data.code;
      sha = Crypto.createHash("sha1");
      password = sha.update(password).digest("hex");
      this.requestLogin(password);
    },

    // 请求登录
    requestLogin: function (password) {
      let data = { username: this.username, password: password };
      this.$NORMAL_POST(this.$INTERFACE.LOIGIN, data, 2).then(this.requestLoginPromise);
    },

    // 请求登录  请求后的处理函数
    requestLoginPromise: function (res) {
      this.$PUBILC.loginSuccessSetCookie(this, res); // 设置cookie信息
      this.$PUBILC.changeSessionVuex(this); // 转换为vuex存储信息
    },

  }
}
</script>

<style lang="scss" scoped>
.login {
  z-index: 1000;
  background: url('../../public/img/login_background.jpg');
  background-size: 100% 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login .login-div {
  width: 500px;
  height: 380px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 1px rgb(233, 233, 233);
}

.login .login-div .web-name-logo {
  width: 120px;
  margin-left: 20px;
  margin-top: 5px;
}

.login .login-div .web-name-title {
  width: 100%;
  text-align: center;
  letter-spacing: .5px;
  color: #2e74c5;
  font-weight: 600;
  margin-top: 5px;
}

.login .login-div .login-input-div {
  width: 100%;
  margin-top: 30px;
  padding: 0 10px;
}

.login .login-div .login-input-div .each-input {
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 40px;
}

.login .login-div .login-input-div .each-input .name {
  width: 100px;
  background: rgb(235, 235, 235);
  display: inline-block;
  text-align: center;
  line-height: 40px;
  color: #3b3b3b;
  border-radius: 5px;
}

.login .login-div .login-input-div .each-input .value {
  width: calc(100% - 100px);
}

.login .login-div .login-button {
  width: 90%;
  margin: 0 auto !important;
  display: block !important;
}


</style>