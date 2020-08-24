<!-- 新建bbs帖子 -->
<template>
  <el-dialog title="创建帖子" :visible="dialogVisible" width="60%" top="3vh" :close-on-click-modal="false" :before-close="handleClose">
    <div class="input-area">
      <div class="each-input">
        <span class="name">名称:</span>
        <el-input class="value" v-model="title" placeholder="请输入内容"></el-input>
      </div>
      <div class="each-input">
        <span class="name">群组:</span>
        <el-select class="value" v-model="groupValue" placeholder="请选择群组">
          <el-option v-for="item in groupOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input">
        <span class="name">分类:</span>
        <el-select class="value" v-model="cateValue" placeholder="请选择分类">
          <el-option v-for="item in cateOptions" :key="item.id" :label="item.path" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input">
        <span class="name">处理人:</span>
        <el-select class="value" v-model="teacherValue" placeholder="请选择处理人">
          <el-option v-for="item in teacherOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input">
        <span class="name">问题描述:</span>
        <editor class="value"></editor>
      </div>
       <el-button @click="submit" type="primary" plain size="small" class="button" :disabled="!canSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editor from '../../components/editor/editor';
export default {
  name: 'newBbsDialog',

  components: { editor },
  
  computed: {

    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'newBbsDialog') {
        return true;
      } else {
        return false;
      }
    },

  },

  mounted: function () {
    this.getGroup();
    this.getCate();
    this.getTeacher();
    setTimeout(() => {
      let modal = document.getElementsByClassName('v-modal')[0];
      modal.style.zIndex = 1000;
      let wrapper = document.getElementsByClassName('el-dialog__wrapper')[0];
      wrapper.style.zIndex = 1001;
    }, 500);
  },

  data: function () {
    return {
      title: '', // 帖子名称
      groupValue: '', // 选择的群组
      groupOption: [], // 群组被选项
      cateValue: '', // 选择的分类
      cateOptions: [], // 备选的分类
      teacherValue: '', // 选择的处理人
      teacherOptions: [], // 备选人选项
      canSubmit: true, // 能否提交
    }
  },

  methods: {
    
    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 获取分类数据
    getCate: function () {
      let url = this.$INTERFACE.BBS_ALL_CATE;
      this.$NORMAL_POST(url).then(this.getCatePromise);
    },

    // 获取分类数据  请求后的处理函数
    getCatePromise: function (res) {
      this.cateOptions = res.data;
      if (res.data.length == 0) {
        this.$PUBILC.alert(this, '暂时无分类');
        this.canSubmit = false;
      } else {
        this.canSubmit = true;
      }
    },

    // 获取组别
    getGroup: function () {
      let url = this.$INTERFACE.ALL_GROUP;
      this.$NORMAL_POST(url).then(this.getGroupPromise);
    },

    // 获取组别  请求后的处理函数
    getGroupPromise: function (res) {
      this.groupOption = res.data;
    },

    // 获取处理人
    getTeacher: function () {
      let url = this.$INTERFACE.ALL_TEACHER;
      this.$NORMAL_POST(url).then(this.getTeacherPromise);
    },

    // 获取处理人  请求后的处理函数
    getTeacherPromise: function (res) {
      this.teacherOptions = res.data;
    },

    // 提交创建帖子
    submit: function () {
      if (this.title == '') {
        this.$PUBILC.alert(this, '请输入帖子名称');        
        return false;
      }
      if (this.groupValue == '') {
        this.$PUBILC.alert(this, '请输入所属群组');
        return false;
      }
      if (this.cateValue == '') {
        this.$PUBILC.alert(this, '请选择帖子分类');
        return false;
      }
      if (this.teacherValue == '') {
        this.$PUBILC.alert(this, '请选择处理人');
        return false;
      }
      if (this.$store.state.EDIT_CONTENT == '') {
        this.$PUBILC.alert(this, '请输入问题的描述');
        return false;
      }
      let data = { title: this.title, cat_id: this.cateValue, group_id: this.groupValue, teacher_id: this.teacherValue, content: this.$store.state.EDIT_CONTENT };
      this.$emit('submit', data);
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: solid 1px #e9e9e9;
}

.each-input {
  width: 90%;
  margin: 5px auto;
}

.input-area .name {
  display: block;
  padding: 5px 10px;
}

.input-area .value {
  width: 100%
}

.button {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}
</style>