<!-- 创建项目对话框 -->
<template>
  <el-dialog title="创建新项目" :visible="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <div class="each-input-area">
        <span class="name">项目名:</span>
        <el-input class="value" v-model="projectName" placeholder="请输入项目名"></el-input>
      </div>
      <div class="each-input-area">
        <span class="name">可分配权限:</span>
        <el-table :data="tableData" style="width: 100%; margin-top: 20px" border :height="tableHeight">
          <el-table-column el-table-column label="模块权限" align="center">
            <template slot-scope="scope">
              <span class="iconfont icon" :class="scope.row.icon"></span>
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column el-table-column label="是否开启权限" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button class="add-button" type="primary" size="small" @click="submitNewProject">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'createProjectDialog',

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'createProjectDialog') {
        return true;
      } else {
        return false;
      }
    },

    tableData: function () { // 表格数据
      let arr = [];
      for (let i in this.$store.state.PAGE_LEFT_NAV) {
        let obj = JSON.parse(JSON.stringify(this.$store.state.PAGE_LEFT_NAV[i]));
        if (this.projectType.indexOf(obj['index']) > -1) {
          obj['isOpen'] = true;
        } else {
          obj['isOpen'] = false;
        }
        arr.push(obj);
      }
      return arr;
    }
  },

  props: [ 'projectData' ],

  data: function () {
    return {
      projectName: '', // 项目名称
      projectId: '', // 项目id
      projectType: '', // 项目模块权限
      tableHeight: '300px', // 表格高度
    }
  },

  mounted: function () {
    this.initProjectData();
  },

  methods: {

    // 初始化对话框数据
    initProjectData: function () {
      if (Object.keys(this.projectData).length != 0) {
        this.projectName = this.projectData.name;
        this.projectId = this.projectData.id;
        this.projectType = this.projectData.type;
      }
      
    },

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$emit('update');
    },

    // 提交新项目
    submitNewProject: function () {
      let legitimacy = this.checkLegitimacy();
      if (legitimacy != false) {
        let data = { name: this.projectName, type: legitimacy };
        if (this.projectId != '') {
          data['id'] = this.projectId;
        }
        this.$NORMAL_POST(this.$INTERFACE.NEW_PROJECT, data).then(this.submitNewProjectPromise);
      }
    },

    // 提交新项目  请求后的处理函数
    submitNewProjectPromise: function (res) {
      this.$message({ type: 'success', message: '创建成功!' });
      this.handleClose();
    },

    // 检查输入的合法性
    checkLegitimacy: function () {
      let arr = [];
      if (this.projectName == '') {
        this.$message({ type: 'error', message: '项目名不能为空' });
        return false;
      }
      for (let i in this.tableData) {
        if (this.tableData[i]['isOpen'] == true) {
          arr.push(this.tableData[i]['index']);
        }
      }
      if (arr.length > 0) {
        return arr.join(',');
      } else {
        this.$message({ type: 'error', message: '请为项目选择模块权限!' });
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  height: 480px;
  padding-top: 10px;
  border-top: solid 1px #e0e0e0;
  overflow: auto;
}

.each-input-area {
  width: 90%;
  margin: 15px auto;
}

.each-input-area .name {
  width: 80px;
  text-align: center;
  display: inline-block;
}

.each-input-area .value {
  width: calc(100% - 80px);
}

.add-button {
  display: block;
  margin: 0 auto;
  margin-bottom: 10px;
}

.icon {
  font-size: 16px;
}
</style>