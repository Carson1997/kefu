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
  NEW_CATEGORY: REQUEST_URL + '/Content/category_add_update', // 添加知识库分类
  DELETE_CATEGORY: REQUEST_URL + '/Content/category_del', // 删除知识库分类


  // ******************* 设置模块的接口 *****************************************


}

export default Interface;