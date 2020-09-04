<!-- 添加表头对话框 -->
<template>
  <el-dialog title="修改产品属性" append-to-body top="5vh" :visible="dialogVisible" width="40%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area" :style="{ 'max-height': areaHeight + 'px' }">
      <div class="each-input" v-for="(item, index) in seeHeadData" :key="index">
        <span class="name">{{ item.name + ' :' }}</span>
        <el-input class="value" v-model="item.value" placeholder="请输入属性名称"></el-input>
        <el-button type="warning" class="controlButton" plain size="mini" @click="deleteIndex(index)">删除</el-button>
        <div class="clear"></div>
      </div>
    </div>
    <div class="button-area">
      <el-button type="primary" size="small" plain @click="addIndex">添加属性列</el-button>
      <el-button type="success" size="small" plain @click="submit">提交更改</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'productCatDetail',

  props: ['headData', 'headIndex'],

  computed: {

    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'productCatDetail') {
        return true;
      } else {
        return false;
      }
    },

    seeHeadData: function () { // 看到的头部数据
      let arr = [];
      for (let i = 0; i <= this.headIndex; i++) {
        if (this.headData[i]['value'] != null) {
          arr.push(this.headData[i]);
        }
      }
      return arr;
    }
  },

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 250, // 对话框高度
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close', 'productCatDetail');
    },

    // 添加属性列
    addIndex: function () {
      if (this.headIndex + 1 < this.headData.length) {
        this.$emit('fromEditTableHead', { order: 'addIndex' });
      }
    },

    // 删除属性列
    deleteIndex: function (index) {
      if (this.seeHeadData.length > 1) {
        this.$emit('fromEditTableHead', { order: 'subIndex', value: index });
      }
    },

    // 提交修改
    submit: function () {
      this.$emit('fromEditTableHead', { order: 'submit' });
    }

  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #f1f1f1;
  padding-bottom: 10px;
  overflow: auto;
}

.each-input {
  width: 90%;
  margin: 20px auto;
}

.each-input .name {
  width: 50px;
  float: left;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}

.each-input .value {
  width: calc(90% - 50px);
  float: left;
}

.each-input .controlButton {
  margin-left: 10px;
  margin-top: 5px;
}

.button-area {
  width: 100%;
  border-top: solid 1px #f3f3f3;
  padding-bottom: 10px;
  padding-top: 10px;
  text-align: center;
}
</style>
