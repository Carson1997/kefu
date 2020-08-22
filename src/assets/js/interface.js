/**
 * 封装一个请求对象
 */

import QueryString from "qs";

const BASE_IP = "/TEST_API_SERVER"; // ip地址
const BASE_PROJECT = '/binghuo_information'; // 项目位置
const API_ADDRESS = '/Backstage'; // api地址
const REQUEST_URL = BASE_IP + BASE_PROJECT + API_ADDRESS;

var Interface = {
  // =================== 登录网站的接口 =========================================
  LOGIN_CODE: REQUEST_URL + '/user/code', // 获取登录所需的code
  LOIGIN: REQUEST_URL + '/user/login', // 登录获取TOKEN
  RELOGIN: REQUEST_URL + '/user/login_detection', // 重登录获取TOKEN
  // ******************* 登录网站的接口 *****************************************

  // =================== 设置模块的接口 =========================================
  NEW_PROJECT: REQUEST_URL + '/Shop/shop_add_update', // 新建或者编辑项目
  ALL_PROJECT: REQUEST_URL + '/Shop/shop', // 查询所有项目
  ALL_MODULE_AUTH: REQUEST_URL + '/user/shop', // 查询该项目下的所有模块权限
  ALL_GROUP: REQUEST_URL + '/user/group_list', // 查询所有群组
  NEW_GROUP: REQUEST_URL + '/user/add_group', // 新建或者辑编群组
  DELETE_USER: REQUEST_URL + '/Content/group_del', // 删除群组
  ALL_USER: REQUEST_URL + '/user/index', // 查询所有用户
  NEW_USER: REQUEST_URL + '/user/add_update', // 添加用户
  FROZEN_USER: REQUEST_URL + '/user/del_user/', // 冻结用户
  ALL_ROLE: REQUEST_URL + '/user/group_ing', // 角色
  ALL_CATEGORY: REQUEST_URL + '/Content/category', // 所有知识库分类
  NEW_CATEGORY: REQUEST_URL + '/Content/category_add_update', // 添加知识库文件夹或者文件
  EDIT_CATEGORY_DETAIL: REQUEST_URL + '/Content/content', // 编辑知识库文章
  CATEGORY_DETAIL: REQUEST_URL + '/Content/content_html', // 获取知识库文章的详细
  DELETE_CATEGORY: REQUEST_URL + '/Content/category_del', // 删除知识库分类
  BATCH_USER_UPLOAD: REQUEST_URL + '/user/batch_upload', // 用户批量上传
  // ******************* 设置模块的接口 *****************************************

  // ******************  上传文件的接口 *****************************************
  FILE_TEST: 'http://service.miniice.cn/binghuo_information/index.php/Api/Training/Testing/', // 上传文件前的检测
  FILE_UPLOAD: 'http://service.miniice.cn/binghuo_information/index.php/Api/Training/upload_order_mp4/', // 上传文件接口
  FILE_MERGE: 'http://service.miniice.cn/binghuo_information/index.php/Api/Training/merge/', // 上传文件合并
  // ******************  上传文件的接口 *****************************************

  // ******************  产品查询 *****************************************
  ALL_PRODUCT_CATEGORY: REQUEST_URL + '/Product/Product_cat', // 所有产品分类
  NEW_PRODUCT_CATEGORY: REQUEST_URL+ '/Product/cat_add_update', // 添加产品分类
  DEL_PRODUCT_CATEGORY: REQUEST_URL + '/Product/cat_del', // 删除产品分类
  ALL_PRODUCT_CATEGORY_DETAIL: REQUEST_URL + '/Product/content', // 产品分类详细数据
  ADD_PRODUCT_CATEGORY_DETAIL: REQUEST_URL + '/Product/add_update', // 更新插入产品分类详细数据
  DEL_PRODUCT_CATEGORY_DETAIL: REQUEST_URL + '/product/prd_del', // 删除产品分类详细数据
  // ******************  产品查询 *****************************************


  // ****************** 教学模块 *****************************************
  ALL_SOURCE: REQUEST_URL + '/Training/index', // 所有的素材
  NEW_SOURCE: REQUEST_URL + '/Training/Training_add_update', // 新建素材
  DELETE_SOURCE: REQUEST_URL + '/Training/Training_del ', // 删除素材
  ALL_EXAMS: REQUEST_URL + '/Examination/index', // 所有考试
  NEW_EXAMS: REQUEST_URL + '/Examination/examination_add_update', // 添加考试
  DELETE_EXAM: REQUEST_URL + '/Examination/examination_del', // 删除考试
  EXAM_DETAIL: REQUEST_URL + '/Examination/examinationpapercontent', // 考试的详细内容
  ADD_SUBJECT: REQUEST_URL + '/Examination/content_add_update', // 添加考试试题
  DEL_SUBJECT: REQUEST_URL + '/Examination/del_content', // 删除考试题目
  EXAM_SCORE: REQUEST_URL + '/Examination/Examination_user', // 老师所有查看学生的考试成绩
  EXAM_SCORE_DETAIL: REQUEST_URL + '/Examination/admin_examinationpaperesends', // 查看学生详细考试成绩
  BATCH_ADD_SUBJECT: REQUEST_URL + '/Examination/batch_add', // 批量上传试题
  STUDENT_ALL_EXAMS: REQUEST_URL + '/Examination/Examination_index_trainee', // 学生的的考试
  POST_EXAM: REQUEST_URL + '/Examination/examinationpaperesend', // 提交试卷
  ALL_TRAIN: REQUEST_URL + '/Training/TrainingTopics_index', // 全部培训
  STUDENT_TRAIN: REQUEST_URL+ '/Training/TrainingTopics_index_trainee', // 学生看到的所有培训
  STUDENT_TRAIN_DETAIL: REQUEST_URL + '/Training/select_training_topics', // 学生看到的培训详细
  ADD_TRAIN: REQUEST_URL + '/Training/TrainingTopics_add_update', // 添加培训
  DEL_TRAIN: REQUEST_URL + '/Training/TrainingTopics_del', // 删除培训
  ALL_TRAIN_SCORE: REQUEST_URL + '/Training/examination_user', // 查看学生培训情况
  REEXAM: REQUEST_URL + '/Examination/review', // 安排补考
  ALL_STUDENT_SCORE: REQUEST_URL + '/Examination/user', // 所有学生的考试情况
  STUDENT_SCORE_DETAIL: REQUEST_URL + '/Examination/user_examination', // 所有学生的考试详细情况
  // ****************** 教学模块 *****************************************

  // ****************** bbs *****************************************
  BBS_ALL_CATE: REQUEST_URL + '/Problem/problem_cat/', // bbs类目详细
  NEW_BBS_CATE: REQUEST_URL + '/Problem/problem_cat_add_update/', // 新增bbs类目
  DELETE_BBS_CATE: REQUEST_URL + '/Problem/problem_cat_del/', // 删除bbs类目
  ALL_BBS: REQUEST_URL + '/Problem/index/', // bbs所有帖子
  BBS_CONTENT: REQUEST_URL + '/Problem/problem_content/', // 帖子内容
  new_BBS: REQUEST_URL + '/Problem/send_problem/', // 发帖子
  ALL_TEACHER: REQUEST_URL + '/Problem/send_user/', // 所有的处理人
  ANSWER_BBS: REQUEST_URL + '/Problem/send_problem_peply/', // 回答问题
  // ****************** bbs *****************************************

  // ****************** 表格 *****************************************
  ALL_DATA_LABEL: REQUEST_URL + '/Chitu/data_label', // 全部字段
  ALL_TABLE: REQUEST_URL + '/Chitu/data_label_assembly', // 所有表格列表
  ADD_TABLE: REQUEST_URL + '/Chitu/add_data_label_assembly', // 所有表格列表  添加修改
  DEL_TABLE: REQUEST_URL + '/Chitu/data_label_assembly_del', // 所有表格列表  删除
  UPLOAD_TABLE: REQUEST_URL + '/Chitu/suning_tmall', // 上传表格
  TABLE_DATA: REQUEST_URL + '/Chitu/data_label_customer', // 展示表格详细内容
  TABLE_MERGE_TIME: REQUEST_URL + '/Chitu/binghuo_time', // 表格限制时间
  // ****************** 表格 *****************************************
  
}

export default Interface;
