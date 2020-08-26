<template>
  <div class="post-bar" id="postBar">
    <!-- 控制区域 -->
    <div class="control-area">
      <el-button v-if="cateAuth" class="cate-button" type="primary" plain size="small" @click="cateManage">管理分类</el-button>
      <el-button type="success" size="small" plain @click="newBbs" v-if="!cateAuth">创建新的帖子</el-button>
      <el-input class="search-input" placeholder="请输入搜索内容" v-model="searchInput">
        <template template slot="append">
          <span class="el-icon-search"></span>
        </template>
      </el-input>
    </div> 
    <!-- 表格区域 -->
    <el-table :data="tableDataShow" style="width: 100%" :height="tableHeight" border class="table-area">
      <el-table-column prop="title" label="帖子名称" align="center"></el-table-column>
      <el-table-column label="帖子分类" align="center">
        <template slot-scope="scope">
          {{ ALL_CATE_OBJ[scope.row.cat_id] }}
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="指定应答人" align="center"></el-table-column>
      <el-table-column prop="content" label="简述" align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="date" label="创建时间" align="center"></el-table-column> -->
      <!-- <el-table-column prop="update_time" label="更新时间" align="center"></el-table-column> -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 0 ? '新提交' : scope.row.status == 1 ? '管理员已反馈' : '等待管理员反馈' }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="seeBbsDetail(scope.row.id)">查看帖子</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 论坛类目对话框 -->
    <bbsCateDialog @close="closeBbsCate" v-if="bbsCateDialogShow"></bbsCateDialog>
    <newBbsDialog @submit="submitNewBbs" @close="closeNewBbsDialog" v-if="newBbsDialogShow"></newBbsDialog>
    <bbsDetailDialog @close="closeBbsDetailDialog" v-if="bbsDetailDialogShow" :bbsId="nowBbsId"></bbsDetailDialog>
  </div>
</template>

<script>
import bbsCateDialog from '../../components/newFileDetail/bbsCateDialog';
import newBbsDialog from '../../components/newFileDetail/newBbsDialog';
import bbsDetailDialog from '../../components/fileDetail/bbsDetailDialog';
export default {
  name: 'postBar',

  components: { bbsCateDialog, newBbsDialog, bbsDetailDialog },

  data: function () {
    return {
      searchInput: '', // 搜索输入
      tableData: [], // 论坛表格数据
      bbsCateDialogShow: false, // 是否显示类目对话框
      tableHeight: 0, // 表格的高度
      newBbsDialogShow: false, // 是否显示创建新的帖子
      bbsDetailDialogShow: false, // 是否显示帖子详细
      nowBbsId: '', // 当前编辑的bbsid
      ALL_CATE_OBJ: {}, // 所有的类目
    }
  },

  computed: {
    cateAuth: function () { // 管理论坛类目权限
      if (this.$store.state.USER_STATUS == 2) {
        return true;
      } else {
        return false;
      }
    },

    tableDataShow: function () { // 显示的表格数据
      if (this.searchInput == '') {
        return this.tableData;
      } else {
        let arr = this.tableData.filter(item => {
          return item.title.indexOf(this.searchInput) > -1 ||
                item.teacher.indexOf(this.searchInput) > -1 ||
                item.content.indexOf(this.searchInput) > -1;
        })
        return arr;
      }
    }
  },

  mounted: function () {
    this.getAllCate();
  },

  methods: {

    // 获取所有bbs类目
    getAllCate: function () {
      let url = this.$INTERFACE.BBS_ALL_CATE;
      this.$NORMAL_POST(url).then(this.getAllCatePromise);
    },

    // 获取所有bbs类目  请求后的处理函数
    getAllCatePromise: function (res) {
      let obj = {};
      for (let i in res.data) {
        obj[res.data[i].id] = res.data[i].path;
      }
      this.ALL_CATE_OBJ = obj;
      this.getBbsData();
    },

    // 打开分类管理框
    cateManage: function () {
      this.bbsCateDialogShow = true;
      this.$store.commit('changeNowDialog', 'bbsCateDialog');
    },

    // 关闭bbs类目对话框
    closeBbsCate: function () {
      this.bbsCateDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 获取所有的bbs
    getBbsData: function () {
      let url = this.$INTERFACE.ALL_BBS;
      this.$NORMAL_POST(url).then(this.getBbsDataPromise);
    },

    // 获取所有的bbs  请求后的处理函数
    getBbsDataPromise: function (res) {
      for (let i in res.data) {
        res.data[i].content = this.$PUBILC.html_decode(res.data[i].content);
      }
      this.tableData = res.data;
      let func = this.$PUBILC.setTableHeight('postBar', this, 130);
      func();
    },

    // 创建新的帖子
    newBbs: function () {
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' }),
      this.newBbsDialogShow = true;
      this.$store.commit('changeNowDialog', 'newBbsDialog');
    },

    // 关闭创建新的帖子
    closeNewBbsDialog: function () {
      this.newBbsDialogShow = false;
      this.$store.commit('changeNowDialog', '');
    },

    // 提交帖子
    submitNewBbs: function (data) {
      let url = this.$INTERFACE.new_BBS;
      this.$NORMAL_POST(url, data).then(this.submitNewBbsPromise);
    },

    // 提交帖子  请求后的处理函数
    submitNewBbsPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.closeNewBbsDialog();
      this.getBbsData();
    },

    // 查看帖子详细内容
    seeBbsDetail: function (id) {
      this.nowBbsId = id;
      this.bbsDetailDialogShow = true;
      this.$store.commit('changeNowDialog', 'bbsDetailDialog');
    },

    // 关闭bbs详细对话框
    closeBbsDetailDialog: function () {
      this.bbsDetailDialogShow = false;
      this.$store.commit('changeNowDialog', 'bbsDetailDialog');
    }
    
  }
}
</script>

<style lang="scss" scoped>
.post-bar {
  padding: 20px 40px;
}

.search-input {
  width: 30%;
  margin-left: 20px;
}

.table-area {
  box-shadow: 0 0 1px lightgray;
  margin-top: 10px;
}
</style>