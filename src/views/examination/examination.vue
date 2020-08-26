<template>
  <div class="examination" id="examination">
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
  name: 'examination',

  data: function () {
    return {
      moduleFunctions: [ // 所有功能
        { url: 'sourceManage', name: '素材管理', status: 2 },
        { url: 'trainManage', name: '培训管理', status: 2 },
        { url: 'examManage', name: '考试管理', status: 2 },
        { url: 'examHistory', name: '学生历史考试管理', status: 2 },
        { url: 'importantInformation', name: '系统重要信息', status: 2 },
      ],
      nowFunction: '', // 当前的功能点
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
      return arr;
    }
  },

  methods: {

    // 切换功能点
    changeFunction: function (url) {
      this.$store.commit('changeNormalValue', { name: 'NOW_EXAMINATION', value: url });
      this.nowFunction = url;
      this.$router.replace('/examination/' + url);
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