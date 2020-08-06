<template>
  <div class="setting" id="setting">
    <div class="module-head">
      <div class="each-module-head" v-for="(item, index) in moduleFunctions" :key="index" @click="changeFunction(item.url)" v-bind:class="{'active': item.url == nowFunction}"> {{ item.name }} </div>
    </div>
    <router-view class="module-detail"></router-view>
  </div>
</template>

<script>
export default {
  name: 'setting',

  data: function () {
    return {
      moduleFunctions: [ // 所有功能
        { url: 'groupSetting', name: '群组设置' },
        { url: 'userSetting', name: '用户设置' },
        { url: 'productSetting', name: '产品分类' },
        { url: 'noticeSetting', name: '公告分类' },
        { url: 'projectSetting', name: '项目设置' },
      ],
      nowFunction: '', // 当前的功能点
    }
  },

  methods: {

    // 切换功能点
    changeFunction: function (url) {
      this.nowFunction = url;
      this.$router.replace('/setting/' + url);
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