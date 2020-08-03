/**
 * 封装axois的文件
 */

import Axios from 'axios'; // 引入axios库
import Qs from 'Qs'; // 引入qs库

var Request = {

  /**
   * 普通的请求
   * requestUrl: 请求的api地址
   * requestData: 请求传输的数据
   */
  post: function (requestUrl, requestData) {
    return Axios({
      method: 'POST',
      url: requestUrl,
      data: Qs.stringify(requestData)
    })
  }
}

export default Request;
