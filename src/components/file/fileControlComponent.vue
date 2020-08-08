<!-- 文件夹操作组件 -->
<template>
  <div class="file-control-component">
    <el-button type="primary" size="small" class="left" v-if="fileControlAuth == true" @click="newFolder">新建文件夹</el-button>
    <el-input class="search-input" v-model="searchInput" placeholder="请输入文件名搜索" @input="search">
      <template slot="append">
        <span class="el-icon-search"></span>
      </template>
    </el-input>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  name: 'fileControlComponent',

  props: [ 'fileControlAuth', 'fatherSearchInput' ],

  data: function () {
    return {
      searchInput: '', // 搜索框的输入
    }
  },

  watch: {
    fatherSearchInput: function () {
      this.searchInput = this.fatherSearchInput;
    }
  },

  methods: {

    // 搜索
    search: function () {
      this.$emit('search', { 'searchInput': this.searchInput });
    },

    // 创建文件夹
    newFolder: function () {
      let _this = this;
      this.$prompt('请输入文件夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false
      }).then(function (value) {
        _this.$emit('newFolder', { name: value.value });
      }).catch(function () {});
    }
  }
}
</script>

<style lang="scss" scoped>
.file-control-component {
  padding-left: 10px;
}

.left {
  float: left;
  margin-top: 5px;
  margin-right: 20px;
}

.search-input {
  width: 300px;
  float: left;
}
</style>
