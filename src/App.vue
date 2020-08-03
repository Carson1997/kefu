<template>
  <div id="app" class="app">
    <router-view class="app-content">

    </router-view>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, .app, .app-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script>
export default {
  created: function () {
    this.$router.replace('/');
  }
}
</script>
