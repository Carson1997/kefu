<!-- 新增帖子回答 -->
<template>
  <el-dialog :title="quote == '' ? '追加提问' : '回答问题'" top="8vh" append-to-body :visible="dialogVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">引用的内容: </span>
        <el-select class="value" v-model="quoteValue" placeholder="请选择">
          <el-option v-for="(item, index) in quote" :key="index" :label="index + 1 + '楼: ' + item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>
      <div class="each-input">
        <span class="name">内容: </span>
        <editor class="value"></editor>
        <div class="clear"></div>
      </div>
      <el-button type="primary" plain size="small" class="button" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editor from '../../components/editor/editor';
export default {
  name: 'newBbsContent',

  components: { editor },

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_SEC_DIALOG == 'newBbsContent') {
        return true;
      } else {
        return false;
      }
    },
  },

  data: function () {
    return {
      quoteValue: '',
    }
  },

  props: [ 'quote' ],

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' });
      this.$emit('close');
    },

    // 提交
    submit: function () {
      if (this.quoteValue == '') {
        this.$PUBILC.alert(this, '请选择引用的内容!');
        return false;
      }
      if (this.$store.state.EDIT_CONTENT == '') {
        this.$PUBILC.alert(this, '请输入内容!');
        return false;
      }
      let arr = this.quote.filter(item => {
        return item.id == this.quoteValue;
      })
      this.$emit('submit', { superior_id: arr[0].id, content: this.$store.state.EDIT_CONTENT });
    },
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px #e2e2e2;
  position: relative;
  padding: 0 20px 20px 20px;
}

.each-input {
  width: 90%;
  margin-top: 20px;
  padding-bottom: 15px;
}

.each-input .name {
  width: 100px;
  line-height: 40px;
  float: left;
  display: block;
  text-align: center;
}

.each-input .value {
  width: calc(100% - 120px);
  margin-left: 15px;
  float: left;
}

.quote {
  background: #ebebeb;
}

.button {
  display: block;
  margin: 0 auto;
}
</style>