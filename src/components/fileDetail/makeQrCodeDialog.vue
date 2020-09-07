<!-- 生成二维码对话框 -->
<template>
  <el-dialog title="提示" :visible="dialogVisible" width="40%" :before-close="handleClose">
    <div class="code-area">
      <div class="qrcode" ref="qrCodeUrl"></div>
    </div>
  </el-dialog>
</template>

<script>
import QRCode from 'qrcodejs2';
export default {
  name: 'makeQrCodeDialog',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'makeQrCodeDialog') {
        return true;
      } else {
        return false;
      }
    }
  },

  props: [ 'examId' ],

  mounted: function () {
    this.makeCode();
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 生成二维码
    makeCode: function () {
      let _this = this;
      let address = 'http://219.128.102.76:808/customer_service_support_phone?examId=' + this.examId;
      console.log(address)
      setTimeout(() => {
        var qrcode = new QRCode(_this.$refs.qrCodeUrl, {
          text: address,
          width: 300,
          height: 300,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      }, 0);
      
    }
  }
}
</script>

<style lang="scss" scoped>
.code-area {
  width: 100%;
  height: 400px;
  padding: 20px;
  border-top: solid 1px #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode {
  width: 300px;
  height: 300px;
  background-color: #fff;
  padding: 6px;
  box-sizing: border-box;
}
</style>
