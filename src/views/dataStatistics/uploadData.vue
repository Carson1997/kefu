<template>
  <div id="uploadData" class="upload-data">
    <div class="control-area"> <!-- 控制区域 -->
      <el-button type="primary" plain size="small" @click="uploadButtonLis">上传文件</el-button>
      <input class="none" type="file" ref="uploadFile" @change="uploadFileChange">
    </div>

    <div class="upload-area" v-if="tableHead.length > 0"> <!-- 控制区域 -->
      <el-select class="dateSelect" v-model="dateType" placeholder="日期类型">
        <el-option v-for="item in dateTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-date-picker class="dateSelect" v-model="date" :type="dateType == 0 ? 'date' : 'month'" format="" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="success" plain size="small" @click="submit">确认上传</el-button>
    </div>

    <el-table :data="tableData" class="table-area" style="width: 100%" border :height="tableHeight"> <!-- 表格区域 -->
      <el-table-column v-for="(item, index) in tableHead" :key="index" :prop="item" :label="item" align="center"></el-table-column>
    </el-table>

  </div>
</template>

<script>
import XLSX, { read } from "xlsx";
import jschardet from "jschardet";
import papaparse from "papaparse";
import moment from 'moment';
export default {
  name: 'uploadData',

  data: function () {
    return {
      tableHead: [], // 表头数据
      tableData: [], // 表格数据
      tableHeight: 0, // 表格高度
      dateType: '', // 选中的日期类型
      dateTypeOptions: [ // 日期类型
        { id: 1, name: '日' },
        { id: 2, name: '月' },
      ],
      allAttr: {}, // 所有的表格属性
      date: '', // 选择的日期
    }
  },

  mounted: function () {
    this.getAttr();
  },

  methods: {

    // 获取所有的表格属性
    getAttr: function () {
      let url = this.$INTERFACE.ALL_DATA_LABEL;
      this.$NORMAL_POST(url).then(this.getAttrPromise);
    },

    // 获取所有的表格属性  请求后的处理函数
    getAttrPromise: function (res) {
      let obj = {};
      for (let i in res.data) {
        obj[res.data[i]['name']] = res.data[i]['associate'];
      }
      this.allAttr = obj;
    },

    // 上传按钮被点击
    uploadButtonLis: function () {
      this.$refs.uploadFile.click();
      this.tableHead = [];
      this.tableData = [];
      this.tableHeight = 0;
      this.$refs.uploadFile.value = '';
    },

    // 上传的文件发生变化
    uploadFileChange: function (event) {
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
      this.tableHead = first;
      this.tableData = data;
      let func = this.$PUBILC.setTableHeight('uploadData', this, 175);
      func();
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
      let head = [];
      let excelData = XLSX.read(data, { type: 'binary' }); // 读取完成的数据
      const sheet2JSONOpts = { defval: '' };
      let excelJson = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]], sheet2JSONOpts);
      for (let i in excelJson[0]) {
        head.push(i);
      }
      this.tableHead = head;
      this.tableData = excelJson;
      let func = this.$PUBILC.setTableHeight('uploadData', this, 175);
      func();
    },

    // 提交数据
    submit: function () {
      if (this.dateType === '') {
        this.$PUBILC.alert(this, '请选择报表的日期类型');
        return false;
      }
      if (this.date === '') {
        this.$PUBILC.alert(this, '请选择报表的日期');
        return false;
      }
      let arr = [];
      for (let i in this.tableData) {
        let obj = {};
        for (let j in this.tableData[i]) {
          obj[this.allAttr[j]] = this.tableData[i][j];
        }
        arr.push(obj);
      }
      let url = this.$INTERFACE.UPLOAD_TABLE;
      let send = { type: this.dateType, data: JSON.stringify(arr), time: this.date + '_' + this.date };
      if (this.dateType == 2) {
        send['time'] = moment(this.date).startOf('month').format("YYYY-MM-DD") + '_' + moment(this.date).endOf('month').format("YYYY-MM-DD");
      }
      this.$NORMAL_POST(url, send).then(this.submitPromise);
    },

    // 提交数据  请求后的处理函数
    submitPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.tableHead = []; // 表头数据
      this.tableData = []; // 表格数据
      this.tableHeight = 0; // 表格高度
      this.$refs.uploadFile.value = '';
    },

  }
}
</script>

<style lang="scss" scoped>
.table-area {
  width: 100%;
  box-shadow: 0 0 1px lightgray;
  margin-top: 20px;
}

.none {
  display: none;
}

.upload-area {
  margin-top: 10px;
}

.dateSelect {
  width: 250px;
  margin-right: 20px;
}
</style>