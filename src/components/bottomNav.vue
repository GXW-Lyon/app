<template>
    <div class="bottom">
        <div class="navBox" @click="refreshIndex">
            <router-link to="/index">
                <span class="icon icon-foo"></span>
                <p>头条</p>
            </router-link>
        </div>
        <div class="navBox" @click="refreshVideo" style="position: relative;">
          <router-link to="/videos">
            <span class="icon icon-bar"></span>
            <p>视频</p>
            <!-- <div class="shituIcon">世界杯</div> -->
          </router-link>
        </div>
        <div class="navBox">
            <router-link to="/novels">
                <span class="icon icon-novel"></span>
                <p>小说</p>
                <div class="shituIcon">hot</div>
            </router-link>
        </div>
        <div class="navBox">
          <router-link to="/thetask">
            <span class="icon icon-work"></span>
            <p>任务</p>
          </router-link>
        </div>
        <div class="navBox">
            <router-link to="/personal">
                <span class="icon icon-fb"></span>
                <p>我的</p>
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'topsearch',
        data() {
            return {
                // active:false
            };
        },
        methods:{
            refreshIndex(){
                this.$emit('refreshList','menu');
            },
            refreshVideo(){
                this.$emit('refreshVideoList','menu');
            },
        }
    };
</script>
<style>
    * {
        padding: 0;
        margin: 0;
    }

    a:-webkit-any-link {
        text-decoration: none;
        color: #000;
    }

    .bottom {
        box-sizing: border-box;
        display: -webkit-flex;
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 54px;
        position: fixed;
        z-index: 1;
        bottom: 0;
        left: 0;
        background: #fff;
        font-size: 12px;
        border-top: 1px solid #e0e0e0;
    }

    .bottom .navBox {
        position: relative;
        padding-top: 5px;
        text-align: center;
        vertical-align: middle;
        flex:1;
    }

    .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
    }
    /*头条*/
    .icon-foo {
        background: url('../assets/img/fireNews1.png');
        background-size: 100% 100%;
    }
    /*视频*/
    .icon-bar {
        background: url('../assets/img/video1.png');
        background-size: 100% 100%;
    }
    /*我的*/
    .icon-fb {
        background: url('../assets/img/my1.png');
        background-size: 100% 100%;
    }
    /*任务*/
    .icon-work {
        background: url('../assets/img/work1.png');
        background-size: 100% 100%;
    }

    .icon-novel {
        background: url('../assets/img/novel.png');
        background-size: 100% 100%;
    }

    .router-link-active .icon-foo {
        background: url('../assets/img/fireNews.png');
        background-size: 100% 100%;
    }

    .router-link-active .icon-bar {
        background: url('../assets/img/video.png');
        background-size: 100% 100%;
    }

    .router-link-active .icon-fb {
         background: url('../assets/img/my.png');
         background-size: 100% 100%;
    }
    .router-link-active .icon-work {
         background: url('../assets/img/work2.png');
         background-size: 100% 100%;
    }
    .router-link-active .icon-novel {
         background: url('../assets/img/novel1.png');
         background-size: 100% 100%;
    }
     .shituIcon{
         width: 30px;
         height: 17px;
         line-height: 17px;
         position: absolute;
         right: -10px;
         top: 2px;
         background: #e53526;
         border-radius: 10px;
         border-bottom-left-radius: 2px;
         font-size: 12px;
         -webkit-transform-origin-x: 0;
         -webkit-transform: scale(0.90);
         transform: scale(0.90);
         font-size:10.8px;
         color:#fff;
         letter-spacing: 1px;
    }
</style>

