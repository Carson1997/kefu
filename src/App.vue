<template>
  <div id="app" class="app">
    <router-view class="app-content">

    </router-view>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, .app, .app-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script>
export default {

  mounted: function () {
    this.checkLogin();
  },

  methods: {

    // 检查是否已经登录
    checkLogin: function () {
      let cookie = this.$JS_COOKIE.get('bhds_token'); // cookie
      if (cookie == '') { // 没有cookie, 直接跳登录
        this.$router.replace('/login');
      } else {
        try {
          console.log(sessionStorage.username);
          JSON.parse(sessionStorage.username); // 用户姓名
          JSON.parse(sessionStorage.authority); // 左边权限
          JSON.parse(sessionStorage.grouping); // 群组
          JSON.parse(sessionStorage.shop_id); // 项目id
          JSON.parse(sessionStorage.status); // 权限
          this.$PUBILC.changeSessionVuex(this);
          this.$router.replace('/');
        } catch (error) {
          this.relogin();
        }
      }
    },

    // 发送免登录请求
    relogin: function () {
      this.$NORMAL_POST(this.$INTERFACE.RELOGIN, {}).then(this.reloginPromise);
    },

    // 发送免登录请求  请求后的处理函数
    reloginPromise: function (res) {
      this.$PUBILC.loginSuccessSetCookie(this, res);
      this.$PUBILC.changeSessionVuex(this);
      this.$router.replace('/');
    }
  }
}
</script>

<style lang="scss">
.el-dialog__body {
  padding: 0 !important;
  padding-top: 5px !important;
}

.el-dialog__title {
  color: #333333 !important;
}

.clear {
  clear: both;
}

.el-tabs__header {
  margin: 0 !important;
}
</style>