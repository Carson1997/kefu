import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Interface from './assets/js/interface'
import Post from './assets/js/post'
import Pubilc from './assets/js/public'
import JsCookie from 'js-cookie'; // 引入js-cookir库

Vue.use(ElementUI);

Vue.prototype.$INTERFACE = Interface;
Vue.prototype.$NORMAL_POST = Post.normalPost;
Vue.prototype.$FILE_POST = Post.filePost;
Vue.prototype.$PUBILC = Pubilc;
Vue.prototype.$JS_COOKIE = JsCookie;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
