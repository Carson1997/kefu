<template>
  <el-dialog title="论坛类目管理" :visible="dialogVisible" width="80%" top="8vh" :before-close="handleClose" :close-on-click-modal="false">
    <div id="tableArea" class="table-area" :style="{ 'height': areaHeight + 'px' }">
      <div class="control-area"> <!-- 控制区域 -->
        <el-button type="primary" plain size="mini" @click="newCate">新建分类</el-button>
      </div>
      <el-table class="detail-area" border :data="tableData" style="width: 100%" :height="tableHeight"> <!-- 表格区域 -->
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="path" label="类目" align="center"></el-table-column>
        <el-table-column prop="group_name" label="群组" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain @click="editCate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteCate(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <newBbsCateDialog @close="closeNewBbsCate" :baseData="editCateData" @submit="submitCate" :groupOptions="groupOptions" :cateOptions="cateData" v-if="newBbsCateDialogShow"></newBbsCateDialog>
  </el-dialog>
</template>

<script>
import newBbsCateDialog from '../../components/newFileDetail/newBbsCateDialog';
export default {
  name: 'bbsCateDialog',

  components: { newBbsCateDialog },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'bbsCateDialog') {
        return true;
      } else {
        return false;
      }
    },
    cateData: function () { // 类目数据
      let arr = this.tableData.slice(0);
      arr.unshift({ id: '0', name: '无父级' });
      console.log(arr);
      return arr;
    }
  },

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 180, // 对话框高度
      tableHeight: 0, // 表格高度
      tableData: [], // 表格数据
      newBbsCateDialogShow: false, // 是否显示新建类目对话框
      groupOptions: [],
      editCateData: {}, // 编辑的类目
    }
  },

  mounted: function () {
    this.getGroup();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 获取所有分类
    getData: function () {
      let url = this.$INTERFACE.BBS_ALL_CATE;
      this.$NORMAL_POST(url).then(this.getDataPromise);
    },

    // 获取所有分类  请求后的处理函数
    getDataPromise: function (res) {
      for (let i in res.data) {
        res.data[i]['group_name'] = this.groupOptions[res.data[i]['group_id']]['name'];
      }
      this.tableData = res.data;
      let func = this.$PUBILC.setTableHeight('tableArea', this, 80);
      func();
    },

    // 获取群组
    getGroup: function () {
      let url = this.$INTERFACE.ALL_GROUP;
      this.$NORMAL_POST(url).then(this.getGroupPromise);
    },

    // 获取群组  请求后的处理函数
    getGroupPromise: function (res) {
      let obj = {};
      for (let i in res.data) {
        obj[res.data[i].id] = res.data[i];
      }
      this.groupOptions = obj;
      this.getData();
    },

    // 新建类目
    newCate: function () {
      this.newBbsCateDialogShow = true;
      this.$store.commit('changeNowSecDialog', 'newBbsCateDialog');
    },

    // 提交新类目
    submitCate: function (data) {
      let url = this.$INTERFACE.NEW_BBS_CATE;
      this.$NORMAL_POST(url, data).then(this.submitCatePromise);
    },

    // 提交新类目  请求后的处理函数
    submitCatePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.newBbsCateDialogShow = false;
      this.$store.commit('changeNowSecDialog', '');
      this.getData();
    },

    // 关闭新类目对话框
    closeNewBbsCate: function () {
      this.newBbsCateDialogShow = false;
      this.$store.commit('changeNowSecDialog', '');
    },

    // 删除分类
    deleteCate: function (id) {
      let url = this.$INTERFACE.DELETE_BBS_CATE;
      let send = { id: id };
      this.$NORMAL_POST(url, send).then(this.deleteCatePromise);
    },

    // 删除分类  请求后的处理函数
    deleteCatePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    },

    // 编辑分类
    editCate: function (data) {
      this.newBbsCateDialogShow = true;
      this.editCateData = data;
      this.$store.commit('changeNowSecDialog', 'newBbsCateDialog');
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-area {
  width: 100%;
  border-top: solid 1px #eeeeee;
}

.control-area {
  width: 100%;
  padding: 15px;
}

.table-area {
  width: 98%;
  margin: 0 auto;
  box-shadow: 0 0 1px lightgray;
}
</style>