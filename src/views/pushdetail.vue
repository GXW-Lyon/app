<template>
    <div>
        <div class="detail-top clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">返回</span>
            <div class="share-btn" @click="$store.state.popupVisible=true">
                <img src="../assets/img/detailshare.png" alt="">
            </div>
        </div>
        <share :shareInfo="{url:inviteUrl+src,title:topic,type:10,imgurl:imgUrl}"></share>
        <div class="ifram-box">

            <iframe :src="src" frameborder="0" style="width:100%;height:100%" class="ifmbg"></iframe>
            <!--<div id="ifm"></div>-->
        </div>
        <!-- <div class="detail-bottom"></div> -->
        <div class="splash" v-if="downImg" id="splash">
            <div class="loading-circle" id="loadingCircle">
                <canvas class="mask" id="loadingProgress" width="72" height="72"></canvas>
                <canvas class="bg" width="72" height="72"></canvas>
                <img  src="../assets/img/IdMG_2990.png" style="width: 48px; height: 48px;z-index:4;position:absolute;left:12px;bottom:12px">
                <div class="big_circle"></div>
                <div class="center_circle"></div>
            </div>
        </div>
        <div :class="{getGold:isTrue}" v-if="isTrue">
            <img src="../assets/img/IMG_2981.png" alt="">
            <div class="gold-nums"><p class="gold_number">{{goldNum}}</p><p>金币</p></div>
        </div>
        <img @click="plsLogin" v-if="!downImg" src="../assets/img/IMG_2982.png" style="position:fixed;z-index:2;left:0;bottom:0;width:72px;left:20px;bottom:20px;">
        <img class="bg" src="../assets/img/loadingmore.jpg" v-if="bgStatus" />
    </div>
</template>

<script type="text/javascript">
    import {Toast} from 'mint-ui';
    import share from 'components/share';
    export default {
        name: 'detail',
        data() {
            return {
                src:'',
                loading: false,
                bgStatus: true,
                hasLoaded:0,
                draw:null,
                timeOut:null,
                isTrue:false,
                goldNum:'',
                downImg:false,
                topic:'',
                imgUrl:'',
                inviteUrl: '/detailinfo.html?src=',
            };
        },
        components: {
            share
        },
        watch:{
            hasLoaded(one,two){
                if(one==102){
                    this.pageInfo();
                }else{
                    this.isTrue = false;
                }
            }
        },
        created() {
            this.inviteUrl=this.$store.state.shareDomain+this.inviteUrl;
            this.src = this.$route.query.url;
            this.topic = this.$route.query.topic||'';
            this.imgUrl = this.$route.query.imgUrl||'';
            this.bgStatus=false;
            if (JSON.parse(localStorage.getItem('kdtt')) != null){
                this.dataInfo();
            }
            this.phoneBack();
        },
        methods: {
            goBack() {
                clearInterval(this.draw);
                clearTimeout(this.timeOut);
                this.$router.push({
                    path: 'index',
                });
                if(this.hasLoaded>100){
                    this.hasLoaded =0;
                    localStorage.setItem('hasLoaded',this.hasLoaded);
                }else{
                    localStorage.setItem('hasLoaded',this.hasLoaded);
                }
            },
            /*画图渲染函数*/
            ulp (percent) {
                this.loading = true;
                var i = 0;
                if (this.hasLoaded > 100) {
                    clearInterval(this.draw);
                }
                if (i<percent) {
                    this.d();
                    i++;
                    this.hasLoaded += 1;
                }
            },
            /*canvas画图*/
            d () {
                var c=document.getElementById('loadingProgress'),ctx=c.getContext('2d');
                var loaded = this.hasLoaded * 2 / 100 * Math.PI, cw = 72, hcw = 36;
                ctx.clearRect (0,0,cw,cw);
                ctx.beginPath();
                ctx.arc(hcw,hcw,hcw-4, 0, loaded, false);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'yellow';
                ctx.stroke();
            },
            /*记时执行*/
            fn () {
                if(localStorage.getItem('hasLoaded')==null){
                    this.hasLoaded = 0;
                }else if(this.hasLoaded>100){
                    this.hasLoaded = 0;
                }else{
                    const number =localStorage.getItem('hasLoaded');
                    this.hasLoaded = parseInt(number);
                }
                clearInterval(this.draw);
                this.draw=null;
                this.draw=setInterval(()=>{this.ulp(99)},200);
            },
            /*计时阅读领取*/
            pageInfo () {
                this.creatSiagn(this.apiUrl.taskVisit);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskVisit,
                    params:{uuid: this.uuid, times: this.times, sign: this.saign,type:16,flag:1}
                }).then(res => {
                    if(res.status==200){
                        // console.log(res);
                        if(res.data.status==1){
                            this.isTrue = true;
                            this.downImg=true;
                            this.goldNum = res.data.message;
                            clearTimeout(this.timeOut);
                            this.timeOut = setTimeout(()=>{
                                this.fn();
                            },2000);
                        }else if(res.data.status==2){
                            this.downImg=false;
                        }
                    }
                }).catch();
            },
            /*判断计时领取任务是否完成*/
            dataInfo () {
                this.creatSiagn(this.apiUrl.taskVisit);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskVisit,
                    params:{uuid: this.uuid, times: this.times, sign: this.saign,type:16,flag:0}
                }).then(res => {
                    console.log(res);
                    if(res.status==200){
                        if(res.data.status==1){
                            this.downImg=true;
                            this.fn();
                        }else if(res.data.status==2){
                            this.downImg=false;
                        }
                    }
                }).catch();
            },
            plsLogin () {
                if (this.isLogin() == false) {
                    return false;
                }else {
                    Toast({
                        message: '今日已完成',
                        position: 'bottom'
                    });
                }
            },
            /*手机按键返回*/
            phoneBack() {
                let _this = this;
                plus.key.addEventListener("backbutton",function(){
                    clearInterval(_this.draw);
                    clearTimeout(_this.timeOut);
                    if(_this.hasLoaded>100){
                        _this.hasLoaded =0;
                        localStorage.setItem('hasLoaded',_this.hasLoaded);
                    }else{
                        localStorage.setItem('hasLoaded',_this.hasLoaded);
                    }
                });
            }
        }
    };
