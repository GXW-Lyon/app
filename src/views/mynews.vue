<template>
  <div class="mynews">
      <div class="top-banner clearfloat">
          <div class="ret-btn" @click="goBack">
              <img src="../assets/img/fanhui1.png" alt="">
          </div>
          <span @click="goBack">我的消息</span>
      </div>
      <div class="mynews-wrapper">
        <div class="mynews-content" ref="wrapper" :style="{height:wrapperHeight+'px'}">
          <div class="text-date"><span>2018年5月20日</span></div>
          <img @click="toRequest" src="../assets/img/myinfo111.png" alt="">
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name:'mynews',
    data() {
      return {
        wrapperHeight:0,
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    methods:{
      goBack () {
        this.$router.go(-1);
      },
      toRequest () {
          this.$router.push({path:'request'});
      }
    }
  }
</script>
<style>
    .clearfloat:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0
    }

    .clearfloat {
        zoom: 1
    }

    .mynews {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
    }

    .mynews .top-banner {
        width: 100%;
        height: 44px;
        background-color: #fff;
    }

    .mynews .top-banner .ret-btn {
        width: 36px;
        height: 100%;
        float: left;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }

    .mynews .top-banner .ret-btn img {
        width: 10px;
        vertical-align: middle;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .mynews .top-banner span {
        float: left;
        line-height: 46px;
        font-size: 18px;
        padding-left: 5px;
    }
    .mynews .mynews-wrapper .mynews-content{
        width:100%;
        overflow-y: auto;
        padding: 0 20px 20px 20px;
        /* padding-bottom: 60px; */
    }
    .mynews .mynews-wrapper .mynews-content .text-date{
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .mynews .mynews-wrapper .mynews-content .text-date span{
        border-radius: 3px;
        background: #d3d3d3;
        color: #fff;
        padding: 4px 16px;
        font-size: 14px;
    }
    .mynews .mynews-wrapper .mynews-content img{
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
</style>

