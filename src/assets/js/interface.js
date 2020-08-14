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
}

export default Interface;