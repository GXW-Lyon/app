<template>
    <div class="my">
        <div class="my-top1 clearfloat">
            <div class="my-pic" @click="loginIng"><img :src="avatar" alt=""></div>
            <div @click="loginIng" class="login_text" style="line-height:46px" v-if="loginOut">点击登录</div>
            <div class="userinfo" v-if="loginAfter">
                <span class="userName">{{name}}</span>
            </div>
            <div @click="setup" class="detail"><img src="../assets/img/setupgxw.png" alt=""></div>
        </div>
        <div class="my-gold">
            <div class="gold line">
                <div class="gold-all">{{todayBalance}}</div>
                <div>今日金币</div>
            </div>
            <div class="gold line">
                <div class="gold-all">{{sbalance}}</div>
                <div>剩余金币</div>
            </div>
            <div class="gold">
                <div class="gold-all">{{totalBalance}}</div>
                <div>总金币</div>
            </div>
        </div>
        <div class="my-task">
            <div class="gold-task" @click="income">
                <div class="task-pic"><img src="../assets/img/wode-jinbi.png" alt=""></div>
                <div>收益明细</div>
            </div>
            <div class="gold-task" @click="request" style="position: relative;">
                <div class="task-pic"><img src="../assets/img/wode-shitu.png" alt=""></div>
                <div>师徒邀请</div>
                <div class="shituIcon">高额奖励</div>
            </div>
            <div class="gold-task" @click="exchange">
                <div class="task-pic"><img src="../assets/img/wode-duihuang.png" alt=""></div>
                <div>兑换提现</div>
            </div>
            <div class="gold-task" @click="orderList">
                <div class="task-pic"><img src="../assets/img/wode-dingdan.png" alt=""></div>
                <div>我的订单</div>
            </div>
        </div>
        <div class="banner-img">
            <div class="swiper-container" id="adSwiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in $store.state.advertLists" v-if="index==0">
                        <img :src="item.imgs[0].src" alt="" @click="requestTwo">
                    </div>
                    <div class="swiper-slide" v-for="(item,index) in $store.state.advertLists" v-if="index>0">
                        <img :src="item.imgs[0].src" alt="" @click="loadApks(item.url,item.adId,item.topic,item.type,item.map,item.imgs[0],item.source)">
                    </div>
                </div>
            </div>
        </div>
        <div class="my-setInfo" >
            <div class="mint-cell" @click="mynews">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/xiaoxi.png" alt="" style="width:20px">
                        <span class="mint-cell-text">我的消息</span>
                        <!-- <img style="width:25px" src="../assets/img/myneshb.png" alt=""> -->
                    </div>
                    <div class="mint-cell-title yindao_tip">
                        <span class="mint-cell-text">收徒得大奖</span>
                        <img class="pimg" src="../assets/img/myneshb.png" alt="" style="width:20px">
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div>
            <div class="mint-cell" @click="about">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/about.png" alt="" style="width:20px">
                        <span class="mint-cell-text">关于我们</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div>
            <div class="mint-cell" @click="feedback">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/yijian.png" alt="" style="width:20px">
                        <span class="mint-cell-text">意见反馈</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div>
            <!-- <div class="mint-cell">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/lishi.png" alt="" style="width:20px">
                        <span class="mint-cell-text">我的收藏</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div> -->
        </div>
        <div class="my-bottom">
            <div class="mint-cell minline" @click="setup">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/shezi.png" alt="" style="width:20px">
                        <span class="mint-cell-text">系统设置</span>
                    </div>
                    <div class="mint-cell-title yindao_tip" v-if="isVisibleGold">
                        <img class="pimg" src="../assets/img/smallgold.png" alt="" style="width:auto;height: 100%;">
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div>
            <!-- <div class="mint-cell">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/guanyuwomen.png" alt="" style="width:20px">
                        <span class="mint-cell-text">关于我们</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div>
            <div class="mint-cell">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <img class="pimg" src="../assets/img/pingfen.png" alt="" style="width:20px">
                        <span class="mint-cell-text">为我们评分</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </div> -->
        </div>
        <float></float>
        <bottomNav></bottomNav>
    </div>
