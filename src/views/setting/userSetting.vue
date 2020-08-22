<template>
  <div id="userSetting">

    <!-- 控制区域 -->
    <div class="control-area">
      <el-button type="primary" size="small" @click="newUser">创建用户</el-button>

      <el-button type="success" size="small" @click="batchNewUserLis">批量创建用户</el-button>
      <input type="file" ref="fileUpload" class="none" @change="uploadChange">
      <el-input class="search-input" v-model="searchInput" placeholder="输入项目名称搜索项目" clearable suffix-icon="el-icon-search"></el-input>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableDataShow" border style="width: 100%; margin-top: 20px" :height="tableHeight">
      <el-table-column prop="username" label="账号" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" align="center"></el-table-column>
      <el-table-column  label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 0 ? '临时客服' : scope.row.status == 1 ? '普通客服' : '主管' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="changeUser(scope.row)">修改用户信息</el-button>
          <el-button v-bind:type="scope.row.prison == 1 ? 'danger' : 'primary'" size="mini" @click="frozenUser(scope.row)">{{ scope.row.prison == 1 ? '冻结' : '解冻' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建用户弹框 -->
    <newUserDialog :isBatch="isBatch" :batchData="batchData" :userData="userData" @update="getTableData" v-if="newUserDialog"></newUserDialog>
  </div>
</template>

<script>
import XLSX, { read } from "xlsx";
import jschardet from "jschardet";
import papaparse from "papaparse";
import newUserDialog from '../../components/setting/newUserDialog';
export default {
  name: 'userSetting',

  components: { newUserDialog },

  data: function () {
    return {
      newUserDialog: false, // 创建用户对话框是否显示
      searchInput: '', // 搜索输入的内容
      tableHeight: 0, // 表格高度
      setTableHeightFunc: '', // 设置表格高度的方法
      tableData: [], // 表格数据
      userData: {}, // 用户信息数据
      isBatch: false, // 是否批量上传数据
      batchData: [], // 批量上传数据
    }
  },

  computed: {
    tableDataShow: function () {
      let searchInput = this.searchInput;
      if (this.searchInput == '') {
        return this.tableData;
      } else {
        let arr = this.tableData.filter(item => {
          return (item.name.indexOf(searchInput) > -1 ||
          item.username.indexOf(searchInput) > -1 || 
          item.phone.indexOf(searchInput) > -1);
        })
        return arr;
      }
    }
  },

  mounted: function () {
    this.getTableData();
  },

  methods: {

    // 创建用户
    newUser: function () {
      this.batchData = [];
      this.isBatch = false;
      this.newUserDialog = true;
      this.$store.commit('changeNowDialog', 'newUser');
    },

    // 获取表格数据
    getTableData: function () {
      this.newUserDialog = false;
      this.userData = {};
      this.$NORMAL_POST(this.$INTERFACE.ALL_USER).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求后的处理函数
    getTableDataPromise: function (res) {
      this.tableData = res.data;
      this.setTableHeightFunc = this.$PUBILC.setTableHeight('userSetting', this);
      this.setTableHeightFunc();
      this.$PUBILC.tableHeightListener(this.setTableHeightFunc);
    },

    // 冻结解冻用户
    frozenUser: function (data) {
      let send = { user_id: data.id };
      send['prison'] = data.prison == 1 ? 0 : 1;
      this.$NORMAL_POST(this.$INTERFACE.FROZEN_USER, send).then(this.frozenUserPromise);
    },

    // 冻结解冻用户  请求后的处理函数
    frozenUserPromise: function (res) {
      this.$message({ type: 'success', message: '操作成功' });
      this.getTableData();
    },

    // 修改用户
    changeUser: function (data) {
      this.userData = data;
      this.newUserDialog = true;
      this.$store.commit('changeNowDialog', 'newUser');
    },

    // 批量上传按钮监听
    batchNewUserLis: function () {
      this.$refs.fileUpload.click();
    },

    // 上传文件发生变化
    uploadChange: function (event) {
      let _this = this;
      let file = event.target.files[0];
      let fileReader = new FileReader();
      let fileType = file.name.split(".").reverse()[0];
      fileReader.onload = function (event) {
        let data = event.target.result;
        if (fileType == 'csv') { // 解析csv文件
          _this.readCsvCon(file, data);
        } else { // 解析excel文件
          _this.readExcel(data);
        }
      }
      if (fileType == 'csv') { // 读取文件
        fileReader.readAsDataURL(file);
      } else { // excel文件
        fileReader.readAsBinaryString(file);
      }
    },

    // 解析csv文件控制器
    readCsvCon: function (file, data) {
      data = this.checkEncoding(data);
      this.readCsv(file, data);
    },

    // 读取csv文件
    readCsv: function (file, encoding) {
      let _this = this;
      papaparse.parse(file, { encoding: encoding, complete: function (results) {
        results = results.data;
        _this.arrToJson(results);
      }})
    },

    // 将数据转换为json
    arrToJson: function (arr) {
      let first = arr.splice(0, 1)[0];
      let data = [];
      for (let i in arr) {
        if (arr[i].length == first.length) {
          let obj = {};
          for (let j in first) {
            obj[first[j]] = arr[i][j];
          }
          data.push(obj);
        }
      }
      this.batchData = data;
      this.isBatch = true;
      this.newUserDialog = true;
      this.$store.commit('changeNowDialog', 'newUser');
    },

    // csv检查编码
    checkEncoding: function (base64Str) {
      var str = atob(base64Str.split(";base64,")[1]);//这种方式得到的是一种二进制串
      var encoding = jschardet.detect(str);//要用二进制格式
      encoding = encoding.encoding;
      if(encoding == "windows-1252") { //有时会识别错误（如UTF8的中文二字）
        encoding = "ANSI";
      }
      return encoding;
    },

    // 解析excel文件
    readExcel: function (data) {
      let excelData = XLSX.read(data, { type: 'binary' }); // 读取完成的数据
      const sheet2JSONOpts = { defval: '' };
      let excelJson = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]], sheet2JSONOpts);
      this.isBatch = true;
      this.batchData = excelJson;
      this.newUserDialog = true;
      this.$store.commit('changeNowDialog', 'newUser');
    },

  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: block;
  width: 400px;
  margin-top: 20px;
}

.none {
  display: none;
}
</style>