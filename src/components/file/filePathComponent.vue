<!-- 文件路径展示组件 -->
<template>
  <div class="file-path-component">
    <span class="name">当前路径为: </span>
    <span v-for="(item, index) in filePathData" :key="index" class="each">
      <span class="each-filename" @click="switchFolder(index)">{{ item }}</span>
      <span class="next-icon" v-if="index + 1 < filePathData.length">></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'filePathComponent',

  props: [ 'filePathData' ],

  methods: {

    // 切换文件夹
    switchFolder: function (index) {
      let path = JSON.parse(JSON.stringify(this.filePathData));
      path = path.splice(0, index + 1);
      this.$emit('switchFolder', { operation: 'pre', path: path });
    }
  }
}
</script>

<style lang="scss" scoped>
.file-path-component {
  font-size: 14px;
  color: #666;
  padding-left: 10px;;
}

.file-path-component .name {
  margin-right: 5px;
}

.each-filename {
  color: #424e67;
  cursor: pointer;
}

.each-filename:hover {
  border-bottom: solid 1px #09aaff;
  color: #09aaff;
}

.next-icon {
  margin: 0 5px;
}
</style>