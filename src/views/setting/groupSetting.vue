<!-- 群组设置 -->
<template>
  <div id="groupSetting">

    <!-- 控制区域 -->
    <div class="control-area">
      <el-button type="primary" size="small" @click="newGroup">创建群组</el-button>
      <el-input class="search-input" v-model="searchInput" placeholder="输入项目名称搜索项目" clearable suffix-icon="el-icon-search"></el-input>
    </div>

    <!-- 表格 -->
    <el-table :data="tableDataShow" style="width: 100%; margin-top: 20px" border :height="tableHeight">
      <el-table-column prop="name" label="群组名" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="changeGroup(scope.row)">修改群组名</el-button>
          <el-button type="danger" size="mini" @click="deleteGroup(scope.row)">删除群组</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建群组的对话框 -->
    <createGroupDialog :groupData="groupData" @update="getTableData" v-if="createGroupDialog"></createGroupDialog>
  </div>
</template>

<script>
import createGroupDialog from '../../components/setting/createGroupDialog';
export default {
  name: 'groupSetting',

  components: { createGroupDialog },

  data: function () {
    return {
      searchInput: '', // 搜索内容
      tableData: [], // 表格数据
      groupData: {}, // 群组数据
      createGroupDialog: false, // 是否显示添加群组对话框
      setTableHeightFunc: '', // 设置表格高度的方法
      tableHeight: 0, // 表格高度
    }
  },

  computed: {
    tableDataShow: function () { // 表格显示的内容
      if (this.searchInput == '') {
        return this.tableData;
      } else {
        let arr = this.tableData.filter(item => {
          return item.name.indexOf(this.searchInput) > -1;
        })
        return arr;
      }
    }
  },

  mounted: function () {
    this.getTableData();
  },

  methods: {

    // 获取表格数据
    getTableData: function () {
      this.createGroupDialog = false;
      this.$NORMAL_POST(this.$INTERFACE.ALL_GROUP).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求后的处理函数
    getTableDataPromise: function (res) {
      this.tableData = res.data;
      this.setTableHeightFunc = this.$PUBILC.setTableHeight('groupSetting', this);
      this.setTableHeightFunc();
      this.$PUBILC.tableHeightListener(this.setTableHeightFunc);
    },

    // 创建群组
    newGroup: function () {
      this.createGroupDialog = true;
      this.$store.commit('changeNowDialog', 'createGroupDialog');
    },

    // 编辑群组
    changeGroup: function (data) {
      this.groupData = data;
      this.createGroupDialog = true;
      this.$store.commit('changeNowDialog', 'createGroupDialog');
    },

    // 删除群组
    deleteGroup: function (data) {
      let _this = this;
      this.$confirm('是否删除群组? 该操作将无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$NORMAL_POST(_this.$INTERFACE.DELETE_USER, { id: data.id }).then(_this.deleteGroupPromise);
        }).catch(() => {});
    },

    // 删除群组  请求后的处理函数
    deleteGroupPromise: function (res) {
      this.$message({ type: 'success', message: '删除成功' })
      this.getTableData();
    }
    
  }

}
</script>

<style lang="scss" scoped>
.search-input {
  display: block;
  width: 400px;
  margin-top: 20px;
}
</style>