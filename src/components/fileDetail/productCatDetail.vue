<!-- 产品参数详细表格 -->
<template>
  <el-dialog title="产品类目详情" :visible="dialogVisible" width="98%" top="3vh" :before-close="handleClose">
    <div id="productDialog" class="dialog-area" v-bind:style="{ height: dialogHeight + 'px' }">
      <div class="control-area">
        <el-button class="each-button" type="primary" plain size="small" @click="editHead" v-if="editAuth == true">编辑现有表头</el-button>
        <el-button class="each-button" type="success" plain size="small" @click="editBody('')"  v-if="editAuth == true">添加数据行</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table class="table-area" :data="prdData" border :height="tableHeight">
        <el-table-column v-for="(item, index) in headDataShow" :key="index" :prop="item.name" :label="item.value" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[item.name] != null">
              <img class="img" :src="sourceUrl + scope.row[item.name]" v-if="scope.row[item.name].indexOf('Public/upload/file/') != -1">
              <span v-else>{{ scope.row[item.name] }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="editAuth == true" type="primary" size="mini" plain @click="editBody(scope.row)">编辑</el-button>
            <el-button v-if="editAuth == true" type="danger" size="mini" plain @click="deleteBody(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      
      <!-- 编辑表头的对话框 -->
      <editTableHeadDialog @close="closeDialog" @fromEditTableHead="fromEditTableHead" v-if="editTableHeadDialogShow" :headData="headData" :headIndex="headIndex"></editTableHeadDialog>
      <!-- 编辑表身对话框 -->
      <editPrdTbodyDialog v-if="editTableBodyDialogShow" @close="closeDialog" @submit="bodySubmit" :rowData="editRowData"></editPrdTbodyDialog>
    </div>
  </el-dialog>
</template>

<script>
import editTableHeadDialog from '../../components/fileDetail/editTableHeadDialog';
import editPrdTbodyDialog from '../../components/fileDetail/editPrdTbodyDialog';
export default {
  name: 'productCatDetail',

  props: [ 'productCatData', 'editAuth' ],

  components: { editTableHeadDialog, editPrdTbodyDialog },

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'productCatDetail') {
        return true;
      } else {
        return false;
      }
    },

    headDataShow: function () { // 显示的表头
      let arr = []
      arr = this.headData.filter(item => {
        return (item.value != '' && item.value != 'null');
      });
      return arr;
    }
  },

  data: function () {
    return {
      dialogHeight: document.body.clientHeight - 140, // 对话框高度
      prdData: [], // 表格详细数据
      headData: [], // 表头数据
      headIndex: '', // 表头下标
      editTableHeadDialogShow: false, // 是否显示编辑表头对话框
      editTableBodyDialogShow: false, // 是否显示编辑表身对话框
      editRowId: '', // 当前编辑行的id
      tableHeight: 0, // 表格高度
      tableHeightFunc: '', // 设置表格高度的方法
      editRowData: {}, // 编辑行的数据
      headRowId: '', // 编辑行头的id
      sourceUrl: 'http://service.miniice.cn/binghuo_information/', // 素材的根地址
    }
  },

  mounted: function () {
    this.getData();
    this.initTableFunc();
  },

  methods: {

    // 初始化表格的方法
    initTableFunc: function () {
      this.tableHeightFunc = this.$PUBILC.setTableHeight('productDialog', this, 110);
    },

    // 关闭
    handleClose: function () {
      this.$emit('close');
    },

    // 获取数据
    getData: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_PRODUCT_CATEGORY_DETAIL, this.productCatData).then(this.getDataPromise);
    },

    // 获取数据 请求后的处理函数
    getDataPromise: function (res) {
      this.headRowId = res.data.data.length == 0 ? '' : res.data.data[0].id;
      this.prdData = res.data.data.slice(1);
      let keys = res.data.key.split(','); // 所有的属性
      let data = res.data.data; // 所有见到的数据
      let headData = this.makeHead(keys, data[0]);
      this.headData = headData.data;
      this.headIndex = headData.index;
      this.tableHeightFunc();
    },

    // 制做表头
    makeHead: function (keys, data) {
      let arr = [];
      let index = 0;
      for (let i in keys) {
        let obj = { name: keys[i], value: data == undefined ? '' : data[keys[i]] == null ? 'null' : data[keys[i]] };
        if (obj['value'] != '') {
          index = parseFloat(i) + 1;
        }
        if (obj['value'].toString() != 'null') { // 之前删除了的不再显示
          arr.push(obj);
        }
      }
      return { data: arr, index: index };
    },

    // 编辑表格头部
    editHead: function () {
      this.editTableHeadDialogShow = true;
      this.$store.commit('changeNowSecDialog', 'productCatDetail');
    },

    // 修改表格头部的数据
    fromEditTableHead: function (data) {
      let order = data.order;
      if (order == 'addIndex') {
        this.headIndex = this.headIndex + 1;
      } else if (order == 'subIndex') {
        let value = data.value;
        this.headData[value]['value'] = null;
      } else if (order == 'submit') {
        this.editTableApply();
      }
    },

    // 添加修改表头
    editTableApply: function () {
      let obj = {};
      for (let i in this.headData) {
        obj[this.headData[i]['name']] = this.headData[i]['value'];
      }
      let send = { id: this.headRowId, inner: JSON.stringify(obj), fid: this.productCatData.fid };
      this.$NORMAL_POST(this.$INTERFACE.ADD_PRODUCT_CATEGORY_DETAIL, send).then(this.editTableApplyPromise);
    },

    // 编辑表身
    editBody: function (data) {
      this.editRowId = data.id; // 当前编辑行的id
      let obj = {};
      for (let i in this.headDataShow) {
        obj[this.headDataShow[i]['name']] = { 'colName': this.headDataShow[i]['value'], 'value': data == '' ? '' : data[this.headDataShow[i]['name']], isImg: false };
      }
      this.editRowData = obj;
      this.editTableBodyDialogShow = true;
      this.$store.commit('changeNowSecDialog', 'editPrdTbodyDialog');
    },
    
    // 提交表身请求
    bodySubmit: function (data) {
      let obj = {};
      for (let i in data) {
        obj[i] = data[i]['value'];
      }
      let send = { id: this.editRowId, inner: JSON.stringify(obj), fid: this.productCatData.fid }
      this.$NORMAL_POST(this.$INTERFACE.ADD_PRODUCT_CATEGORY_DETAIL, send).then(this.bodySubmitPromise);
    },

    // 提交表身请求  处理函数
    bodySubmitPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.$store.commit('changeNowSecDialog', '');
      this.editTableBodyDialogShow = false;
      this.getData();
    },

    // 添加修改表头  请求后的处理函数
    editTableApplyPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.$store.commit('changeNowSecDialog', '');
      this.editTableHeadDialogShow = false;
      this.getData();
    },

    // 关闭对话框
    closeDialog: function (data) {
      this.getData();
      this.$store.commit('changeNowSecDialog', '');
      this.editRowId = '';
      if (data == 'productCatDetail') {
        this.editTableHeadDialogShow = false;
      } else if (data == 'editPrdTbodyDialog') {
        this.editTableBodyDialogShow = false;
      }
    },

    // 删除数据行
    deleteBody: function (id) {
      let send = { id: id, fid: this.productCatData.fid };
      this.$NORMAL_POST(this.$INTERFACE.DEL_PRODUCT_CATEGORY_DETAIL, send).then(this.deleteBodyPromise);
    },

    // 删除数据行  请求后的处理函数
    deleteBodyPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-area {
  width: 100%;
  border-top: solid 1px #dfdfdf;
}

.control-area {
  margin: 20px;
}

.control-area .each-button {
  margin-right: 10px;
}

.table-area {
  width: 98%;
  margin: 10px auto;
  margin-top: 25px;
  box-shadow: 0 0 1px #b6b6b6;
}

.img {
  width: 60px;
}
</style>