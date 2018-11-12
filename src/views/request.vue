<template>
    <div class="request">
        <div class="request-top" style="z-index:2000;">
            <img class="logo" src="../assets/img/requestPesron.png" alt="">
            <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
        </div>
        <div class="request-main">
            <div class="wrapper" ref="wrapper" :style="{height:wrapperHeight+'px'}">
                <div class="request-banner"><img src="../assets/img/request-banner.jpg" alt=""></div>
                <div class="request-inc">
                    <div class="request-info line" @click="tomyTd">
                        <div class="re-num">{{discipleSum?discipleSum:0}}</div>
                        <div class="re-text">我的徒弟</div>
                    </div>
                    <div class="request-info" @click="toDisIncome">
                        <div class="re-num">{{totalRevenue?totalRevenue:0}}</div>
                        <div class="re-text">徒弟提供的收益</div>
                    </div>
                </div>
                <mt-button class="btn-text" type="danger" @click="shareAction">立即邀请</mt-button>
                <div class="yzm-num" >
                    <div class="mint-cell" @click="popupVisible = true" v-if="master">
                        <div class="mint-cell-wrapper">
                            <div class="mint-cell-title">
                                <span class="mint-cell-text">填写师傅邀请码</span>
                            </div>
                            <i class="mint-cell-allow-right"></i>
                        </div>
                    </div>
                    <div class="my-num">
                        <span class="myNum_info">我的邀请码</span>
                        <span class="myNum_info center">{{invitateCode}}</span>
                        <span class="myNum_info copy"><span @click="copy" class="btn" :data-clipboard-text="invitateCode">一键复制</span></span>
                    </div>
                </div>
                <div class="request-rule">
                    <img style="width:100%;vertical-align:middle;" src="../assets/img/yaoqing.jpg" alt="">
                    <div class="rule">
                        <p>1、每收一位徒弟，即可获得<span>30000金币</span>。其中<span>3000</span>立即到账，剩余部分分七天，每天徒弟阅读收益满<span>200</span>即可获得
                        </p>
                        <p>2、徒弟获得阅读收益，师傅提成30%</p>
                    </div>
                </div>
                <mt-popup v-model="popupVisible" position="center" class="mint-popup-3">
                    <p>填写邀请码</p>
                    <input type="text" placeholder="输入师傅的邀请码" v-model="requestCode">
                    <div @click="createMaster">提交</div>
                </mt-popup>
            </div>
        </div>
        <share :shareInfo="{url:inviteUrl+invitateCode,title:shareTitle,content:shareContent,type:'weixinRequest',uploadInfo:uploadInfo}"></share>
    </div>
</template>
<script>
    import bottomNav from 'components/bottomNav';
    import share from 'components/share';
    import Clipboard from 'clipboard';
    import {Toast} from 'mint-ui';

    export default {
        name: 'request',
        data() {
            return {
                popupVisible: false,
                wrapperHeight: 0,
                master: true,
                id: '',
                discipleSum: '',
                totalRevenue: '',
                invitateCode: '',
                requestCode: '',
                shareTitle:'',
                shareContent:'',
                inviteUrl: '/shareOne.html?code=',
                uploadInfo:{
                    channel:4,
                    action:8,
                    category:'master_invite_now'
                },
            };
        },
        components: {
            bottomNav,
            share
        },
        created() {
            // this.id = JSON.parse(localStorage.getItem('kdtt')).uuid;
            this.inviteUrl=this.$store.state.shareDomain+this.inviteUrl;
            this.haveMaster();
            this.discipleInfo();
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - 44;
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            copy() {
                var clipboard = new Clipboard('.btn');
                clipboard.on('success', function (e) {
                    Toast({
                        message: '复制成功',
                        position: 'bottom'
                    });
                });
                clipboard.on('error', function (e) {
                    console.log(e);
                });
            },
            tomyTd() {
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.$router.push({path: 'disciple'});
                }
            },
            toDisIncome() {
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.$router.push({path: 'disincome'});
                }
            },
            /*是否有师傅*/
            haveMaster() {
                this.creatSiagn(this.apiUrl.mentorIsmentor);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.mentorIsmentor,
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    // console.log(res);
                    if (res.status == 200) {
                        if (res.data.status == 1) {
                            this.master = true;
                        } else if (res.data.status == 2) {
                            this.master = false;
                        }
                    }
                }).catch();
            },
            /*师徒信息列表*/
            discipleInfo() {
                this.creatSiagn(this.apiUrl.mentorList);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.mentorList,
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.discipleSum = res.data.discipleSum;
                        this.totalRevenue = res.data.totalRevenue;
                        this.invitateCode = res.data.invitateCode;
                    }
                }).catch();
            },
            /*创建师徒关系*/
            createMaster() {
                if (this.requestCode == '') {
                    Toast({
                        message: '邀请码不能为空',
                        position: 'center',
                        className: 'toasted',
                        duration: 1000,
                    });
                    return false;
                }
                this.myUpload('master_invite_fill_code',{
                    master_code:this.requestCode,
                    action:7,
                });
                this.creatSiagn(this.apiUrl.mentorCreateMentor);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.mentorCreateMentor,
                    params: {invitateCode: this.requestCode},
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
                            Toast({
                                message: '提交成功',
                                position: 'center',
                                className: 'toasted',
                                duration: 1000,
                            });
                            this.master = false;
                            this.popupVisible = false;
                        } else if (res.data.status == 2) {
                            this.requestCode = ''
                            Toast({
                                message: res.data.msg,
                                position: 'center',
                                className: 'toasted',
                                duration: 1000,
                            });
                        }
                    }
                }).catch();
            },
            /*立即邀请*/
            shareAction(){
                this.creatSiagn(this.apiUrl.shareApprentice);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.shareApprentice,
                    params:{code:this.invitateCode},
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                         this.shareTitle=res.data.title;
                         this.shareContent=res.data.content;
                         this.popupUpdate(true);
                    }else{
                        Toast({
                                message: '获取分享内容失败，请稍后再试',
                                position: 'bottom',
                                className: 'toasted',
                                duration: 1000,
                        })
                    }
                }).catch(res=>{
                    Toast({
                        message: '获取分享内容失败，请稍后再试',
                        position: 'bottom',
                        className: 'toasted',
                        duration: 1000,
                    })
                });
            },
        }
    };

