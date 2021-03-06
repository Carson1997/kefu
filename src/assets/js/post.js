/**
 * 封装axois的文件
 */

import Axios from 'axios'; // 引入axios库
import Qs from 'qs'; // 引入qs库

const resErrorMes = '请求成功, 后台返回错误码, 请联系技术部!'; // status返回1时的默认提示
const reqErrorMes = '请求发生错误, 网络好像开小差了!'; // 请求错误时的默认提示
var VUE;

var Request = {

  /**
   * 普通的请求
   * requestUrl: 请求的api地址
   * requestData: 请求传输的数据
   * yearnValue: 渴望处理的值
   */
  normalPost: function (requestUrl, requestData = {}, yearnValue = 0, needToRes = []) {
    VUE = this;
    requestData = addToken(requestData);
    return new Promise(function (resolve, reject) {
      Axios({
        method: 'POST',
        url: requestUrl,
        data: Qs.stringify(requestData)
      }).then(function (res) {
        if (res.data.status == yearnValue) {
          res.data['needToRes'] = {};
          for (let i in needToRes) {
            res.data['needToRes'][needToRes[i]] = requestData[needToRes[i]];
          }
          resolve(res.data);
        }
        filterRes(res.data);
      }).catch(function (error) {
        let str = '请联系技术部，接口发生错误: ' + error;
        alert(str);
        console.log(url)
      });
    })
    
  },

  /**
   * 上传文件的请求
   * requestUrl：上传文件的地址
   * requestData: 上传的数据
   */
  filePost: function (requestUrl, requestData, index) {
    let _this = this;
    let formData = new FormData(); 
    for (let i in requestData) {
      formData.append(i, requestData[i]);
    }
    return new Promise((resolve, reject) => {
      Axios({
        url: requestUrl,
        method: 'post',
        data: formData,
        timeout: 300000,
      }).then(function (res) {
        _this.$store.commit('changeUploadProgressBar', index);
        resolve(res);
      }).catch(function (error) {
        reject(error);
      })
    })
  }

}

export default Request;

// 请求前添加token
function addToken (data) {
  let token = VUE.$JS_COOKIE.get('bhds_token');
  if (token != undefined) {
    data['token'] = token;
  }
  return data;
}

// 请求后对code值进行筛选
function filterRes (data) {
  if (data.status == '1') { // 发送错误
    if (data.info != '') { // 提示信息
      VUE.$alert(data.info, { onfirmButtonText: '确定' });
    } else {
      VUE.$alert(resErrorMes, { onfirmButtonText: '确定' });
    }
  } else if (data.status == '2') { // 发生跳转
    if (data.url == 'index.html') {
      VUE.$router.replace('/');
    } else if (data.url == 'login.html') {
      VUE.$router.replace('/login');
    }
  }
}

// 发送错误
function sendError () {
  
}