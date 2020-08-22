<template>
  <div class="train" id="train">
    <div class="module-head">
      <div class="each-module-head" v-for="(item, index) in moduleFunctions" :key="index" @click="changeFunction(item.url)" v-bind:class="{'active': item.url == nowFunction}"> {{ item.name }} </div>
    </div>
    <router-view class="module-detail"></router-view>
  </div>
</template>

<script>
export default {
  name: 'train',

  data: function () {
    return {
      moduleFunctions: [ // 所有功能
        { url: 'myTrain', name: '我的培训' },
        { url: 'myExam', name: '我的考试' },
      ],
      nowFunction: '', // 当前的功能点
    }
  },

   methods: {

    // 切换功能点
    changeFunction: function (url) {
      this.nowFunction = url;
      this.$router.replace('/train/' + url);
    }
  }

}

</script>


<style lang="scss" scoped>
.module-head {
  width: 100%;
  height: 40px;
  background: white;
  box-shadow: 0 1px 1px lightgrey;
  padding-left: 10px;
  padding-top: 5px;
}

.module-head .each-module-head {
  font-size: 14px;
  line-height: 30px;
  margin: 0 20px;
  color: #317bcf;
  cursor: pointer;
  letter-spacing: 0.3px;
  float: left;
  padding: 0 10px;
  border-radius: 5px;
  transition: all .3s;
}

.active {
  background: #2e74c5;
  color: white !important;
}

.module-detail {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
  padding: 20px 40px;
}
</style>
