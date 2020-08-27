import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    PAGE_TITLE: 'Miniice·客服支撑系统', // 网页标题
    USER_NAME: '', // 用户名
    USER_STATUS: '', // 用户默认权限
    USER_ID: '', // 用户id
    USER_GROUPING: '', // 用户群组
    USER_AUTHORITY: '', // 用户权限
    USER_SHOP_ID: '', // 用户的店铺
    PROMPT: '', // 用户是否已经查看过重要通知
    PAGE_LEFT_NAV: { // 页面左侧导航
      '/dataStatistics': { index: '1', name: '数据统计', icon: 'icon-icon-test', url: '/dataStatistics' },
      '/productInquiry': { index: '2', name: '产品查询', icon: 'icon-chanpin', url: '/productInquiry' },
      '/postBar': { index: '3', name: '知识反馈', icon: 'icon-Fillx', url: '/postBar' },
      '/examination':{ index: '4', name: '教学模块', icon: 'icon-jiaoxuejiaoyu', url: '/examination' },
      '/train':{ index: '5', name: '学习模块', icon: 'icon-xuexi', url: '/train' },
      '/notice':{ index: '6', name: '知识库', icon: 'icon-zhishiku', url: '/notice' },
      '/setting':{ index: '7', name: '设置', icon: 'icon-shezhi', url: '/setting' },
    },
    ALL_OPEN_PAGE: {}, // 所有打开的页面
    NOW_OPEN_PAGE: '', // 当前打开页面
    NOW_OPEN_DIALOG: '', // 目前打开的对话框
    NOW_OPEN_SEC_DIALOG: '', // 目前打开的二级对话框
    UOLOAD_PROGRESS: [], // 当前上传的进度
    SHOW_UPLOAD_PROGRESS: false, // 是否显示上传框
    EDIT_CONTENT: '', // 输入框的内容
    NOW_DATASTATISTICS_ROUTE: '', // 数据统计当前打开的子路由
    NOW_EXAMINATION: '', // 教学模块当前打开的子路由
  },

  mutations: {

    // 修改所有的基础值
    changeNormalValue: function (state, value) {
      state[value.name] = value.value;
    },

    // 修改当前显示的对话框
    changeNowDialog: function (state, value) {
      state.NOW_OPEN_DIALOG = value;
    },

    // 修改当前显示二级的对话框
    changeNowSecDialog: function (state, value) {
      state.NOW_OPEN_SEC_DIALOG = value;
    },

    // 修改当前上传进度条
    changeUploadProgress: function (state, value) {
      state.UOLOAD_PROGRESS.push(value);
    },

    // 修改当前上传进度条的进度
    changeUploadProgressBar: function (state, value) {
      let arr = state.UOLOAD_PROGRESS;
      arr[value]['index'] += 1;
      state.UOLOAD_PROGRESS = arr.slice(0);
    },

    // 修改当前上传进度条的提示
    changeUploadProgressMessage: function (state, value) {
      let arr = state.UOLOAD_PROGRESS;
      arr[value.index]['message'] = value.message;
      arr[value.index]['status'] = value.status;
      arr[value.index]['show'] = value.show;
      state.UOLOAD_PROGRESS = arr.slice(0);
    },

    // 修改是否显示上传框
    changeShowUploadProgress: function (state, value) {
      state.SHOW_UPLOAD_PROGRESS = value;
    },

    // 退出登录清除所有内容
    clearAll: function (state) {
      state.PAGE_TITLE = 'Miniice·客服支撑系统'; // 网页标题
      state.USER_NAME = ''; // 用户名
      state.USER_STATUS = ''; // 用户默认权限
      state.USER_ID = ''; // 用户id
      state.USER_GROUPING = ''; // 用户群组
      state.USER_AUTHORITY = ''; // 用户权限
      state.USER_SHOP_ID = ''; // 用户的店铺
      state.PAGE_LEFT_NAV = { // 页面左侧导航
        '/dataStatistics': { index: '1', name: '数据统计', icon: 'icon-icon-test', url: '/dataStatistics' },
        '/productInquiry': { index: '2', name: '产品查询', icon: 'icon-chanpin', url: '/productInquiry' },
        '/postBar': { index: '3', name: '知识反馈', icon: 'icon-Fillx', url: '/postBar' },
        '/examination':{ index: '4', name: '教学模块', icon: 'icon-jiaoxuejiaoyu', url: '/examination' },
        '/train':{ index: '5', name: '学习模块', icon: 'icon-xuexi', url: '/train' },
        '/notice':{ index: '6', name: '知识库', icon: 'icon-zhishiku', url: '/notice' },
        '/setting':{ index: '7', name: '设置', icon: 'icon-shezhi', url: '/setting' },
      };
      state.ALL_OPEN_PAGE = {}; // 所有打开的页面
      state.NOW_OPEN_PAGE = ''; // 当前打开页面
      state.NOW_OPEN_DIALOG = ''; // 目前打开的对话框
      state.NOW_OPEN_SEC_DIALOG = ''; // 目前打开的二级对话框
      state.UOLOAD_PROGRESS = []; // 当前上传的进度
      state.SHOW_UPLOAD_PROGRESS = false; // 是否显示上传框
      state.EDIT_CONTENT = ''; // 输入框的内容
    }

  },

  actions: {
  },

  modules: {
  }
  
})
