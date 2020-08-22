<template>
  <div id="makeTable" class="make-table">
    <div class="control-area"> <!-- 控制区域 -->
      <el-button type="primary" plain size="small" @click="newTable">创建表格</el-button>
    </div>
    
    <el-table :data="tableData" class="table-area" style="width: 100%" :height="tableHeight">
      <el-table-column prop="name" label="报表名称" align="center"></el-table-column>
      <el-table-column prop="description" label="报表描述" align="center"></el-table-column>
      <el-table-column prop="date" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="editTableData(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delTableData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建表格对话框 -->
    <newTableBase @close="closeNewTableBase" v-if="newTableBaseShow" @submit="newTableBaseHandle"></newTableBase>
    <!-- 新建表格头部 -->
    <newTableHead :fatherSelect="editDataSelect" @close="closeNewTableHead" v-if="newTableHeadShow" @submit="newTableHeadHandle"></newTableHead>
  </div>
</template>

<script>
import newTableBase from '../../components/newFileDetail/newTableBase';
import newTableHead from '../../components/newFileDetail/newTableHead';
export default {
  name: 'makeTable',

  components: { newTableBase, newTableHead },
  
  data: function () {
    return {
      tableData: [], // 表格数据
      newTableBaseShow: false, // 是否显示创建表格对话框
      newTableHeadShow: false, // 是否显示创建表格属性对话框
      baseData: {}, // 创建表格时的基础信息
      tableHeight: 0, // 表格高度
      editDataSelect: [], // 编辑行选中的值
    }
  },

  mounted: function () {
    this.getTableData();
  },

  methods: {

    // 获取表格数据
    getTableData: function () {
      let url = this.$INTERFACE.ALL_TABLE;
      this.$NORMAL_POST(url).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求后的处理函数
    getTableDataPromise: function (res) {
      this.tableData = res.data;
      let func = this.$PUBILC.setTableHeight('makeTable', this, 130);
      func();
    },

    // 新建表格
    newTable: function () {
      this.newTableBaseShow = true;
      this.$store.commit('changeNowDialog', 'newTableBase');
    },

    // 关闭表格基础对话框
    closeNewTableBase: function () {
      this.newTableBaseShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 关闭表格属性框
    closeNewTableHead: function () {
      this.editDataSelect = '';
      this.newTableHeadShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 新建表格基础信息
    newTableBaseHandle: function (data) {
      this.closeNewTableBase();
      this.baseData = data;
      this.editDataSelect = ''
      this.newTableHeadShow = true;
      this.$store.commit('changeNowDialog', 'newTableHead');
    },

    // 新建表格表头信息
    newTableHeadHandle: function (data) {
      let url = this.$INTERFACE.ADD_TABLE;
      let send = this.baseData;
      send['associate'] = data;
      this.$NORMAL_POST(url, send).then(this.newTableHeadHandlePromise);
    },

    // 新建表格表头信息  请求后的处理函数
    newTableHeadHandlePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.closeNewTableHead();
      this.getTableData();
    },

    // 编辑表格数据
    editTableData: function (data) {
      this.editDataSelect = data.associate;
      this.baseData = { id: data.id, name: data.name, description: data.description };
      this.newTableHeadShow = true;
      this.$store.commit('changeNowDialog', 'newTableHead');
    },

    // 删除表格数据
    delTableData: function (id) {
      let _this = this;
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        let url = _this.$INTERFACE.DEL_TABLE;
        let send = { id: id };
        _this.$NORMAL_POST(url, send).then(_this.delTableDataPromise);
      }).catch();
    },

    // 删除表格数据  请求后的处理函数
    delTableDataPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getTableData();
    },
    
  }
}
</script>

<style lang="scss" scoped>
.table-area {
  box-shadow: 0 0 1px #8a8a8a;
  margin-top: 15px;
}
</style>