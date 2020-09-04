<!-- 重要提示 -->
<template>
  <el-dialog title="重要提示" :visible="dialogVisible" width="50%" :show-close="false" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="see-area">
      <p class="head">使用声明</p>
      <p class="left-fir">  1、前言</p>
      <p class="left-sec">  1）小冰火人客服支撑系统为广东小冰火人网络科技股份有限公司的官方客服支撑系统，本系统内容仅供小冰火人内部使用，所有使用本系统的员工应仔细阅读本系统的使用规定。一旦使用本系统，包括但不限于浏览信息、下载内容、使用系统提供的第三方系统链接等，即视为员工已了解并完全同意本声明中的所有规定，愿意承担使用本系统的全部风险和法律责任。</p>
      <p class="left-sec">  2） 本声明的内容可能会不时更改，员工应在使系统时及时关注，系统不承担通知义务。</p>
      
      <p class="left-fir">2、使用注意事项</p>
      <p class="left-sec">  1）使用该系统不得直接截图或复制内容发送给他人，如需截图必须用马赛克遮住以下敏感信息（姓名，电话，性别，住址，公司名字，LOG）如截取的内容泄露了相关信息导致被投诉或触犯相关法律法规，将由个人承担。</p>
      <p class="left-sec">  2) 每个人都有固定的账号登陆，在未经许可的情况下，不得把账号密码泄露于其他人使用，一经发现将会冻结账号 和扣罚。严重者除承担账号泄露带来的风险责任以外，还会扣除当月工资并勒令辞退。</p>
      <p class="left-sec">  3）所有管理账号，不得随意篡改系统内容，所有内容的编辑和修改都必须经过系统管理人员的审核通过后才能发布。</p>
    </div>
    <div class="center">
      <el-button type="primary" size="mini" plain @click="confrim">确定</el-button>
      <el-button type="warning" size="mini" plain @click="logout">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'importantPrompt',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == 'importantPrompt') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {

    // 关闭对话框
    handleClose: function () {},

    // 确定
    confrim: function () {
      let url = this.$INTERFACE.IMPORTANT_RULES;
      let send = { prompt: 1 };
      this.$NORMAL_POST(url, send).then(this.confrimPromise);
    },

    // 确定  请求后的处理函数
    confrimPromise: function () {
      sessionStorage.prompt = JSON.stringify('1'); // 是否已经查看过重要通知
      this.$store.commit('changeNormalValue', { name: 'PROMPT', value: 1 }); // 是否已经查看过重要通知
      this.$emit('confrim');
    },

    // 取消退出登录
    logout: function () {
      this.$emit('logout');
    },
  }

}
</script>

<style lang="scss" scoped>
.see-area {
  padding: 20px;
  border-top: solid 1px #f3f3f3;
}

.center {
  width: 100%;
  border-top: solid 1px #f3f3f3;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.head {
  font-weight: 600;
}

.left-fir {
  padding-left: 15px;
  font-weight: 500;
}

.left-sec {
  padding-left: 30px;
  padding-top: 5px;
}
</style>