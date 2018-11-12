<template>
    <div class="myName">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">昵称</span>
        </div>
        <div class="none-box"></div>
        <div class="m-searchbar-inner name-top">
            <input type="text" placeholder="请输入您的新昵称" class="mint-searchbar-core" v-model="nickName" maxlength="16">
        </div>
        <!-- <div class="m-searchbar-inner">
            <input type="search" placeholder="取个新名字可以让生活变得棒棒哒。。。" class="mint-searchbar-core">
        </div> -->
        <!-- <button class="mint-button mint-button--danger m-button" @click="creatSiagn"><label class="mint-button-text">提交</label></button> -->
        <mt-button @click="modifyName" class="mint-button mint-button--danger m-button" size="large">提交</mt-button>
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
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            modifyName() {
                var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
                if(this.nickName.match(regRule)) {
                    this.nickName = this.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
                    Toast({
                        message: '昵称不能包含表情',
                        position: 'bottom'
                    });
                    return false;
                }
                if(this.nickName.trim() == ''){
                    Toast({
                        message: '昵称不能为空',
                        position: 'bottom'
                    });
                    return false;
                }
                this.myUpload('sys_setting_update_nick',{
                    nick:this.nickName,
                    action:7,
                });
                this.creatSiagn(this.apiUrl.userUpdateNick);
                this.secNickName = this.nickName;
                this.secNickName = this.encrypt(this.secNickName,this.userKey);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign,data:this.secNickName};
                this.$http({
                    method:'post',
                    url:this.apiUrl.userUpdateNick,
                    params:this.dataList
                }).then(res=>{
                    if(res.status == 200){
                        console.log(res);
                        if(res.data.status==1){
                            // this.secNickName = this.decrypt(this.secNickName,this.userKey);
                            var kdtt = localStorage.getItem('kdtt');
                            kdtt = JSON.parse(kdtt);
                            kdtt.userName = this.nickName;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
                            this.$store.state.userName = this.nickName;
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                            this.$router.push({path:'setup'});
                        }else{
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                        }
                    }
                }).catch();
            },
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
        width: 80% !important;
        height: 45px !important;
        border-radius: 25px !important;
        margin: 45px auto !important;
        font-size: 20px !important;
    }
</style>
