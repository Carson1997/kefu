<!-- 文件排行设置 -->
<template>
  <div class="file-arrange" id="fileArrange">
    <div class="file-arrange-name">文件排行</div>
    <div class="file-arrange-body">
      <div class="each-arrange" v-for="(item, index) in functionData" :key="index" @click="changeFunc(item.order)">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileArrange',

  data: function () {
    return {
      functionData: [
        { order: 'topping', name: '置顶文件' },
        { order: 'week_click', name: '周热点文件' },
        { order: 'month_click', name: '月热点文件' },
        { order: 'total_click', name: '总共点击数' },
      ]
    }
  },

  methods: {

    // 点击切换功能点
    changeFunc: function (order) {
      this.$emit('fileArrange', order);
    }
  }
}
</script>

<style lang="scss" scoped>
.file-arrange {
  width: 100px;
  background: white;
}

.file-arrange-name {
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 30px;
  color: #409EFF;
  background: #ecf5ff;
  border: solid 1px #b3d8ff;
  cursor: pointer;
  box-shadow: 0 0 1px #808080;
  border-radius: 5px;
}

.file-arrange:hover .file-arrange-body {
  display: block;
}

.file-arrange-body {
  display: none;
  width: 100%;
  font-size: 13px;
  text-align: center;
  line-height: 25px;
  border: solid 1px #b3d1eb;
  box-shadow: 0 0 1px #349cf6;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.each-arrange {
  cursor: pointer;
  border-bottom: solid 1px #f5f5f5;
  color: #555555;
  transition: all .5s;
}

.each-arrange:hover {
  color: #f3f3f3;
  background: #53afff;
}
</style>