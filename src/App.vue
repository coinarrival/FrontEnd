<template>
  <div id="app">   
  <!--
    <div class="header">
      <img class="icon" src="./assets/coin_arrival.jpg">
      <h1>{{ msg }}</h1>
    </div>
    //-->
    <el-row class="header">
      <el-col :span="2"><img class="icon" src="./assets/coin_arrival.jpg"></el-col>
      <el-col :span="4"><h2>{{ msg1 }}</h2></el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  data () {
    return {
      msg1: 'Coin Arrival 币达'
    }
  }, 
  // methods:{
  //   setCookie: function(c_name,value,expire) {
  //       var date=new Date()
  //       date.setSeconds(date.getSeconds()+expire)
  //       document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  //       console.log(document.cookie)
  //     },
  //     getCookie: function(c_name){
  //       if (document.cookie.length>0){
  //         let c_start=document.cookie.indexOf(c_name + "=")
  //         if (c_start!=-1){ 
  //             c_start=c_start + c_name.length+1 
  //             let c_end=document.cookie.indexOf(";",c_start)
  //             if (c_end==-1) c_end=document.cookie.length
  //             return unescape(document.cookie.substring(c_start,c_end))
  //         } 
  //       }
  //       return ""
  //     }
  // }
}
</script>

<style>
  html{
    height: 100%;
  }
  body {  
    background-color: #F6F6F6;
    background-image: url(./assets/bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  h2{
    font-family:BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    color: #0083FF;
  }
  h3{
    font-family:BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    
  }
  .icon {
    height: 60px;
    width: 60px;   
  }
  .header {
    background-color: #FFFFFF44;
    padding: 5px;
    height: auto;
    align: center;
  }
</style>