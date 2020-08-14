<!-- 产品类目详细 -->
<template>
  <el-dialog title="产品类目详情" :visible="dialogVisible" width="98%" top="3vh" :before-close="handleClose">
    <div class="dialog-area" v-bind:style="{ height: dialogHeight + 'px' }">
      <div class="control-area">
        <el-button class="each-button" type="primary" plain size="small" @click="editHead">编辑现有表头</el-button>
        <el-button class="each-button" type="success" plain size="small">添加数据行</el-button>
      </div>

      <div class="table-area">

      </div>
      <editTableHeadDialog @fromEditTableHead="fromEditTableHead" v-if="editTableHeadDialogShow" :headData="headData" :headIndex="headIndex"></editTableHeadDialog>
    </div>
  </el-dialog>
</template>

<script>
import editTableHeadDialog from '../../components/fileDetail/editTableHeadDialog'
export default {
  name: 'productCatDetail',

  props: [ 'productCatData' ],

  components: { editTableHeadDialog },

  computed: {
    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'productCatDetail') {
        return true;
      } else {
        return false;
      }
    }
  },

  data: function () {
    return {
      dialogHeight: document.body.clientHeight - 140, // 对话框高度
      prdData: [], // 表格详细数据
      headData: [], // 表头数据
      headIndex: '', // 表头下标
      editTableHeadDialogShow: false, // 是否显示编辑表头对话框
      editRowId: '', // 当前编辑行的id
    }
  },

  mounted: function () {
    this.getData();
  },

  methods: {

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
      this.prdData = res.data;
      let keys = this.prdData.key.split(','); // 所有的属性
      let data = this.prdData.data; // 所有见到的数据
      let headData = this.makeHead(keys, data[0]);
      console.log(headData);
      this.headData = headData.data;
      this.headIndex = headData.index;
    },

    // 制做表头
    makeHead: function (keys, data) {
      let arr = [];
      let index = 0;
      for (let i in keys) {
        let obj = { name: keys[i], value: data == undefined ? '' : data[keys[i]] };
        if (obj['value'] != '') {
          index = parseFloat(i) + 1;
        }
        arr.push(obj);
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
      let send = { id: this.editRowId, inner: JSON.stringify(obj), fid: this.productCatData.fid };
      this.$NORMAL_POST(this.$INTERFACE.ADD_PRODUCT_CATEGORY_DETAIL, send).then(this.editTableApplyPromise);
    },

    // 添加修改表头  请求后的处理函数
    editTableApplyPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.$store.commit('changeNowSecDialog', '');
      this.editTableHeadDialogShow = false;
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
</style>