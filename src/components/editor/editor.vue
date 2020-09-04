<template>
  <div class="editor">
    <vueUeditorWrap v-model="editorContent" :config="editorConfig"></vueUeditorWrap>
  </div>
</template>

<script>
import vueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'editor',

  components: {
    vueUeditorWrap
  },

  computed: {
    editorContent: { // 输入框的内容
      get: function () {
        return this.$store.state.EDIT_CONTENT;
      },
      set: function (value) {
        this.$store.commit('changeNormalValue', { name: 'EDIT_CONTENT', value: value });
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

  data: function () {
    return {
      editorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 240,
        initialFrameWidth: '100%',
        UEDITOR_HOME_URL: '/customer_service_support/UEditor/' // /customer_service_support/UEditor/
      }
    }
  }

}
</script>