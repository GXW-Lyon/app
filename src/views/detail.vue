<template>
    <div>
        <div v-if="type!='beauty_kd'" class="detail-top clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">返回</span>
            <div class="share-btn" @click="$store.state.popupVisible=true">
                <img src="../assets/img/sharePic.png" alt="">
            </div>
        </div>
        <div v-if="type=='beauty_kd'" class="detail-top1 clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/requestFH.png" alt="">
            </div>
            <div class="share-btn1" @click="$store.state.popupVisible=true">
                <img class="img1" src="../assets/img/detailshare.png" alt="">
            </div>
            <div class="advertPic" v-if="hideOrshow">
                <div v-for="item in girlAdlists" :class="{sougouAd:item.imgs.length==0}">
                    <img v-if="item.imgs.length>0" class="adPic" @click="loadAdApk(item.url,item.adId,item.source)" :src="item.imgs[0].src" alt="">
                    <iframe v-else style="width:100%;height:100px;" referrerpolicy="origin" frameborder="0" :src=item.topic></iframe>
                    <img class="adClose" @click="hideAd" src="../assets/img/adclosead.png" alt="">
                    <img v-if="item.imgs.length!=0" class="adshowAd" src="../assets/img/adshow1ad.png" alt="">
                </div>
            </div>
        </div>
        <share v-on:success="success" v-if="type!='beauty_kd'" :shareInfo="{url:inviteUrl+url,title:topic,type:10,imgurl:imgUrl,uploadInfo:uploadInfo}"></share>
        <share v-on:success="success" v-if="type=='beauty_kd'" :shareInfo="{url:inviteUrlPic,title:'邀请你一起使用口袋头条',content:'口袋头条提供丰富精彩内容，阅读和邀请好友还可提现赚零花钱 '}"></share>
        <div :class="type!='beauty_kd'?'ifram-box':'ifram-box1'">

            <iframe id="frm" :src="src" frameborder="0" style="width:100%;height:100%"></iframe>
            <!-- <div id="ifm"></div> -->
        </div>
        <!-- <div class="detail-bottom"></div> -->
        <sircle :Type="{type:type}"></sircle>
        <div :class="{getGold:isSuccess}" v-if="isSuccess">
            <img src="../assets/img/IMG_2981.png" alt="">
            <div class="gold-nums"><p class="gold_number">{{goldNum?goldNum:'0'}}</p><p>金币</p></div>
        </div>
        <img class="bg" src="../assets/img/loadingmore.jpg" v-if="bgStatus" />
    </div>
</template>