</script>
<style>
    .request .request-top {
        height: 44px;
        width: 100%;
        background: #e53526;
        position: relative;
        top: 0;
        left: 0;
        z-index: 9999;
    }

    .request .request-top .logo {
        height: 24px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }

    .request .request-top .return {
        /*width: 14px;*/
        text-align: center;
        /*margin-left: 24px;*/
        /*margin-top: 8px;*/
        float: left;
        height: 100%;
        padding: 10px 15px;
    }

    .request .request-top .return img {
        width: 34%;
        vertical-align: middle;
    }

    .request .request-main .wrapper {
        overflow-y: auto;
        background:#fff;
    }

    .request .request-banner {
        width: 100%;
        /* background: url('../assets/img/request-banner.jpg') no-repeat;
        background-size:100%; */
    }

    .request .request-banner img {
        width: 100%;
        vertical-align: middle;
    }

    .request .request-inc {
        background: #fff;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
    }

    .request .request-inc .request-info {
        flex: 1;
    }

    .request .request-inc .line {
        border-right: 2px solid #e53526;
    }

    .request .request-inc .request-info .re-num {
        font-size: 20px;
        font-weight: 700;
        color: #e53526;
        padding-top: 4px;
        padding-bottom: 6px;
    }

    .request .request-inc .request-info .re-text {
        font-size: 12px;
        padding-bottom: 4px;
    }

    .request .btn-text {
        font-size: 20px;
        width: 80%;
        height: 45px;
        border-radius: 25px;
        margin: 30px auto;
        text-align: center;
        display: block;
    }

    .request .mint-field .mint-cell-title {
        width: 138px !important;
        font-size: 14px !important;
    }

    .request .mint-cell-wrapper {
        padding-left: 20px !important;
    }

    .request .yzm-num {
        font-size: 14px;
    }

    .request .yzm-num .line {
        border-bottom: 1px solid #f2f4f1;
        width: 78% !important;
    }

    .request .yzm-num .my-num {
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 48px;
        border-bottom: 1px solid #e0e0e0;
    }

    .request .yzm-num .mint-cell-wrapper {
        background-image: none;
    }

    .request .yzm-num .my-num .myNum_info {
        flex: 1;
    }

    .request .yzm-num .my-num .center {
        text-align: center;
    }

    .request .yzm-num .my-num .copy {
        text-align: right;
    }

    .request .yzm-num .my-num .copy span {
        font-size: 12px;
        border-bottom: 1px solid #999;
    }

    .request .request-rule {
        margin-top: 20px;
    }

    .request .request-rule {
        font-size: 12px;
    }

    .request .request-rule .rule {
        padding: 0 20px;
        letter-spacing: 1px;
    }

    .request .mint-cell-allow-right::after {
        width: 8px !important;
        height: 8px !important;
        right: 20px !important;
    }

    .request .mint-cell {
        border-bottom: 1px solid #e0e0e0 !important;
    }

    .request .mint-cell-wrapper {
        font-size: 14px !important;
    }

    .request .mint-popup-3 {
        width: 80%;
        height: 140px;
        border-radius: 5px;
        padding: 20px;
        font-size: 16px;
    }

    .request .mint-popup-3 p {
        padding-bottom: 20px;
    }

    .request .mint-popup-3 input {
        width: 100%;
        border-bottom: 1px solid #999;
    }

    .request .mint-popup-3 div {
        position: absolute;
        right: 20px;
        bottom: 20px;
        color: #e53526;
    }

    .toasted {
        z-index: 9999 !important;
    }
</style>
