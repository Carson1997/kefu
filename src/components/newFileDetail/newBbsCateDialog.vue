<template>
  <el-dialog title="添加论坛类目" append-to-body :visible="dialogVisible" width="40%" top="8vh" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">所属群组:</span>
        <el-select class="value" v-model="groupValue" placeholder="请选择">
          <el-option v-for="(item, index) in groupOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input">
        <span class="name">所属父级类目:</span>
        <el-select class="value" v-model="fatherCate" placeholder="请选择">
          <el-option v-for="(item, index) in showCateOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="each-input">
        <span class="name">类目名:</span>
        <el-input class="value" v-model="cateName" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" plain size="mini" class="center" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newBbsCateDialog',

  props: [ 'cateOptions', 'groupOptions', 'baseData' ],

  computed: {
    dialogVisible: function () {
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'newBbsCateDialog') {
        return true;
      } else {
        return false;
      }
    },

    showCateOptions: function () { // 展示的父级分类
      this.fatherCate = '';
      let arr = this.cateOptions.filter(item => {
        return item.group_id == this.groupValue;
      })
      arr.unshift({ id: '0', name: '无父级' });
      return arr;
    },
  },

  data: function () {
    return {
      cateId: '', // 类目ID
      cateName: '', // 类目名
      fatherCate: '', // 所属父级类目
      groupValue: '', // 所属群组
    }
  },

  mounted: function () {
    this.init();
  },

  methods: {

    // 初始化
    init: function () {
      if (Object.keys(this.baseData).length != 0) {
        this.cateId = this.baseData.id;
        this.cateName = this.baseData.name;
        this.groupValue = this.baseData.group_id;
        this.fatherCate = this.baseData.fid;
      }
    },
    
    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 提交
    submit: function () {
      if (this.groupValue === '') {
        this.$PUBILC.alert(this, '请选择所属群组');
        return false;
      }
      if (this.fatherCate === '') {
        this.$PUBILC.alert(this, '请选择父级类目');
        return false;
      }
      if (this.cateName == '') {
        this.$PUBILC.alert(this, '请输入类目名');
        return false;
      }
      let arr = this.cateOptions.filter(item => {
        return item.id == this.fatherCate;
      })
      let path = arr[0].id == '0' ? this.cateName : arr[0].path + '/' + this.cateName;
      this.$emit('submit', { id: this.cateId, name: this.cateName, fid: this.fatherCate, group_id: this.groupValue, path: path });
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #eeeeee;
  padding: 20px;
}

.each-input {
  width: 100%;
  margin-bottom: 10px;
}

.each-input .name {
  display: block;
  padding: 5px 10px;
}

.each-input .value {
  width: 100%;
}

.center {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}
</style>