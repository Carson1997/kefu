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
import examManage from '../views/examination/examManage.vue'; // 考试管理
import trainManage from '../views/examination/trainManage.vue'; // 培训管理
import sourceManage from '../views/examination/sourceManage.vue'; // 素材资源管理
import examHistory from '../views/examination/examHistory.vue'; // 历史考试管理
import myExam from '../views/train/myExam.vue'; // 我的考试
import myTrain from '../views/train/myTrain.vue'; // 我的培训
import dataStatisticsTable from '../views/dataStatistics/dataStatisticsTable.vue';
import makeTable from '../views/dataStatistics/makeTable.vue';
import uploadData from '../views/dataStatistics/uploadData.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/dataStatistics',
        name: 'dataStatistics',
        component: DataStatistics,
        meta: {
          keepAlive: true
        },
        children: [
          {
            path: 'dataStatisticsTable',
            name: 'dataStatisticsTable',
            component: dataStatisticsTable,
            meta: {
              keepAlive: true
            },
          },
          {
            path: 'makeTable',
            name: 'makeTable',
            component: makeTable,
            meta: {
              keepAlive: true
            },
          },
          {
            path: 'uploadData',
            name: 'uploadData',
            component: uploadData,
            meta: {
              keepAlive: true
            },
          },
        ]
      },
      {
        path: '/productInquiry',
        name: 'productInquiry',
        component: ProductInquiry,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/postBar',
        name: 'postBar',
        component: PostBar,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/examination',
        name: 'examination',
        component: Examination,
        meta: {
          keepAlive: true
        },
        children: [
          {
            path: 'examManage',
            name: 'examManage',
            component: examManage,
            meta: {
              keepAlive: true
            },
          },
          {
            path: 'trainManage',
            name: 'trainManage',
            component: trainManage,
            meta: {
              keepAlive: true
            },
          },
          {
            path: 'sourceManage',
            name: 'sourceManage',
            component: sourceManage,
            meta: {
              keepAlive: true
            },
          },
          {
            path: 'examHistory',
            name: 'examHistory',
            component: examHistory,
            meta: {
              keepAlive: true
            },
          }
        ]
      },
      {
        path: '/train',
        name: 'train',
        component: Train,
        meta: {
          keepAlive: true
        },
        children: [
          {
            path: 'myExam',
            name: 'myExam',
            component: myExam
          },
          {
            path: 'myTrain',
            name: 'myTrain',
            component: myTrain
          },
        ]
      },
      {
        path: '/notice',
        name: 'notice',
        component: Notice,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/setting',
        component: Setting,
        name: 'setting',
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
