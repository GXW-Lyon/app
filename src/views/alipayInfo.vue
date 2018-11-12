<template>
    <div class="myName">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">绑定支付宝</span>
        </div>
        <div class="none-box"></div>
        <!--<div class="m-searchbar-inner name-top">-->
            <!--<input type="text" placeholder="请输入您的新昵称" class="mint-searchbar-core" v-model="nickName" maxlength="16">-->
            <!--<input type="text" placeholder="请输入您的新昵称" class="mint-searchbar-core" v-model="nickName" maxlength="16">-->
        <!--</div>-->
        <mt-field label="支付宝账户" placeholder="输入账号" v-model="account" class="aliAccount ali_info"></mt-field>
        <mt-field label="账户姓名" placeholder="输入姓名" v-model="nickName" class="ali_info"></mt-field>
        <!-- <div class="m-searchbar-inner">
            <input type="search" placeholder="取个新名字可以让生活变得棒棒哒。。。" class="mint-searchbar-core">
        </div> -->
        <!-- <button class="mint-button mint-button--danger m-button" @click="creatSiagn"><label class="mint-button-text">提交</label></button> -->
        <mt-button @click="bindAli" class="mint-button mint-button--danger m-button" size="large">提交</mt-button>
        <p class="aliSet" @click="aliSet">注册支付宝，领10元新手红包</p>
        <div class="tip">
            <div class="tip_title">
                <span class="aliLine"></span><!--
                --><span class="lineTxt">提示</span><!--
                --><span class="aliLine"></span>
            </div>
            <div class="tip_content">
                <p>1.为确保提现审核成功，请勿频繁更换账号</p>
                <p>2.请确保支付宝账户已实名认证，并填写真实姓名做提现认证</p>
                <p>3.口袋头条承诺不会向任何人透露您的个人信息</p>
            </div>
        </div>
    </div>
</template>
<script>
    import crypto from 'crypto';
    import CryptoJS from 'crypto-js';
    import { Toast } from 'mint-ui';
    export default {
        name: 'myname',
        data() {
            return {
                nickName:'',
                account:'',
                dataList:{},
                saign:'',
                times: '',
                uuid: '',
                token: '',
                dataList:{},
                userKey:'',
                secNickName:''
            };
        },
        created(){
            this.account=this.$route.query.account;
            this.nickName=this.$route.query.userName;
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            bindAli(){
                if(this.account==''){
                    Toast({
                        message: '请输入支付宝账号',
                        position: 'bottom'
                    });
                    return false;
                }else if(this.nickName==''){
                    Toast({
                        message: '请输入账户姓名',
                        position: 'bottom'
                    });
                    return false;
                }
                this.myUpload('withdraw_set_alipay',{
                    alipay:this.account,
                    name:this.nickName,
                    action:7,
                });
                this.creatSiagn(this.apiUrl.cashBindAccount);
                let userInfo=JSON.stringify({account:this.account,type:'1',realName:this.nickName});
                this.$http({
                    method:'post',
                    url:this.apiUrl.cashBindAccount,
                    data:{data:this.encrypt(userInfo,this.userKey)},
                    headers: {'uuid': this.uuid,'times':this.times,'sign':this.saign},
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        if(res.data.status == 1){
                            this.$router.go(-1);
                        }else{
                            Toast({
                                message: res.data.message,
                                position: 'center'
                            });
                        }
                    }
                }).catch();
            },
            aliSet(){
                var url='https://render.alipay.com/p/f/jfxb4alj/pages/receive-redpacket/index.html?shareUserId=2088131735280635&sceneCode=CommerceService&partnerId=816penghui&shareChannel=QRCode';
                var w = plus.webview.open(url, 'ali');
            }
        }
    };
</script>
<style>
    .myName {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
    }
    .myName .top-banner {
        width: 100%;
        height: 44px;
        background-color: #fff;
    }

    .myName .top-banner .ret-btn {
        width: 36px;
        height: 100%;
        float: left;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }

    .myName .top-banner .ret-btn img {
        width: 10px;
        vertical-align: middle;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .myName .top-banner span {
        float: left;
        line-height: 46px;
        font-size: 18px;
        vertical-align: middle;
        padding-left: 5px;
    }
    .myName .m-header {
        height: 60px;
        background: #fff;
        color: #000;
        font-size: 20px;
        text-align: left;
        white-space: nowrap;
        line-height: 1;
        padding: 0 10px;
        position: relative;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        -webkit-box-align: center;
    }

    .myName .m-back {
        font-size: 26px;
    }

    .myName .none-box {
        width: 100%;
        height: 20px;
        background: #f2f4f1;
    }

    .myName .m-searchbar-inner {
        box-sizing: border-box;
        border-bottom: 1px solid #e0e0e0;
        height: 45px;
        padding: 6px 10px 6px 20px;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;
        border-radius: 2px;
        display: flex;
        -webkit-box-flex: 1;
        flex: 1;
    }

    .myName .m-button {
        width: 88% !important;
        height: 45px !important;
        border-radius: 8px !important;
        margin: 45px auto !important;
        font-size: 20px !important;
    }
    .ali_info .mint-cell-wrapper{
        padding:0;
        margin:0 20px;
        background-image:none!important;
    }
    .aliAccount .mint-cell-wrapper{
        /*border-bottom:1px solid #d3d3d3;*/
    }
    .mint-cell-text{
        color:#333;
    }
    .mint-field-core{
        font-size: 13px;
        color:#666;
    }
    .tip{
        padding:0 20px;
        margin:90px 0;
    }
    .tip_title{
        height:40px;
        line-height: 40px;
    }
    .tip_title span{
        display: inline-block;
        vertical-align: middle;
    }
    .aliLine{
        width:35%;
        height:1px;
        background: #999;
    }
    .lineTxt{
        width:30%;
        text-align: center;
        font-size:14px;
        color:#999;
    }
    .tip_content{
        padding: 0 5px;
    }
    .tip_content p{
        line-height: 20px;
        font-size:12px;
        color:#999;
    }
    .aliSet{
        text-align:center;
        font-size: 14px;
        color:#333;
    }
</style>
