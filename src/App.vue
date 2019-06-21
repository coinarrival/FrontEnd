<template>
  <div id="app">
    <el-row :gutter="20" class="header">
      <el-col :span="8">
        <div class="banner">{{ msg1 }}</div>
      </el-col>
      <el-col :span="8">
        <h2>{{ msg1 }}</h2>
      </el-col>
      <el-col :span="8">
        <div class="banner">{{ msg1 }}</div>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      msg1: 'Coin Arrival 币达'
    }
  },
}
</script>

<style>
  html {
    height: 100%;
  }

  body {
    background: linear-gradient(0deg, #0b4182 1%, #1e88e5 100%);
    /* background-image: url(./assets/bg.jpg);
    background-repeat: no-repeat;
    background-size: cover; */
    margin: 0 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  h2 {
    font-family: BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }

  h3 {
    font-family: BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }

  .banner {
    opacity: 0;
  }

  .header {
    background-color: #FFFFFF44;
  }
</style>