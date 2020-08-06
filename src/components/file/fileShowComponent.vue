<!-- 文件夹展示组件 -->
<template>
  <div class="file-show-component">
    <div class="each-file" v-for="item in fileData" :key="item.id">

      <!-- 文件行左侧 -->
      <div class="each-file-left">
        <!-- 文件类型指示 -->
        <div class="file-category">
          <img src="../../../public/img/folder.png" alt="">
        </div>
        <!-- 文件名 -->
        <span class="file-name">{{ item.name }}</span>
      </div>

      <!-- 文件行中间 -->
      <div class="each-file-middle">
       <span>{{ item.father }}</span>
      </div>

      <!-- 文件行右侧 -->
      <div class="each-file-right">
        <el-button type="text" class="delete-button">删除</el-button>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileShowComponent',

  props: [ 'fileData' ],
}
</script>

<style lang="scss" scoped>
.each-file {
  width: 100%;
  color: #666;
  border-bottom: solid .3px #f2f6fd;
  padding: 0 40px;
  line-height: 44px;
  border-left: none;
  border-right: none;
}

.each-file:hover {
  background: #f4fbff;
  border-top: solid .3px #f2f6fd;
  border-color: #d9ebfd;;
}

.each-file .each-file-left {
  width: 30%;
  float: left;
}

.each-file  .each-file-middle {
  width: 30%;
  float: left;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
}

.each-file  .each-file-middle span {
  border-bottom: solid .5px rgb(216, 216, 216);
}

.each-file  .each-file-middle span:hover {
  color: #09aaff;
}

.each-file .each-file-left .file-category {
  width: 25px;
  height: 44px;
  display: flex;
  align-items: center;
  float: left;
}

.each-file .each-file-left .file-category img {
  width: 100%;
}

.each-file .each-file-left .file-name {
  color: #424e67;
  cursor: pointer;
  font-size: 13px;
  margin-left: 15px;
}

.each-file .each-file-left .file-name:hover {
  color: #09aaff;
}

.each-file-right {
  width: 30%;
  float: right;
  text-align: right;
}

.delete-button {
  font-size: 13px;
}

</style>