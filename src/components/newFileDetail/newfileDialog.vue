<template>
  <el-dialog :title="dialogTitle" :visible="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="input-area">
      <el-input class="each-input" placeholder="请输入内容" v-model="editFileData.name">
        <template slot="prepend">名称: </template>
      </el-input>
      <div class="each-input">
        <span class="name">分组:</span>
        <el-select class="value" v-model="editFileData.authority" placeholder="权限">
          <el-option v-for="item in isGroupingOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input" v-if="editFileData.authority == 1">
        <span class="name">群组:</span>
        <el-select class="value" v-model="editFileData.grouping" placeholder="请选择有权查看的群组" multiple collapse-tags filterable>
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-button size="small" type="primary" class="button" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newfileDialog',

  props: [ 'nowFile', 'editFileData' ],
  
  data: function () {
    return {
      groupOptions: [], // 待选的群组
      isGroupingOptions: [ // 是否开启权限数据
        { id: '0', name: '不开启' },
        { id: '1', name: '开启' },
      ],
      dialogTitle: '', // 弹框名称
    }
  },

  computed: {
    dialogVisible: function () {
      if (this.$store.state.NOW_OPEN_DIALOG == 'newfileDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted: function () {
    this.setName();
    this.getGroup();
  },

  methods: {

    setName: function () {
      let name = this.editFileData.file_type == '0' ? '文件夹' : '文件';
      this.dialogTitle = '请输入' + name + '的详细信息';
    },

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$emit('closeHandle');
    },

    // 获取所有群组
    getGroup: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_GROUP).then(this.getGroupPromise);
    },

    // 获取所有群组  请求后的处理函数
    getGroupPromise: function (res) {
      this.groupOptions = res.data;
    },

    // 提交
    submit: function () {
      let legitimacy = this.checkLegitimacy();
      if (legitimacy == true) {
        let nameConflict = this.fileNameCheck(this.editFileData.name);
        if (nameConflict == false) {
          this.editFileData.grouping = this.editFileData.grouping.join(',');
          this.$emit('newFolderApply', this.editFileData);
          this.handleClose();
        }
      }
    },

    // 检测输入的合法合法性
    checkLegitimacy: function () {
      if (this.editFileData.filename == '') {
        this.$message({ type: 'error', message: '请输入文件名' });
        return false;
      }
      if (this.editFileData.authority == '') {
        this.$message({ type: 'error', message: '请选择文件权限' });
        return false;
      }
      if (this.editFileData.authority == 1 && this.editFileData.grouping.length == 0) {
        this.$message({ type: 'error', message: '请选择拥有权限的群组' });
        return false;
      }
      return true;
    },

    // 文件名检测是否冲腿
    fileNameCheck: function (value) {
      for (let i in this.nowFile) {
        if (this.nowFile[i]['name'] == value) {
          this.alertBox('该文件夹下存在同名文件或者文件夹');
          return true;
        }
      }
      return false;
    },

    // 提示弹框
    alertBox: function (content) {
      this.$alert(content, '提示', { confirmButtonText: '确定' })
    },

  }
  
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  padding: 20px;
  border-top: solid 1px lightgray;
}

.each-input {
  margin-bottom: 30px;
}

.each-input span {
  width: 74px;
  display: block;
  float: left;
  line-height: 38px;
  text-align: center;
  background-color: #F5F7FA;
  color: #909399;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}

.each-input .value {
  width: calc(100% - 74px);
}

.each-radio {
  margin-left: 10px;
}

.special-value {
  height: 40px;
  line-height: 40px;
  border: 1px solid #DCDFE6;
}

.button {
  display: block;
  margin: 0 auto;
}
</style>