<!-- 主页文件 -->
<template>
  <div class="index">
    <div class="page-head"> <!-- 头部信息 -->
      <h1 class="page-head-title">{{ pageTitle }}</h1>
      <div class="now-open-page">
        <div v-for="(item, index) in allOpenPage" :key="index" class="each-all-open-page" v-bind:class="{ 'is-now-open-page': nowOpenPage.indexOf(index) > -1 }" @click="switchPage(index, item)">
          <span>{{ item }}</span>
          <span class="iconfont icon-close" @click="closePage($event, index)"></span>
        </div>
      </div>
      <div class="page-head-user-name">
        {{ username }}
        <div class="page-head-user-info">
          <div class="page-head-user-info-hello">你好, {{ username }}</div>
          <div class="each-page-head-function" @click="changepass">修改用户信息</div>
          <div class="each-page-head-function" @click="logout">退出</div>
        </div>
        </div>
    </div>

    <div class="page-left-nav" v-bind:class="{ noShowNav: isShowNav }">
      <div class="each-page-left-nav" v-for="item in leftNav" :key="item.index" @click="switchPage(item.url, item.name)">
        <span class="iconfont" :class="item.icon"></span>
        <span class="each-page-left-nav-name">{{ item.name }}</span>
      </div>
      <div class="page-left-nav-controller" @click="switchNav">
        <span class="iconfont icon-zuo yincang" v-bind:class="{ noShowNavYincang: isShowNav }"></span>
      </div>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="page-right-content" v-bind:class="{ noShowNavRightContent: isShowNav }"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="page-right-content" v-bind:class="{ noShowNavRightContent: isShowNav }"></router-view>

    <!-- 上传的文件 -->
    <uploadProgress class="uploadProgress" :class="{ showUploadProgress: showUploadProgress == true }"></uploadProgress>
    <!-- 修改密码 -->
    <changePass v-if="changePassShow" @submit="changePassHandle"></changePass>
  </div>
</template>

<script>
import '..//assets/css/iconfont.css';
import uploadProgress from '../components/upload/uploadProgress'
import changePass from '../components/fileDetail/changePass';
export default {
  name: 'Index',

  computed: {
    pageTitle: function () { // 网站标题
      return this.$store.state.PAGE_TITLE;
    },

    leftNav: function () { // 左侧导航数据
      let arr = [];
      let auth = JSON.parse(JSON.stringify(this.$store.state.USER_AUTHORITY)).split(',');
      let navs = JSON.parse(JSON.stringify(this.$store.state.PAGE_LEFT_NAV));
      for (let i in navs) {
        if (auth.indexOf(navs[i].index) > -1) {
          arr.push(navs[i]);
        }
      }
      if (this.$store.state.USER_STATUS >= 3) {
        arr.push(navs['/setting']);
      }
      return arr;
    },

    username: function () { // 用户名
      return this.$store.state.USER_NAME;
    },

    allOpenPage: function () { // 所有打开的页面
      return this.$store.state.ALL_OPEN_PAGE;
    },

    nowOpenPage: function () { // 当前打开的页面
      return this.$store.state.NOW_OPEN_PAGE;
    },

    showUploadProgress: function () { // 是否显示对话框
      return this.$store.state.SHOW_UPLOAD_PROGRESS
    }
  },

  components: { uploadProgress, changePass },

  data: function () {
    return {
      isShowNav: false, // 是否显示导航栏
      changePassShow: false, // 是否显示密码框
    }
  },

  methods: {

    // 修改密码
    changepass: function () {
      this.changePassShow = true;
      this.$store.commit('changeNowDialog', 'changePass');
    },

    // 修改密码  处理函数
    changePassHandle: function (data) {
      let url = this.$INTERFACE.CHANGE_PASS;
      this.$NORMAL_POST(url, data).then(this.changePassHandlePromise);
    },

    // 修改密码  请求后的处理函数
    changePassHandlePromise: function (res) {
      this.changePassShow = false;
      this.$store.commit('changeNowDialog', 'changePass', 2);
    },

    // 切换显示导航栏
    switchNav: function () {
      this.isShowNav = !this.isShowNav;
    },

    // 切换模块
    switchPage: function (url, name) {
      this.$route.meta.keepAlive = true;
      if (this.allOpenPage[url] == undefined) { // 当前页面没打开过
        let data = JSON.parse(JSON.stringify(this.allOpenPage));
        data[url] = name;
        this.$store.commit('changeNormalValue', { name: 'ALL_OPEN_PAGE', value: JSON.parse(JSON.stringify(data)) });
      }
      if (url == '/dataStatistics' || url == '/examination') {
        let child = url == '/dataStatistics' ? 'NOW_DATASTATISTICS_ROUTE' : 'NOW_EXAMINATION';
        child = this.$store.state[child];
        if (child != '') {
          url = url + '/' + child;
        }
      }
      this.$store.commit('changeNormalValue', { name: 'NOW_OPEN_PAGE', value: url });
      this.$router.replace(url);
    },

    // 关闭模块
    closePage: function (event, url) {
      let obj = JSON.parse(JSON.stringify(this.allOpenPage));
      delete obj[url];
      this.$store.commit('changeNormalValue', { name: 'ALL_OPEN_PAGE', value: JSON.parse(JSON.stringify(obj)) });
      if (url == '/dataStatistics' || url == '/examination') {
        this.$route.meta.keepAlive = false;
        let child = url == '/dataStatistics' ? 'NOW_DATASTATISTICS_ROUTE' : 'NOW_EXAMINATION';
        this.$store.commit('changeNormalValue', { name: child, value: '' });
        this.$router.replace(url);
      }
      this.$route.meta.keepAlive = false; // 设置页面不缓存
      if (Object.keys(obj).length > 0) {
        let keys = Object.keys(obj);
        this.$store.commit('changeNormalValue', { name: 'NOW_OPEN_PAGE', value: keys[keys.length - 1] });
        if (keys[keys.length - 1] == '/dataStatistics' || keys[keys.length - 1] == '/examination') {
          let child = keys[keys.length - 1] == '/dataStatistics' ? 'NOW_DATASTATISTICS_ROUTE' : 'NOW_EXAMINATION';
          child = this.$store.state[child];
          let url = child == '' ? keys[keys.length - 1] : keys[keys.length - 1] + '/' + child;
          this.$router.replace(url);
        } else {
          this.$router.replace(keys[keys.length - 1]);
        }
      } else {
        this.$router.replace('/');
      }
      event.stopPropagation();
    },

    // 退出登录
    logout: function () {
      this.$PUBILC.clearVuex(this);
      this.$PUBILC.clearSession(this);
      this.$router.replace('/login');
    }
  }
}
</script>

