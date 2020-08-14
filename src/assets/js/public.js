/**
 * 公用的方法
 */

var Pubilc = {

  // 登录成功后记录信息到cookie和session
  loginSuccessSetCookie: function (Vue, res) {
    Vue.$JS_COOKIE.set('bhds_token', res.data.token); // token
    sessionStorage.username = JSON.stringify(res.data.name); // 用户姓名
    sessionStorage.authority = JSON.stringify(res.data.authority); // 左边权限
    sessionStorage.grouping = JSON.stringify(res.data.grouping); // 群组
    sessionStorage.shop_id = JSON.stringify(res.data.shop_id); // 项目id
    sessionStorage.status = JSON.stringify(res.data.status); // 权限
  },

  // 将session上的信息转换到vuex中存储
  changeSessionVuex: function (Vue) {
    Vue.$store.commit('changeNormalValue', { name: 'USER_NAME', value: JSON.parse(sessionStorage.username) }); // 用户名
    Vue.$store.commit('changeNormalValue', { name: 'USER_STATUS', value: JSON.parse(sessionStorage.status) }); // 权限
    Vue.$store.commit('changeNormalValue', { name: 'USER_GROUPING', value: JSON.parse(sessionStorage.grouping) }); // 群组
    Vue.$store.commit('changeNormalValue', { name: 'USER_AUTHORITY', value: JSON.parse(sessionStorage.authority) }); // 左边权限
    Vue.$store.commit('changeNormalValue', { name: 'USER_SHOP_ID', value: JSON.parse(sessionStorage.shop_id) }); // 店铺id
  },

  // 清除vuex中存储session的数据
  clearVuex: function (Vue) {
    Vue.$store.commit('changeNormalValue', { name: 'USER_NAME', value: '' }); // 用户名
    Vue.$store.commit('changeNormalValue', { name: 'USER_STATUS', value: '' }); // 权限
    Vue.$store.commit('changeNormalValue', { name: 'USER_GROUPING', value: '' }); // 群组
    Vue.$store.commit('changeNormalValue', { name: 'USER_AUTHORITY', value: '' }); // 左边权限
    Vue.$store.commit('changeNormalValue', { name: 'USER_SHOP_ID', value: '' }); // 店铺id
  },

  // 清理session
  clearSession: function (Vue) {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("authority");
    sessionStorage.removeItem("grouping");
    sessionStorage.removeItem("shop_id");
    sessionStorage.removeItem("status");
    Vue.$JS_COOKIE.remove('bhds_token', { path: '' });
  },

  // 设置表格高度
  setTableHeight: function (id, component) {
    return function () {
      let height = document.getElementById(id).clientHeight - 155;
      component.tableHeight = height;
    }
  },

  // 为表格添加监听    resize可以添加优化函数
  tableHeightListener: function (resizeFunction) {
    window.addEventListener('resize', function () {
      resizeFunction();
    })
  },

  // 将数组递归成父子级别的形式
  changeArrToHierarchy: function (data) {
    let returnObj = {}
		let parents = data.filter(value => {
			value['label'] = value['name'];
      value['value'] = value['id'];
			return value.fid == 0;
		})
		let children = data.filter(value => {
      value['path'] = '全部文件' + value['path'];
			return value.fid != 0;
		})
		let find = (parents, children) => {
			parents.forEach(parent => {
				children.forEach((current, index) => {
					if (current.fid === parent.id) {
						let temp = JSON.parse(JSON.stringify(children));
						temp.splice(index, 1);
            find([current], temp);
            let attr = current['name'];
            typeof parent.children !== 'undefined' ? '' : parent.children = {};
            parent.children[attr] = current;
					}
				});
			})
		}
    find(parents, children);
    for (let i in parents) {
      returnObj[parents[i]['name']] = parents[i];
    }
		return returnObj;
  },

  // 提示信息
  alert: function (Vue, title) {
    Vue.$alert(title, '提示', {
      confirmButtonText: '确定',
    });
  },

  // html反转义
  html_decode: function (str) { 
    var s = ""; 
    if (str.length == 0) return ""; 
    s = str.replace(/&amp;/g, "&"); 
    s = s.replace(/&lt;/g, "<"); 
    s = s.replace(/&gt;/g, ">"); 
    s = s.replace(/&nbsp;/g, " "); 
    s = s.replace(/&#39;/g, "\'"); 
    s = s.replace(/&quot;/g, "\""); 
    s = s.replace(/<br\/>/g, "\n"); 
    return s; 
  } 

}

export default Pubilc