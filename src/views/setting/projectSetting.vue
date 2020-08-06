<template>
  <div id="projectSetting">
    <div class="control-area"> <!-- 控制区域 -->
      <el-button type="primary" size="small" @click="newProject">创建项目</el-button>
      <el-input class="search-input" v-model="searchInput" placeholder="输入项目名称搜索项目" clearable suffix-icon="el-icon-search"></el-input>
    </div>

    <el-table :data="tableDataShow" border style="width: 100%; margin-top: 20px" :height="tableHeight">
      <el-table-column prop="name" label="项目名" align="center"></el-table-column>
      <el-table-column prop="date" label="最后修改时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="changeProject(scope.row)">修改项目的模块权限</el-button>
          <el-button type="primary" size="mini" @click="changeProjectUser(scope.row)">设置项目超级管理员</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <createProjectDialog :projectData="projectData" @update="getTableData" v-if="createProjectDialog"></createProjectDialog>
    <projectSuperUserDialog @superUserClose="superUserClose" :projectId="projectId" v-if="projectSuperUserDialog"></projectSuperUserDialog>
  </div>
</template>

<script>
import createProjectDialog from '../../components/setting/createProjectDialog';
import projectSuperUserDialog from '../../components/setting/projectSuperUserDialog';
export default {
  name: 'projectSetting',

  components: { createProjectDialog, projectSuperUserDialog },

  data: function () {
    return {
      searchInput: '', // 搜索的内容
      tableData: [], // 表格数据
      createProjectDialog: false, // 是否显示创建项目对话框
      tableHeight: 0, // 表格高度
      projectData: {}, // 项目数据
      projectId: '', // 项目id
      setTableHeightFunc: '', // 设置表格高度的方法
      projectSuperUserDialog: false, // 是否显示设置超级用户对话框
    }
  },

  mounted: function () {
    this.getTableData();
  },

  computed: {
    tableDataShow: function () {
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

  methods: {

    // 获取表格数据
    getTableData: function () {
      this.createProjectDialog = false;
      this.$NORMAL_POST(this.$INTERFACE.ALL_PROJECT).then(this.getTableDataPromise);
    },

    // 获取表格数据  请求后的处理函数
    getTableDataPromise: function (res) {
      this.tableData = res.data;
      this.setTableHeightFunc = this.$PUBILC.setTableHeight('projectSetting', this);
      this.setTableHeightFunc();
      this.$PUBILC.tableHeightListener(this.setTableHeightFunc);
    },

    // 创建新项目按钮被点击  弹出创建新项目对话框
    newProject: function () {
      this.projectData = {};
      this.createProjectDialog = true;
      this.$store.commit('changeNowDialog', 'createProjectDialog');
    },

    // 修改项目
    changeProject: function (data) {
      this.createProjectDialog = true;
      this.$store.commit('changeNowDialog', 'createProjectDialog');
      this.projectData = data;
    },

    // 修改项目的超级用户
    changeProjectUser: function (data) {
      this.projectId = data.id;
      this.projectSuperUserDialog = true;
      this.$store.commit('changeNowDialog', 'projectSuperUserDialog');
    },

    // 管理员框关闭
    superUserClose: function () {
      this.projectSuperUserDialog = false;
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