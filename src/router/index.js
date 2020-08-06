import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue' // 主页
import Login from '../views/Login.vue' // 登录
import DataStatistics from '../views/dataStatistics/dataStatistics.vue' // 数据统计
import ProductInquiry from '../views/productInquiry/productInquiry.vue' // 产品查询
import PostBar from '../views/postBar/postBar.vue' // 贴吧
import Examination from '../views/examination/examination.vue' // 教学模块
import Train from '../views/train/train.vue' // 学习模块
import Notice from '../views/notice/notice.vue' // 知识库
import Setting from '../views/setting/setting.vue' // 设置

import GroupSetting from '../views/setting/groupSetting.vue' // 群组设置
import NoticeSetting from '../views/setting/noticeSetting.vue' // 公告设置
import ProductSetting from '../views/setting/productSetting.vue' // 产品分类
import ProjectSetting from '../views/setting/projectSetting.vue' // 项目设置
import UserSetting from '../views/setting/userSetting.vue' // 用户设置

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
        },
        children: [
          {
            path: 'groupSetting',
            name: 'groupSetting',
            component: GroupSetting
          },
          {
            path: 'noticeSetting',
            name: 'noticeSetting',
            component: NoticeSetting
          },
          {
            path: 'productSetting',
            name: 'productSetting',
            component: ProductSetting
          },
          {
            path: 'projectSetting',
            name: 'projectSetting',
            component: ProjectSetting
          },
          {
            path: 'userSetting',
            name: 'userSetting',
            component: UserSetting
          },
        ]
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
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// 重复进入router
const originalPush = VueRouter.prototype.replace 
VueRouter.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
