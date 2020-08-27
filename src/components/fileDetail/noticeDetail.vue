<template>
  <el-dialog title="文章详情" :visible="dialogVisible" width="98%" top="3vh" :before-close="handleClose" :close-on-click-modal="false">
    <div class="detail-area" v-bind:style="{ height: detailHeight + 'px' }">
      <h2 class="detail-title">{{ noticeDataDetail.title }}</h2>
      <div class="keyword">
        <span>关键词: </span>
        <span>{{ noticeDataDetail.keyword }}</span>
      </div>
      <div class="detail-message">
        <span class="">{{ noticeDataDetail.author }}: </span>
        <span span class="detail-time">{{ noticeDataDetail.update_time }}</span>
      </div>
      <div class="clear"></div>
      <div class="detail-content" v-html="detailContent"></div>

    </div>  
  </el-dialog>
</template>

<script>
export default {
  name: 'noticeDetail',

  computed: {
    dialogVisible: function () { // 对话框是否显示
      if (this.$store.state.NOW_OPEN_DIALOG == 'noticeDetail') {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'noticeDataDetail' ],

  data: function () {
    return {
      detailHeight: document.body.clientHeight - 140,
      detailContent: '', // 文章内容
    }
  },

  mounted: function () {
    this.detailContent = this.$PUBILC.html_decode(this.noticeDataDetail.content);
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    }
  },
}
</script>

<style lang="scss" scoped>
.detail-area {
  border-top: solid 1px #e9e9e9;
  font-size: 16px;
  padding: 10px;
}

.detail-title {
  text-align: center;
  color: #333333;
}

.keyword {
  float: left;
  margin-left: 20px;
}

.detail-message {
  text-align: right;
  padding-right: 20px;
}

.detail-content {
  width: 98%;
  height: calc(100% - 90px);
  background: white;
  margin: 15px auto;
  background: white;
  border: solid 1px #f0f0f0;
  box-shadow: 0 0 1px #c2c2c2;
  padding: 10px;
}

</style>