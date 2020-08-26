<!-- 创建重要通知对话框 -->
<template>
  <el-dialog title="创建重要通知" :visible="dialogVisible" width="50%" top="10vh" :before-close="handleClose" :lose-on-click-modal="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">名称: </span>
        <el-input class="value" v-model="imformationName" placeholder="请输入内容"></el-input>
        <div class="clear"></div>
      </div>
      <div class="each-input">
        <span class="name">是否开启权限: </span>
        <el-select class="value" v-model="authValue" placeholder="请选择是否开启权限">
          <el-option v-for="item in authOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>
      <div class="each-input" v-if="authValue != 0">
        <span class="name">群组: </span>
        <el-select class="value" multiple v-model="groupValue" placeholder="请选择是否开启权限">
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>
      <div class="each-input">
        <span class="name">内容: </span>
        <editor class="value"></editor>
        <div class="clear"></div>
      </div>
      <el-button type="primary" plain size="mini" class="submit-button" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editor from '../../components/editor/editor';
export default {
  name: 'newImformationDialog',

  components: { editor },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newImformationDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  data: function () {
    return {
      imformationName: '', // 重要通知名称
      authValue: 0, // 是否开启权限
      authOptions: [ // 权限的选项
        { id: 0, name: '不开启' },
        { id: 1, name: '开启' }
      ],
      groupValue: '', // 选择的群组
      groupOptions: [], // 群组的待选项
    }
  },
  
  props: [ 'imformationData' ],

  mounted: function () {
    this.getGroups();
  },

  methods: {

    // 初始化数据
    init: function () {
      if (this.imformationData != undefined) {
        this.imformationName = this.imformationData.title;
        this.authValue = this.imformationData.authority;
        this.groupValue = this.imformationData.grouping.split(',');
      }
    },

    // 获取群组
    getGroups: function () {
      let url = this.$INTERFACE.ALL_GROUP;
      this.$NORMAL_POST(url).then(this.getGroupsPromise);
    },

    // 获取群组  请求后的处理函数
    getGroupsPromise: function (res) {
      this.groupOptions = res.data;
    },
    
    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 提交
    submit: function () {
      if (this.imformationName == '') {
        this.$PUBILC.alert(this, '请输入通知名称');
        return false;
      }
      if (this.authValue == 1 && this.groupValue == '') {
        this.$PUBILC.alert(this, '请选择群组');
        return false;
      }
      if (this.$store.state.EDIT_CONTENT == '') {
        this.$PUBILC.alert(this, '请输入重要通知内容');
        return false;
      }
      let obj = { name   : this.imformationName, content: this.$store.state.EDIT_CONTENT, authority: this.authValue };
      if (this.authValue == 1) {
        obj['grouping'] = this.groupValue.join(',');
      }
      this.$emit('submit', obj);
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  padding: 20px;
  border-top: solid 1px lightgray;
}

.each-input {
  width: 100%;
  margin-bottom: 20px;
}

.each-input .name {
  width: 120px;
  display: block;
  float: left;
  line-height: 40px;
  text-align: center;
}

.each-input .value {
  width: calc(100% - 120px);
  float: left;
}

.submit-button {
  display: block;
  margin: 0 auto;
}
</style>