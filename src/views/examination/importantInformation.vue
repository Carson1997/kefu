<!-- 编辑重要信息提示 -->
<template>
  <div class="important-information" id="importantInformation">
    <div class="control-area"> <!-- 控制区域 -->
      <el-button type="primary" plain size="small" @click="newImformationDialog">创建通知</el-button>
      <el-input class="search-input" v-model="searchInput" placeholder="请输入通知名称搜索">
        <template slot="append"><span class="el-icon-search"></span></template>
      </el-input>
    </div>
    <div class="all-information">
      <div class="all-information-head">
        <span>所有重要信息</span>
      </div>
      <div class="all-information-body" v-if="informationShow.length > 0">
        <div class="each-information" v-for="(item, index) in informationShow" :key="index">
          <div class="each-information-head">
            <h2 class="each-information-title">{{ item.name }}</h2>
            <el-button type="primary" plain size="mini" class="delete-button" @click="seenImformation(item)">查看已阅成员</el-button>
            <el-button type="warning" plain size="mini" class="delete-button" @click="delImformation(item)">删除</el-button>
            <div class="clear"></div>
          </div>
          <p class="each-information-content" v-html="item.content"></p>
        </div>
      </div>
      <div class="no-information" v-else>
        <div class="no-file-intro">
          <img src="../../../public/img/no_file.png" alt="">
          <p>不存在重要通知!</p>
        </div>
      </div>
    </div>
    <newImformationDialog @close="closeNewImformationDialog" :imformationData="imformationData" v-if="newImformationDialogShow" @submit="submitImformation"></newImformationDialog>
    <seenImformations v-if="seenImformationShow" :tableData="seenImformationData" @close="closeSeenImformationData"></seenImformations>
  </div>
</template>

<script>
import newImformationDialog from '../../components/newFileDetail/newImformationDialog';
import seenImformations from '../../components/fileDetail/seenImformations';
export default {
  name: 'importantInformation',

  components: { newImformationDialog, seenImformations },

  data: function () {
    return {
      information: [], // 信息
      newImformationDialogShow: false, // 是否显示创建重要通知对话框
      imformationData: {}, // 当前编辑的重要通知
      searchInput: '', // 搜索内容
      seenImformationShow: false, // 是否显已阅人
      seenImformationData: [], // 已阅读人的数据
    }
  },

  computed: {
    informationShow: function () { // 显示的通知
      if (this.searchInput == '') {
        return this.information;
      } else {
        let arr = this.information.filter(item => {
          return item.name.indexOf(this.searchInput) > -1;
        })
        return arr;
      }
    }
  },

  mounted: function () {
    this.getData();
  },

  methods: {

    // 显示创建重要通知对话框
    newImformationDialog: function (data) {
      this.imformationData = data;
      this.newImformationDialogShow = true;
      this.$store.commit('changeNowDialog', 'newImformationDialog');
    },

    // 关闭创建重要通知对话框
    closeNewImformationDialog: function () {
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' });
      this.newImformationDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 获取所有的重要通知
    getData: function () {
      let url = this.$INTERFACE.ALL_IMPORTANT_NEWS;
      this.$NORMAL_POST(url).then(this.getDataPromise);
    },

    // 获取所有的重要通知  请求后的处理函数
    getDataPromise: function (res) {
      for (let i in res.data) {
        res.data[i].content = this.$PUBILC.html_decode(res.data[i].content);
      }
      this.information = res.data;
    },

    // 删除通知
    delImformation: function (data) {
      let _this = this;
      let name = '将永久删除' + data.name + ', 是否继续 ?';
      this.$confirm(name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        let url = _this.$INTERFACE.DEL_IMPORTANT_NEWS;
        let send = { id: data.id };
        _this.$NORMAL_POST(url, send).then(_this.delImformationPromise);
      }).catch();
    },

    // 删除通知  请求后的处理函数
    delImformationPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getData();
    },

    // 提交重要通知
    submitImformation: function (data) {
      let url = this.$INTERFACE.ADD_IMPORTANT_NEWS;
      this.$NORMAL_POST(url, data).then(this.submitImformationPromise);
    },

    // 提交重要通知  请求后的处理函数
    submitImformationPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.closeNewImformationDialog();
      this.getData();
    },

    // 查看已阅通知的成员
    seenImformation: function (data) {
      let url = this.$INTERFACE.SEEN_IMPORTANT_NEWS;
      let send = { id: data.id };
      this.$NORMAL_POST(url, send).then(this.seenImformationPromise);
    },

    // 查看已阅通知的成员  请求后的处理函数
    seenImformationPromise: function (res) {
      this.seenImformationShow = true;
      this.$store.commit('changeNowDialog', 'seenImformations');
      this.seenImformationData = res.data;
    },

    // 关闭查看已阅通知的成员
    closeSeenImformationData: function () {
      this.seenImformationShow = false;
      this.$store.commit('changeNowDialog', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.all-information {
  width: 100%;
  height: calc(100% - 55px);
  background: white;
  box-shadow: 0 0 1px #8f8f8f;
  margin-top: 15px;
  border-radius: 3px;
  position: relative;
}

.all-information-head {
  font-size: 15px;
  letter-spacing: .5px;
  line-height: 40px;
  padding-left: 15px;
  color: #666;
  border-bottom: solid 1px #e7e7e7;
}

.all-information-body {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

.no-information {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-file-intro p {
  padding: 20px;
  color: #727272;
}

.each-information {
  padding: 15px;
  border-bottom: solid 1px rgb(236, 236, 236);
}

.each-information-head {
  width: 100%;
}

.each-information-title {
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
  width: calc(100% - 200px);
  float: left;
}

.each-information-content {
  padding-left: 15px;
  color: #666;
  width: 100%;
  font-size: 14px;
}

.search-input {
  width: 300px;
  margin-left: 20px;
}
</style>