</template>
<script>
    import bottomNav from 'components/bottomNav';
    import float from 'components/float';
    import crypto from 'crypto';
    import CryptoJS from 'crypto-js';
    import { Toast } from 'mint-ui';
    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.min.css';
    export default {
        name: 'personal',
        data() {
            return {
                loginOut:true,
                loginAfter:false,
                isVisibleGold:false,
                saign: '',
                times: '',
                uuid: '',
                token: '',
                dataList: {},
                name: '',
                sex: '',
                phoneNumber: '',
                userKey: '',
                avatar:'',
                sbalance:'0',
                todayBalance:'0',
                totalBalance:'0',
                invitateCode:'',
                wechatName:'',
                mybirthday:'',
            };
        },
        components: {
            bottomNav,
            float,
        },
        mounted () {
            var _this = this;
            var adSwiper = new Swiper('#adSwiper',{
                direction : 'horizontal',
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:false,//修改swiper的父元素时，自动初始化swiper
                noSwiping : true,
                resistanceRatio: 0,
                autoplay:{
                    delay:3000,
                    disableOnInteraction: false,
                }
          })
        },
        created () {
            if(this.$store.state.PadvertState==false){
                this.advertList();
            }
            let kdtt=JSON.parse(localStorage.getItem('kdtt'));
            if (kdtt != null) {
                this.avatar=require('../assets/img/hhhhhhhhhhhhh.png');
                this.personalSign();
                kdtt.avatar&&kdtt.userName?this.myInfo():this.userInfo();
                this.balance();
                this.loginOut=false;
                this.loginAfter=true;
            }else{
                this.avatar=require('../assets/img/my-pic.png');
                this.loginOut=true;
                this.loginAfter=false;
            }
        },
        methods: {
            /*广告列表*/
            advertList(){
                this.$http({
                    method:'get',
                    url:this.apiUrl.adCarousel,
                    params:{imei:this.$store.state.deviceuuid, category:'mine'}
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        if(res.data.status==1){
                            this.$store.state.advertLists = res.data.list;
                            this.$store.state.PadvertState = true;
                        }
                    }
                }).catch()
            },
            /*初始化我的信息*/
            myInfo(){
                var kdtt = localStorage.getItem('kdtt');
                kdtt = JSON.parse(kdtt);
                this.name =kdtt.userName;
                this.avatar =kdtt.avatar;
                this.glod(kdtt);
            },
            /*系统设置页*/
            setup() {
                if(this.isLogin()==false){
                    return false;
                }else{
                     this.personalSign();
                     this.userInfo();
                    this.$router.push({path: 'setup'});
                }
            },
            /*判断是否登陆*/
            loginIng() {
                if(JSON.parse(localStorage.getItem('kdtt')) != null){
                    Toast({
                        message: '已登录',
                        position: 'bottom'
                    });
                }else{
                    this.$router.push({path: 'login'});
                }
            },
            /*获取用户信息*/
            userInfo() {
                this.$http({
                    method: 'get',
                    url: this.apiUrl.userGetUser,
                    params: this.dataList
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        var data = res.data;
                        if(this.decrypt(data.bindWechat, this.userKey)=='Y'){
                            this.wechatName = this.decrypt(data.wechatName, this.userKey);
                        }
                        this.invitateCode = this.decrypt(data.invitateCode, this.userKey);
                        this.name = this.decrypt(data.nickName, this.userKey);
                        this.sex = this.decrypt(data.sex, this.userKey);
                        this.mybirthday = this.decrypt(data.birthDay, this.userKey);
                        this.phoneNumber = this.decrypt(data.phone, this.userKey);
                        this.avatar = this.decrypt(data.image, this.userKey)||require('../assets/img/my-pic.png');
                        var kdtt = localStorage.getItem('kdtt');
                        kdtt = JSON.parse(kdtt);
                        kdtt.userName = this.name;
                        kdtt.phoneNumber = this.phoneNumber;
                        kdtt.invitateCode = this.invitateCode;
                        kdtt.mybirthday = this.mybirthday;
                        kdtt.wechatName = this.wechatName;
                        kdtt.avatar = this.avatar;
                        kdtt.mySex = this.sex?(this.sex=='1'?'男':'女'):'';
                        localStorage.setItem('kdtt', JSON.stringify(kdtt));
                        this.$store.state.userName = JSON.parse(localStorage.getItem('kdtt')).userName ;
                        this.$store.state.phoneNumber = JSON.parse(localStorage.getItem('kdtt')).phoneNumber;
                        this.glod(kdtt);
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            /*获取tokenuuid*/
            personalSign () {
                this.creatSiagn(this.apiUrl.userGetUser);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign};
            },
            /*师徒邀请页*/
            request () {
                if(this.isLogin()==false){
                    return false;
                }else{
                     this.personalSign();
                     this.userInfo();
                    this.$router.push({path:'request'});
                }
            },
            requestTwo () {
                if(this.isLogin()==false){
                    return false;
                }else{
                    this.personalSign();
                    this.userInfo();
                    this.$router.push({path:'request'});
                    // this.$router.push({path:'activity'});
                }
            },
            /*收益明细页*/
            income () {
                if(this.isLogin()==false){
                    return false;
                }else{
                     this.personalSign();
                     this.userInfo();
                    this.$router.push({path:'income'});
                }
            },
            /*金币数量*/
            balance () {
                this.creatSiagn(this.apiUrl.taskBalance);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign};
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskBalance,
                    params:this.dataList
                }).then(res=>{
                    if(res.status==200){
                        // console.log(res);
                        if(res.data.status ==1){
                            this.sbalance = res.data.balance;
                            this.todayBalance = res.data.todayBalance;
                            this.totalBalance = res.data.totalBalance;
                        }
                    }
                }).catch();
            },
            /*提现页*/
            exchange () {
                if(this.isLogin()==false){
                    return false;
                }else{
                     this.personalSign();
                     this.userInfo();
                    this.$router.push({path:'exchange'});
                }
            },
            /*我的订单页*/
            orderList () {
                if(this.isLogin()==false){
                    return false;
                }else{
                     this.personalSign();
                     this.userInfo();
                    this.$router.push({path:'orderlist'});
                }
            },
            /*消息页*/
            mynews () {
                if(this.isLogin()==false){
                    return false;
                }else{
                this.$router.push({path:'mynews'});
                }
            },
            /*关于我们*/
            about () {
                this.$router.push({path:'about'});
            },
            /*意见反馈*/
            feedback () {
                this.$router.push({path:'feedback'});
            },
            /*系统设置是否显示金币样式*/
            glod(kdtt){
                if(!kdtt.mySex||!kdtt.mybirthday) {
                    this.isVisibleGold = true;
                }
            },
            /*下载apk*/
            loadApks(url, pk, topic, type, map, firstImg,srckey){
                if(type=='ld'){
                    this.adUpload(5,pk,srckey);
                    this.$router.push({
                        path: 'detail',
                        query: {
                            stime: Date.parse(new Date()),
                            url: url,
                            pk: pk,
                            topic: topic,
                            type: type,
                            map: map,
                            imgUrl: firstImg
                        }
                    });
                }else{
                    this.adUpload(5,pk,srckey);
                    this.fileDownLoad(url,pk,srckey);
                }
            }
        }
    };
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

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

    .my {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
        font-size: 16px;
        color: #333;
    }

    .my-top1 {
        width: 100%;
        background-color: #e53526;
        padding: 20px 0;
        display: flex;
        align-items: center;
        color: #fff;
    }

    .my-top1 .my-pic {
        width: 50px;
        height: 50px;
        border-radius:50%;
        -webkit-border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        margin-left: 28px;
    }

    .my-top1 .my-pic img {
        width: 100%;
        vertical-align: middle;
    }

    .my-top1 .userinfo span {
        display: block;
        line-height: 24px;
    }
    .my-top1 .detail{
        width: 28px;
        height: auto;
        position: fixed;
        right: 6%;
        top: 3%;
    }
    .my-top1 .detail img{
        width: 100%;
        vertical-align: middle;
    }
    .my-gold{
        display: flex;
        display: -webkit-flex;
        background: #e53526;
        align-items: center;
        text-align: center;
        color: #fff;
        font-size: 14px;
        padding-bottom: 10px;
        margin-top: -1px;

    }
    .my-gold .gold .gold-all {
        font-size: 18px;
        font-weight: 700;
    }
    .my-gold .gold{
        flex: 1;
        line-height: 24px;
        position: relative;
    }
    .my-gold .line::after{
        width: 1px;
        height: 25px;
        content: " ";
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: #fff;
     }
    .my-task{
        background: #fff;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 14px;
        padding: 3% 0;
    }
    .my-task .gold-task{
        flex: 1;
    }
    .my-task .gold-task .task-pic{
        width: 40%;
        margin: 0 auto;
        padding-bottom: 5%;
    }
    .my-task .gold-task .task-pic img{
        width: 100%;
        vertical-align: middle;
    }
    .banner-img{
        width: 100%;
        height: 85px;
        overflow: hidden;
        vertical-align: middle;
        margin:10px 0;
    }
    .banner-img .onImg{
        width: 100%;
        height: 100%;
    }
    .banner-img .onImg img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }
    .banner-img #adSwiper{
        width: 100%;
        height: 85px;
    }
    .banner-img #adSwiper .swiper-wrapper{
        width: 100%;
        height: 85px;
    }
    .banner-img #adSwiper .swiper-slide img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }
    .my-setInfo {
        /* margin-top: 4%; */
        background: #fff;
    }

    .my-bottom {
        background: #fff;
    }
    .my-bottom .minline{
        background-image: none !important;
    }
    .mint-cell:last-child{
        background-image: none !important;
    }
    .mint-cell-wrapper {
        background-image: none !important;
        font-size: 14px !important;
    }
    .mint-cell {
        padding-left: 4% !important;
        border-bottom: 1px solid #eee !important;
    }
    .yindao_tip{
        text-align:right;
        padding-right:30px;
        height: 20px;
    }
    .yindao_tip span{
        margin-right: 6px;
        vertical-align: middle;
        font-size:12px;
        height:20px;
        line-height:20px;
        display:inline-block;
        color: #666;
    }
    .yindao_tip img{
        vertical-align: top;
    }
    .mint-cell-allow-right::after {
        width: 10px;
        height: 10px;
        border: solid 1px #c8c8cd;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top: 50%;
        right: 20px;
        position: absolute;
        -webkit-transform: translateY(-50%) rotate(45deg);
        transform: translateY(-50%) rotate(45deg);
    }

    .mint-cell-title .pimg {
        margin-right: 6px;
    }
    .shituIcon{
        width: 60px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        right: -25px;
        top: -10px;
        background: #e53526;
        border-radius: 10px;
        border-bottom-left-radius: 2px;
        font-size: 12px;
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.90);
        font-size:10.8px;
        color:#fff;
        letter-spacing: 1px;
    }
</style>

