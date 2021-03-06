<template>
  <div id="notice">
    <div class="notice-detail">
      <fileFolderComponent :isFileArrange="true" @seeFile="seeNotice" :fileAuth="fileAuth" class="notice-folder" @exposeToBusiness="exposeToBusiness" :fileData="fileData"></fileFolderComponent>
    </div>
    <newNoticeDetail @editContent="editContent" :noticeContent="noticeContent"></newNoticeDetail>
    <noticeDetail @close="closeDetail" v-if="noticeDataShow" :noticeDataDetail="noticeDataDetail"></noticeDetail>
    <sourceDetail @close="closeDetail" v-if="sourceDataShow" :previewData="sourceData"></sourceDetail>
  </div>
</template>

<script>
import fileFolderComponent from '../../components/file/fileFolderComponent';
import newNoticeDetail from '../../components/newFileDetail/newNoticeDetail';
import noticeDetail from '../../components/fileDetail/noticeDetail';
import sourceDetail from '../../components/fileDetail/sourceDetail';
export default {
  name: 'notice',

  components: { fileFolderComponent, newNoticeDetail, noticeDetail, sourceDetail },

  data: function() {
    return {
      fileData: [], // 文件夹的数据
      fileAllData: [], // 所有的文件夹数据
      noticeContent: {}, // 文章内容
      noticeDataDetail: {}, // 查看的文章详细内容
      noticeDataShow: false, // 是否显示文章对话框
      sourceData: '', // 多媒体素材文件
      sourceDataShow: false, // 是否显示素材文件对话框
    }
  },

  mounted: function () {
    this.getNoticeDetailData();
  },

  computed: {
    fileAuth: function () { // 文件夹操作权限
      return this.$store.state.USER_STATUS == '2';
    }
  },

  methods: {

    // 获取知识库数据
    getNoticeDetailData: function () {
      this.$NORMAL_POST(this.$INTERFACE.ALL_CATEGORY).then(this.getNoticeDetailDataPromise);
    },

    // 获取知识库数据  请求后的处理函数
    getNoticeDetailDataPromise: function (res) {
      for (let i in res.data) {
        res.data[i].showId = this.completeId(res.data[i].id);
      }
      this.fileData = res.data;
      this.fileAllData = res.data;
    },

    // 补全id
    completeId: function (id) {
      let showId = '';
      if (id.length < 5) {
        for (let i = 0; i < 5 - id.length; i++) {
          showId = showId + '0';
        }
        showId = showId + id;
      }
      return showId;
    },

    // 组件暴露到业务层的方法
    exposeToBusiness: function (data) {
      let order = data.order;
      let send = data.data;
      if (order == 'new_file') {
        this.newNotice(send);
      } else if (order == 'delete_file') {
        this.deleteNotice(send);
      } else if (order == 'new_folder') {
        this.newNoticeFolder(send);
      } else if (order == 'edit_file') {
        this.editFile(send);
      }
    },

    // 新建知识库文件
    newNotice: function (send) {
      send['file_type'] = 1;
      this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.newNoticeHandle);
    },

    // 新建知识库文件夹
    newNoticeFolder: function (send) {
      send['type'] = 1;
      this.$NORMAL_POST(this.$INTERFACE.NEW_CATEGORY, send).then(this.newNoticeFolderPromise);
    },

    // 新建知识库文件夹  请求后的处理函数
    newNoticeFolderPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getNoticeDetailData();
    },
    
    // 编辑后的处理函数
    newNoticeHandle: function (res) {
      let obj = { fid: res.data.id, title: res.data.name, keyword: '', file_url: '', file_type: 0, top: '0' };
      this.noticeContent = obj;
      this.$message({ type: 'success', message: res.info });
      this.getNoticeDetailData();
      this.$store.commit('changeNowDialog', 'newNoticeDetail');
    },

    // 编辑知识库文章
    editContent: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.EDIT_CATEGORY_DETAIL, send).then(this.editContentPromise);
    },

    // 编辑知识库文章  请求后的处理函数
    editContentPromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.$store.commit('changeNowDialog', '');
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' });
      this.getNoticeDetailData();
    },

    // 删除知识库文章
    deleteNotice: function (send) {
      this.$NORMAL_POST(this.$INTERFACE.DELETE_CATEGORY, send).then(this.deleteNoticePromise);
    },

    // 删除知识库文章  请求后的处理函数
    deleteNoticePromise: function (res) {
      this.$message({ type: 'success', message: res.info });
      this.getNoticeDetailData();
    },

    // 查看知识库文章详细
    seeNotice: function (data) {
      this.$NORMAL_POST(this.$INTERFACE.CATEGORY_DETAIL, data).then(this.seeNoticePromise);
    },

    // 查看知识库文章详细  请求后的处理函数
    seeNoticePromise: function (res) {
      if (res.data.content != '') {
        this.noticeDataShow = true;
        this.$store.commit('changeNowDialog', 'noticeDetail');
        res.data.showId = this.completeId(res.data.id);
        this.noticeDataDetail = res.data;
      } else if (res.data.file_url != '') {
        this.$store.commit('changeNowDialog', 'sourceDetail');
        this.sourceData = res.data.file_url;
        this.sourceDataShow = true;
      }
    },

    // 关闭对话框
    closeDetail: function () {
      this.$store.commit('changeNowDialog', '');
      this.noticeDataShow = false;
      this.sourceDataShow = false;
      this.noticeDataDetail = {};
      this.sourceData = '';
    },

    // 编辑文件
    editFile: function (data) {
      this.$NORMAL_POST(this.$INTERFACE.CATEGORY_DETAIL, { fid: data.id, name: data.name }, 0, [ 'fid', 'name' ]).then(this.editFilePromise);
    },

    // 编辑文件  请求后的处理函数
    editFilePromise: function (res) {
      let obj = { 
        fid: res.needToRes.fid, 
        id: res.data.id, 
        title: res.data.title == undefined ? '' : res.data.title, 
        keyword: res.data.keyword == undefined ? '' : res.data.keyword, 
        file_url: res.data.file_url == undefined ? '' : res.data.file_url, 
        file_type: 1, 
        top: res.data.top == undefined ? '0' : res.data.top 
      };
      res.data.content = res.data.content == undefined ? '' : res.data.content; 
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: this.$PUBILC.html_decode(res.data.content) });
      if (res.data.file_url == '' || res.data.file_url == undefined) {
        obj.file_type = 0;
      }
      this.noticeContent = obj;
      this.$store.commit('changeNowDialog', 'newNoticeDetail');
    },
  }
}

</script>

<style lang="scss" scoped>
.new-message {
  padding-top: 20px;
  padding-left: 40px;
}

.notice-detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 40px;
  position: relative;
}

.notice-folder {
  width: 100%;
  height: 100%;
}

.file-arrange {
  position: absolute;
  top: 25px;
  right: 50px;
  z-index: 100;
}
</style>