<!-- 新建知识库文章对话框 -->
<template>
  <el-dialog title="编辑知识库文章" :visible="dialogVisible" width="50%" top="8vh" :before-close="handleClose" :close-on-click-modal="false">
    <div class="input-area">
      <div class="each-input">
        <span class="name">文章名称: </span>
        <el-input v-model="noticeContent.title" placeholder="请输入文章名称" class="value"></el-input>
        <div class="clear"></div>
      </div>

      <div class="each-input">
        <span class="name">文章关键字: </span>
        <el-input v-model="noticeContent.keyword" placeholder="请输入文章关键字" class="value"></el-input>
        <div class="clear"></div>
      </div>

      <div class="each-input">
        <span class="name">是否置顶: </span>
        <el-select class="value" v-model="noticeContent.top" placeholder="请选择是否置顶">
          <el-option v-for="item in topingOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>

      <div class="each-input">
        <span class="name">文章类型: </span>
        <el-select class="value" v-model="noticeContent.file_type" placeholder="请选择文章类型">
          <el-option v-for="item in fileOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="clear"></div>
      </div>

      <div class="each-input" v-if="noticeContent.file_type == 0">
        <span class="name">文章内容: </span>
        <div class="value">
          <editor></editor>
        </div>
        <div class="clear"></div>
      </div>

      <div class="each-input" v-if="noticeContent.file_type == 1">
        <span class="name">选择文件: </span>
        <div class="value uploadController">
          <uploadController @uploadSuccess="uploadSuccess" @uploadChange="uploadChange"></uploadController>
          <span class="file_url">{{ noticeContent.file_url }}</span>
        </div>
        <div class="clear"></div>
      </div>
      <el-button type="primary" size="small" class="center" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editor from '../../components/editor/editor';
import uploadController from '../../components/upload/uploadController';
export default {
  name: 'newNoticeDetail',

  components: { uploadController, editor },

  data: function () {
    return {
      fileOptions: [ // 文章类型选项
        { id: 0, name: '普通文章' },
        { id: 1, name: '可预览性文章' },
      ],
      topingOptions: [ // 置顶类型
        { id: '0', name: '不置顶' },
        { id: '1', name: '置顶' },
      ]
    }
  },

  props: [ 'noticeContent' ],

  computed: {
    dialogVisible: function () { // 显示框显示控制
      if (this.$store.state.NOW_OPEN_DIALOG == 'newNoticeDetail') {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted: function () {
    setTimeout(() => {
      let modal = document.getElementsByClassName('v-modal')[0];
      modal.style.zIndex = 1000;
      let wrapper = document.getElementsByClassName('el-dialog__wrapper')[0];
      wrapper.style.zIndex = 1001;
    }, 500);
  },

  methods: {

    // 关闭对话框
    handleClose: function () {
      this.$store.commit('changeNowDialog', '');
      this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: '' });
    },

    // 文件上传变更
    uploadChange: function () {
      this.noticeContent['file_url'] = ''
    },

    // 文件上传成功  -- 进行绑定
    uploadSuccess: function (data) {
      this.noticeContent.file_url = data.data;
    },

    // 提交文章
    submit: function () {
      let legitimacy = this.checkLegitimacy();
      if (legitimacy != false) {
        this.$emit('editContent', legitimacy);
      }
    },

    // 检测输入的合法性
    checkLegitimacy: function () {
      let content = this.$store.state.EDIT_CONTENT;
      let send = { fid: this.noticeContent.fid, id: this.noticeContent.id };
      if (this.noticeContent.title == '') {
        this.$PUBILC.alert(this, '请输入文章名称');
        return false;
      }
      send['title'] = this.noticeContent.title;
      if (this.noticeContent.keyword == '') {
        this.$PUBILC.alert(this, '请输入文章关键字');
        return false;
      }
      send['keyword'] = this.noticeContent.keyword;
      if (this.noticeContent.top === '') {
        this.$PUBILC.alert(this, '请选择是否置顶');
        return false;
      }
      send['top'] = this.noticeContent.top;
      if((this.noticeContent.file_type == 0 && content == '') || (this.noticeContent.file_type == 1 && this.noticeContent.file_url == '')) {
        this.$PUBILC.alert(this, '请输入文章内容或者选择文件');
        return false;
      }
      this.noticeContent.file_type == 0 ? send['content'] = content : send['file_url'] = this.noticeContent.file_url;
      return send;
    }
    
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  border-top: solid 1px lightgray;
  padding: 10px;
  padding-bottom: 20px;
}

.input-area .each-input {
  width: 80%;
  margin: 25px auto;
}

.input-area .each-input .name {
  width: 100px;
  float: left;
  line-height: 40px;
}

.input-area .each-input .value {
  width: calc(100% - 100px);
  float: left;
}
.uploadController {
  line-height: 40px;
}

.center {
  display: block;
  margin: 0 auto;
}

.file_url {
  margin-left: 20px;
}
</style>