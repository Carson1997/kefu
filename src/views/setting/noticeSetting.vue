<template>
  <div id="noticeSetting">
    <fileShowComponent :fileData="showFileData"></fileShowComponent>
  </div>
</template>

<script>
import fileShowComponent from '../../components/file/fileShowComponent';
export default {
  name: 'noticeSetting',

  components: { fileShowComponent },

  data: function () {
    return {
      showFileData: [
        { id: 1, name: '文件夹1', father: '全部目录' },
        { id: 2, name: '文件夹2', father: '全部目录' },
        { id: 3, name: '文件夹3', father: '全部目录' },
        { id: 4, name: '文件夹4', father: '全部目录' },
        { id: 5, name: '文件夹5', father: '全部目录' },
      ], // 展示的文件数据

    }
  },

  mounted: function () {

  },

  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: block;
  width: 400px;
  margin-top: 20px;
}
</style>