</script>
<style>
    * {
        margin: 0;
        padding: 0;
    }

    #ifm {
        display: none;
    }
    body{
        background:url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }
    .detail-top {
        position: fixed;
        width: 100%;
        height: 44px !important;
        line-height: 44px !important;
        background: #fff;
        border-bottom: 1px solid #e0e0e0;
        font-size: 18px !important;
        z-index: 999;
    }

    .detail-top .ret-btn {
        width: 36px !important;
        height: 100% !important;
        /*margin-left: 10px !important;*/
        float: left !important;
        display: -webkit-flex !important;
        display: flex !important;
    }

    .detail-top .ret-btn img {
        width: 10px !important;
        vertical-align: middle !important;
        margin: auto !important;
        left: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
    }
    .detail-top .share-btn{
        float: right !important;
        width: 36px !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
    }
    .detail-top .share-btn img{
        width: 20px !important;
        vertical-align: middle !important;
    }

    .detail-top span {
        font-size: 20px !important;
        padding-left: 5px !important;
        line-height: 41px !important;
        /* display: inline-block; */
    }

    .ifram-box {
        width: 100%;
        height: 100vh;
        padding-top: 44px !important;
        background:url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }

    .detail-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 8vh;
        background: red;
    }
    .splash .loading-circle {position: fixed; width: 72px; height: 72px; margin: auto; left: 20px;bottom: 20px;}
    .splash .loading-circle>* {display: block; position: absolute; box-sizing: border-box; border-radius: 72px;}
    .splash .loading-circle>canvas.bg {z-index: 2; width: 100%; height: 100%; border: 16px solid #bd1f20;}
    .splash .loading-circle>canvas.mask {z-index: 3; transform: rotate(-90deg); -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg);}
    .box{width: 100px;height: 100px;background: red;}
    .big_circle{
        width: 74px;
        height: 74px;
        border: 5px solid #d7332a;
        position: fixed;
        left: -1px;
        bottom: -1px;
        z-index: 3;
        border-radius: 50%;
    }
    .center_circle{
        width: 56px;
        height: 56px;
        border: 5px solid #d7332a;
        position: fixed;
        left: 8px;
        bottom: 8px;
        z-index: 3;
        border-radius: 50%;
    }
    .getGold{
        animation:mymove 2s;
        animation-fill-mode:forwards;
        position:fixed;
        bottom: 0;
        left: 0;
        width: 200px;
        height:200px;
    }
    .getGold img{
        width: 100%;
        vertical-align: middle;
    }
    .getGold .gold-nums{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 20%;
        text-align: center;
        font-size: 18px;
        color: #d7332a;
    }
    .getGold .gold-nums .gold_number{
        font-size: 40px;
        margin-bottom: 6px;
    }
    @keyframes mymove {
        0%{left:0px;bottom:0;opacity: 0;}
        50%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 1;}
        90%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 1;}
        95%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 0;}
        100%{opacity:0; left: 0;bottom: 0}
    }
    .ifmbg{
        background:url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }
    .bg{
        width:100%;
        position: absolute;
        top: 0;
        left:0;
        z-index: 1;
    }
</style>