<script type="text/javascript">
    require('../js/index.js');
    import {Toast} from 'mint-ui';
    import share from 'components/share';
    import sircle from 'components/sircleanimation';
    export default {
        name: 'detail',
        data() {
            return {
                src: '',
                url: '',
                loading: false,
                bgStatus: true,
                draw:null,
                timeOut:null,
                isSuccess:false,
                stime:'',
                etime:'',
                pk:'',
                topic:'',
                type:'',
                imgUrl:'',
                inviteUrl: '/detailinfo.html?src=',
                inviteUrlPic: '/shareOne.html',
                uploadInfo: {
                    channel: 1,
                    action: 8,
                    category: '',
                    title: '',
                    detail_id: '',
                },
                hideOrshow:true,
                girlAdlists:[]
            };
        },
        components: {
            share,
            sircle
        },
        beforeRouteLeave (to, from, next) {
            this.report();
            next();
        },
        created() {
            this.inviteUrl=this.$store.state.shareDomain+this.inviteUrl;
            this.inviteUrlPic=this.$store.state.shareDomain+this.inviteUrlPic;
            this.url =this.src= this.$route.query.url;
            this.bgStatus=false;
            this.stime = this.$route.query.stime;
            this.pk = this.uploadInfo.detail_id = this.$route.query.pk;
            this.map = this.$route.query.map;
            this.topic = this.uploadInfo.title = this.$route.query.topic;
            this.type = this.uploadInfo.category = this.$route.query.type;
            this.imgUrl = this.$route.query.imgUrl;
            if(this.type!='apk'&&this.type!='ld')
                this.detailInfo();
            if(this.type=='beauty_kd'){
                this.advertLis(this.type);
            }
            this.phoneBack();
        },
        methods: {
            goBack() {
                this.etime = Date.parse(new Date());
                clearInterval(this.$store.state.draw);
                clearTimeout(this.$store.state.timeOut);
                clearTimeout(this.$store.state.scrollTimer);
                this.$router.push({path: 'index'});
                localStorage.setItem('hasLoaded',this.$store.state.hasLoaded);
            },
            /*获取详情页信息*/
            detailInfo() {
                let uuid = JSON.parse(localStorage.getItem('kdtt')) ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.networkType();//获取网络类型
                // console.log(uuid);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetDetail,
                    params: {
                        type: this.type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        topic: this.topic,
                        date: this.stime,
                        pk: this.pk,
                        url: this.url
                    },
                    headers: {'uuid': uuid},
                }).then(res => {
//                    if(res.status==200){
//                        console.log(res);
//                        this.src = res.data.url;
//                        this.bgStatus=false;
//                    }
                }).catch();
            },
            /*上报用户信息*/
            report() {
                let uuid = JSON.parse(localStorage.getItem('kdtt')) ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.networkType();//获取网络类型
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsReport,
                    params: {
                        type: this.type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        topic: this.topic,
                        sTime: this.stime,
                        eTime: this.etime,
                        aid: this.pk,
                        url: this.url,
                        params: this.map
                    },
                    headers: {
                        'uuid': uuid,
                        'accessToken': JSON.parse(localStorage.getItem('acsToken')).accessToken,
                        'nonce': JSON.parse(localStorage.getItem('acsToken')).nonce,
                        'timestamp': JSON.parse(localStorage.getItem('acsToken')).timestamp,
                        'mediaSource': JSON.parse(localStorage.getItem('acsToken')).mediaSource
                    },
                }).then(res => {
                    if (res.status == 200) {
                        // console.log(1);
                        // console.log(res);
                    }
                }).catch();
            },
            /*手机按键返回*/
            phoneBack() {
                let _this = this;
                plus.key.addEventListener('backbutton', function () {
                    _this.etime = Date.parse(new Date());
                    clearInterval(_this.$store.state.draw);
                    clearTimeout(_this.$store.state.timeOut);
                    localStorage.setItem('hasLoaded',_this.$store.state.hasLoaded);
                });
            },
            /*分享加分*/
            success(){
                this.isSuccess = false;
                this.creatSiagn(this.apiUrl.taskShare);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskShare,
                    params:{uuid: this.uuid, times: this.times, sign: this.saign,type:19}
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        if(res.data.status==1){
                            this.goldNum = res.data.bouns;
                            this.isSuccess = true;
                        }else{
                            this.isSuccess=false;
                        }
                    }
                }).catch();
            },
            /*隐藏广告*/
            hideAd(){
                this.hideOrshow = false;
            },
            /*下载apk*/
            loadAdApk(url, pk, srckey){
                this.adUpload(5,pk,srckey);
                this.fileDownLoad(url,pk,srckey);
            },
            /*广告列表*/
            advertLis(type){
                this.$http({
                    method:'get',
                    url:this.apiUrl.adDetailad,
                    params:{
                        imei:this.$store.state.deviceuuid,
                        category:type,
                        count:1
                    }
                }).then(res=>{
                    if(res.status===200){
                        console.log(res);
                        if(res.data.status==1){
                            this.girlAdlists = res.data.list;
                        }
                    }
                }).catch();
            },
            // a(){
            //     console.log(document.querySelector('#frm').contentWindow.document.body.scrollTop);
            // }
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

    body {
        background: url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }

    .hindeNone {
        display: none;
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

    .detail-top1 {
        position: fixed;
        width: 100%;
        height: 44px !important;
        line-height: 44px !important;
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

    .detail-top1 .ret-btn {
        width: 36px !important;
        height: 100% !important;
        margin-left: 10px !important;
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

    .detail-top1 .ret-btn img {
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
   .detail-top1 .share-btn1{
       float: right !important;
       width: 40px !important;
       height: 100% !important;
       display: flex !important;
       align-items: center !important;
   }
    .detail-top .share-btn img{
        width: 20px !important;
        vertical-align: middle !important;
    }
    .detail-top1 .share-btn1 .img1{
        width: 24px !important;
        vertical-align: middle !important;
        margin-top: -1px;
    }
    .detail-top1 .share-btn img{
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
        background: url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }

    .ifram-box1 {
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .detail-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 8vh;
        background: red;
    }

    .box {
        width: 100px;
        height: 100px;
        background: red;
    }

    .big_circle {
        width: 74px;
        height: 74px;
        border: 5px solid #d7332a;
        position: fixed;
        left: -1px;
        bottom: -1px;
        z-index: 3;
        border-radius: 50%;
    }

    .center_circle {
        width: 56px;
        height: 56px;
        border: 5px solid #d7332a;
        position: fixed;
        left: 8px;
        bottom: 8px;
        z-index: 3;
        border-radius: 50%;
    }

    .getGold {
        animation: mymove 2s;
        animation-fill-mode: forwards;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 200px;
        height: 200px;
        z-index: 9999;
    }

    .getGold img {
        width: 100%;
        vertical-align: middle;
    }

    .getGold .gold-nums {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 20%;
        text-align: center;
        font-size: 18px;
        color: #d7332a;
    }

    .getGold .gold-nums .gold_number {
        font-size: 40px;
        margin-bottom: 6px;
    }

    @keyframes mymove {
        0% {
            left: 0px;
            bottom: 0;
            opacity: 0;
        }
        50% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            opacity: 1;
        }
        90% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            opacity: 1;
        }
        95% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            opacity: 0;
        }
        100% {
            opacity: 0;
            left: 0;
            bottom: 0
        }
    }

    .ifmbg {
        background: url('../assets/img/loadingmore.jpg') no-repeat center;
        background-size: 100%;
    }

    .bg {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .detail-top1 .advertPic{
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 3;
        box-shadow:0 -2px 30px 0px rgba(0,0,0,.7);
    }
    .detail-top1 .advertPic .adPic{
        vertical-align: middle;
        width: 100%;
        height: auto;
    }
    .detail-top1 .advertPic .adClose{
        position: absolute;
        right: 5px;
        top: 5px;
        width: 22px;
    }
    .detail-top1 .advertPic .adshowAd{
        position: absolute !important;
        left: 5px !important;
        bottom: 5px !important;
        width: 32px !important;
    }
    .sougouAd{height:100px;}
</style>

