<!-- 创建知识库分类对话框 -->
<template>
  <el-dialog title="创建知识库分类" :visible="dialogVisible" width="30%" :before-close="handleClose"  :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="input-area">
      <el-input class="each-input" placeholder="请输入知识库分类" v-model="categoryName">
        <template slot="prepend">知识库分类名称: </template>
      </el-input>

      <div class="each-input">
        <span class="name">分类所属父级: </span>
        <el-select class="value" v-model="fatherCategoryValue" placeholder="请选择分类所属父级">
          <el-option v-for="item in fatherCategoryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>
      
      <el-button type="primary" size="small" class="add-button" @click="addCategory">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'createNoticeCategoryDialog',

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'createNoticeCategoryDialog') {
        return true;
      } else {
        return false
      }
    }
  },

  props: ['fatherCategory'],

  data: function () {
    return {
      categoryName: '', // 知识库分类名称
      fatherCategoryValue: '', // 父级知识库分类选中的值
      fatherCategoryOptions: [], // 父级知识库分类选项
    }
  },

  mounted: function () {
    this.makeFatherCategory();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$emit('update');
    },

    // 制做父级的知识库分类
    makeFatherCategory: function () {
      let arr = JSON.parse(JSON.stringify(this.fatherCategory));
      this.fatherCategoryOptions = arr;
    },

    // 添加知识库分类
    addCategory: function () {
      if (this.categoryName == '') {
        this.$alert('请输入知识库分类', '警告', { confirmButtonText: '确定' });
      } else {
        let send = { name: this.categoryName };
        if (this.fatherCategoryValue != '') {
          send['fid'] = this.fatherCategoryValue
        }
        this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.addCategoryPromise);
      }
    },

    // 添加知识库分类  请求后的处理函数
    addCategoryPromise: function (res) {
      this.$message({ type: 'success', message: '添加成功!' });
      this.handleClose();
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #e0e0e0;
  padding-top: 20px;
  padding-bottom: 20px;
}

.input-area .each-input {
  width: 100%;
  padding: 10px 5%;
}

.input-area .each-input .name {
  background-color: #F5F7FA;
  color: #909399;
  width: 140px;
  display: block;
  float: left;
  line-height: 38px;
  text-align: center;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  border-right: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.input-area .each-input .value {
  width: calc(100% - 140px);
  display: block;
  float: left;
}

.add-button {
  display: block !important;
  margin: 0 auto !important;
  margin-top: 10px !important;
}
</style>