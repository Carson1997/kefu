<template>
  <div id="dataStatisticsTable">
    <div class="select-area"> <!-- 选择区域 -->
      <div class="each-select">
        <span class="name">日期类型: </span>
        <el-select class="value" v-model="dateType" placeholder="请选择日期类型" @change="dateTypeChange">
          <el-option v-for="item in dateTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-select">
        <span class="name">日期: </span>
        <el-date-picker :key="index" :picker-options="pickerOptions" class="value" v-model="date" :type="pickerType" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="each-select">
        <span class="name">表格: </span>
        <el-select class="value" v-model="tableValue" placeholder="请选择表格">
          <el-option v-for="item in tableValueOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-button type="primary" plain size="small" class="submit-button" @click="submit">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" class="table-area" style="width: 100%" border :height="tableHeight">
      <el-table-column v-for="(item, index) in tableHead" :key="index" align="center" :prop="item.index" :label="item.name">
        <template slot-scope="scope">
          {{ scope.row[item.index] == null ? '-' : scope.row[item.index] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'dataStatisticsTable',

  data: function () {
    return {
      tableData: [], // 表格数据
      dateType: '', // 日期类型
      dateTypeOptions: [
        { id: 1, name: '日' },
        { id: 2, name: '月' }
      ], // 日期类型备选项
      tableValue: '', // 选中的表格类型
      tableValueOptions: [], // 表格备选项
      date: '', // 选择的日期
      pickerOptions: {}, // 日期选择的配置
      pickerType: 'daterange', // 日期类型
      index: 1,
      tableHead: {}, // 表格头部
      tableHeight: 0, // 表格高度
    }
  },

  mounted: function () {
    this.getMergeTime();
    this.getTableOptions();
  },

  methods: {

    // 获取限制时间
    getMergeTime: function () {
      let url = this.$INTERFACE.TABLE_MERGE_TIME;
      this.$NORMAL_POST(url).then(this.getMergeTimePromise);
    },

    // 获取限制时间  请求后的处理函数
    getMergeTimePromise: function (res) {
      let start = new Date(res.data.start).getTime() - 24 * 60 * 60 * 1000;
      let end = new Date(res.data.end).getTime();
      this.pickerOptions['disabledDate'] = function (time) {
        return time < start || time > end;
      }
    },

    // 日期类型发生变化
    dateTypeChange: function () {
      this.index += 1;
      this.pickerType = this.dateType == 1 ? 'daterange' : 'month';
      this.date = '';
    },

    // 获取所有表格选项
    getTableOptions: function () {
      let url = this.$INTERFACE.ALL_TABLE;
      this.$NORMAL_POST(url).then(this.getTableOptionsPromise);
    },

    // 获取所有表格选项  请求后的处理函数
    getTableOptionsPromise: function (res) {
      this.tableValueOptions = res.data;
    },

    // 提交查询
    submit: function () {
      let url = this.$INTERFACE.TABLE_DATA;
      let send = { type: this.dateType, id: this.tableValue };
      if (this.dateType == 1) {
        send['time'] = this.date[0] + '_' + this.date[1]; 
      }
      this.$NORMAL_POST(url, send).then(this.submitPromise);
    },

    // 提交查询  请求后的处理函数
    submitPromise: function (res) {
      let arr = [];
      for (let i in res.data.title) {
        if (i != 'ec' && i != 'ed') {
          arr.push({ index: i, name: res.data.title[i] });
        } else {
          arr.unshift({ index: i, name: res.data.title[i] });
        }
      }
      this.tableHead = arr;
      this.tableData = res.data.list;
      let func = this.$PUBILC.setTableHeight('dataStatisticsTable', this, 135);
      func();
    },
  }
}
</script>

<style lang="scss" scoped>
.select-area {
  width: 100%;
  padding-bottom: 15px;
}

.select-area .each-select {
  width: 25%;
  float: left;
}

.select-area .each-select .name {
  width: 100px;
  float: left;
  line-height: 40px;
  color: #575757;
  text-align: center;
}

.select-area .each-select .value {
  width: calc(100% - 150px);
}

.submit-button {
  margin-top: 5px;
}

.table-area {
  margin: 0 auto;
  box-shadow: 0 0 1px lightgray;
  margin-top: 10px;
}
</style>