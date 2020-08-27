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