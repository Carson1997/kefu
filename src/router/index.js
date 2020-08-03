import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue' // 主页
import Login from '../views/Login.vue' // 登录
import DataStatistics from '../views/dataStatistics.vue' // 数据统计
import ProductInquiry from '../views/productInquiry.vue' // 产品查询
import PostBar from '../views/postBar.vue' // 贴吧
import Examination from '../views/examination.vue' // 教学模块
import Train from '../views/train.vue' // 学习模块
import Notice from '../views/notice.vue' // 知识库
import Setting from '../views/setting.vue' // 设置


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/dataStatistics',
        component: DataStatistics,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/productInquiry',
        component: ProductInquiry,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/postBar',
        component: PostBar,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/examination',
        component: Examination,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/train',
        component: Train,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/notice',
        component: Notice,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/setting',
        component: Setting,
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
