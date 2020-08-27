<template>
  <div class="data-statistics" id="dataStatistics">
    <div class="module-head">
      <div class="each-module-head" v-for="(item, index) in moduleFunctionsShow" :key="index" @click="changeFunction(item.url)" v-bind:class="{'active': item.url == nowFunction}"> {{ item.name }} </div>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="module-detail"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="module-detail"></router-view>
  </div>
</template>

<script>
export default {
  name: 'dataStatistics',

  data: function () {
    return {
      moduleFunctions: [ // 所有功能
        { url: 'makeTable', name: '创建表格', status: 2 },
        { url: 'uploadData', name: '上传数据', status: 2 }
      ],
    }
  },

  computed: {
    status: function () { // 用户权限
      return this.$store.state.USER_STATUS
    },

    moduleFunctionsShow: function () { // 显示的功能点
      let arr = this.moduleFunctions.filter(item => {
        return item.status == this.status;
      })
      arr.unshift({ url: 'dataStatisticsTable', name: '客服数据汇总统计', status: 2 });
      return arr;
    },

    nowFunction: {
      get: function () {
        return this.$store.state.NOW_DATASTATISTICS_ROUTE;
      },
      set: function (value) {
        this.$store.commit('changeNormalValue', { name: 'NOW_DATASTATISTICS_ROUTE', value: value });
      }
    }
  },

  methods: {

    // 切换功能点
    changeFunction: function (url) {
      this.$route.meta.keepAlive = true;
      this.$store.commit('changeNormalValue', { name: 'NOW_DATASTATISTICS_ROUTE', value: url });
      this.nowFunction = url;
      this.$router.replace('/dataStatistics/' + url);
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