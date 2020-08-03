import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    PAGE_TITLE: 'Miniice·客服支撑系统', // 网页标题
    USER_NAME: '邹家亮', // 用户姓名
    PAGE_LEFT_NAV: { // 页面左侧导航
      '/dataStatistics': { index: 1, name: '数据统计', icon: 'icon-icon-test', url: '/dataStatistics' },
      '/productInquiry': { index: 2, name: '产品查询', icon: 'icon-chanpin', url: '/productInquiry' },
      '/postBar': { index: 3, name: '贴吧', icon: 'icon-Fillx', url: '/postBar' },
      '/examination':{ index: 4, name: '教学模块(仅老师可见)', icon: 'icon-jiaoxuejiaoyu', url: '/examination' },
      '/train':{ index: 5, name: '学习模块(仅学生可见)', icon: 'icon-xuexi', url: '/train' },
      '/notice':{ index: 6, name: '知识库', icon: 'icon-zhishiku', url: '/notice' },
      '/setting':{ index: 7, name: '设置(仅管理员可见)', icon: 'icon-shezhi', url: '/setting' },
    },
    ALL_OPEN_PAGE: {}, // 所有打开的页面
    NOW_OPEN_PAGE: '', // 当前打开页面
  },

  mutations: {
    // 修改所有打开的页面
    changeNormalValue: function (state, value) {
      state[value.name] = value.value;
    },
  },

  actions: {
  },

  modules: {
  }
  
})