<style lang="scss" scoped>
.page-head {
  width: 100%;
  height: 45px;
  background: #2e74c5;
  position: relative;
}

.page-head-title {
  font-size: 20px;
  line-height: 45px;
  letter-spacing: 1px;
  font-weight: 400;
  color: white;
  padding-left: 15px;
}

.now-open-page {
  position: absolute;
  bottom: 0;
  left: 300px;
}

.each-all-open-page {
  float: left;
  line-height: 30px;
  padding-left: 10px;
  color: #e4e4e4;
  letter-spacing: .3px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 14px;
  letter-spacing: .5px;
}

.each-all-open-page .icon-close {
  margin-right: 8px !important;
  margin-left: 10px;
  visibility: hidden;
}

.is-now-open-page {
  color: #2e74c5 !important;
  background: white;
}

.is-now-open-page .icon-close {
    visibility: visible !important;
}

.page-head-user-name {
  position: absolute;
  color: white;
  right: 30px;
  top: 0;
  line-height: 45px;
  letter-spacing: .3px;
  font-size: 16px;
  padding: 0 20px;
  cursor: pointer;
}

.page-head-user-name:hover {
  box-shadow: 0 0 1px lightgrey;
}

.page-head-user-name:hover .page-head-user-info {
  display: block;
}

.page-head-user-info-hello {
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  border-bottom: solid 0.5px #f0f0f0;
  line-height: 40px;
}

.page-head-user-info {
  position: absolute;
  right: 0px;
  top: 45px;
  width: 140px;
  box-shadow: 0 0 1px black;
  color: #333333;
  padding-top: 1px;
  font-size: 14px;
  display: none;
  background: white;
  z-index: 100;
}

.page-head-user-info-top {
  padding: 10px;
  border-bottom: solid 1px lightgray;
  font-weight: 600;
}

.each-page-head-function {
  padding: 5px;
  text-align: center;
  cursor: pointer;
  border-bottom: solid 0.5px #f0f0f0;
  transition: all .3s;
  line-height: 30px;
}

.each-page-head-function:hover {
  color: white;
  background: #3b7fcc;
}

.page-head-user-info:after {
  top: -7px;
  background: #fff;
}

.page-left-nav {
  width: 250px;
  height: calc(100% - 45px);
  background: #f9f9f7;
  float: left;
  position: relative;
  box-shadow: 0 0 3px lightgray;
  transition: all .5s;
}

.noShowNav {
  margin-left: -250px;
}

.page-left-nav .each-page-left-nav {
  color: #333333;
  font-size: 15px;
  padding: 12px 0;
  cursor: pointer;
  padding-left: 15px;
  background: #f9f9f7;
  position: relative;
  border-bottom: solid .5px #f0f0f0;
  transition: all .3s;
}

.page-left-nav .each-page-left-nav:hover {
  background: white;
  border-bottom: solid 1px #dddddd;
}

.page-left-nav .each-page-left-nav .each-page-left-nav-name {
  letter-spacing: .5px;
}

.page-left-nav .page-left-nav-controller {
  position: absolute;
  width: 30px;
  height: 55px;
  background: #f9f9f7;
  right: -30px;
  top: 40%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 1px 0 1px #e7e7e7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .3s;
}

.page-left-nav .page-left-nav-controller:hover {
  box-shadow: 1px 0 2px #adadad;
  color: black;
}

.page-left-nav .page-left-nav-controller .yincang {
  margin-right: 0px !important;
  font-size: 16px;
  transition: all .3s;
}

.noShowNavYincang {
  transform:rotate(180deg);
}

.page-right-content {
  width: calc(100% - 250px);
  height: calc(100% - 45px);
  float: left;
  transition: all .5s;
}

.noShowNavRightContent {
  width: 100%;
}

.uploadProgress {
  position: absolute;
  width: 550px;
  height: 250px;
  background: white;
  right: 50px;
  bottom: -210px;
  border: solid 1px #ececec;
  box-shadow: 0 0 1px #d3d3d3;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 10000;
  transition: all .5s;
  visibility: hidden;
}

.showUploadProgress {
  bottom: 0px;
  visibility: visible;
}
</style>
