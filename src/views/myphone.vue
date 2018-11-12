<template>
    <div class="myPhone">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">{{phonetext}}</span>
        </div>
        <div class="none-box"></div>
        <div class="mi-searchbar-inner">
            <input type="search" placeholder="输入手机号" class="mi-searchbar-core" v-model="phoneNumber">
        </div>
        <div class="mi-searchbar-inner sendYm">
            <input type="search" placeholder="请输入验证码" class="mi-searchbar-core yymm" v-model="yzm">
            <div class="yzma" @click="sendYm" v-show="yzmShow">获取验证码</div>
            <div class="down-time" v-show="downTime" ref="time"></div>
        </div>
        <mt-button class="btn-text" type="danger" @click.native="mofifyPhone">{{phonetext}}</mt-button>
    </div>
</template>
<script>
    import crypto from 'crypto';
    import CryptoJS from 'crypto-js';
    import {Toast} from 'mint-ui';
    export default {
        name: 'myname',
        data() {
            return {
                yzmShow: true,
                downTime: false,
                phoneNumber:'',
                yzm:'',
                saign:'',
                times: '',
                uuid: '',
                token: '',
                dataList:{},
                userKey:'',
                dataList:[],
                phoneYzm:'',
                timer:'',
                timers:'',
                nowTime:'',
                phonetext:''
            };
        },
        created(){
            if(JSON.parse(localStorage.getItem('kdtt')).phoneNumber!=''){
                this.phonetext = '重新绑定手机号'
            }else{
                this.phonetext = '绑定手机号'
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            sendYm() {
                if (this.phoneNumber == '' || !(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNumber))) {
                    Toast({
                        message: '手机号不符合规则，请重新输入！',
                        position: 'bottom',
                        className:'phoneYZ'
                    });
                    return false;
                }
                this.myUpload('sys_setting_bind_phone_code',{
                    mobile:this.phoneEncrypt(this.phoneNumber),
                    action:7,
                });
                this.yzmShow = false;
                this.downTime = true;
                let timestamp=localStorage.getItem('timestamp')!=null?localStorage.getItem('timestamp'):0;
                this.nowTime = Date.parse(new Date()) / 1000+parseInt(timestamp);
                var countDown = 60;
                var _this = this;

                function setTime() {
                    _this.$refs.time.innerText = countDown + 's';
                    countDown--;
                    if (countDown < 10) {
                        countDown = '0' + countDown;
                    }
                    if (countDown == '00') {
                        clearInterval(_this.timer);
                        countDown = 60;
                        _this.yzmShow = true;
                        _this.downTime = false;
                    }
                }

                setTime();
                this.timer = setInterval(() => {
                    setTime();
                }, 1000);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.userGetCode,
                    params: {phone:this.encrypt(this.phoneNumber,this.nowTime+'Th6F0h'),times:this.nowTime}
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        if(res.data.status==2){
                            clearInterval(this.timer);
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                            // this.yzmNumer = '';
                            this.yzmShow = true;
                            this.downTime = false;
                        }
                    }
                }).catch();
            },
            mofifyPhone() {
                clearInterval(this.timer);
                if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNumber))) {
                    Toast({
                        message: '手机号不符合规则，请重新输入！',
                        position: 'bottom',
                        className:'phoneYZ'
                    });
                    return false;
                }
                this.myUpload('sys_setting_bind_phone_start',{
                    mobile:this.phoneEncrypt(this.phoneNumber),
                    code:this.yzm,
                    action:7,
                });
                this.creatSiagn(this.apiUrl.userBindPhone);
                this.phoneYzm = this.phoneNumber+','+this.yzm;
                this.phoneYzm = this.encrypt(this.phoneYzm,this.userKey);
                this.dataList = {uuid: this.uuid, times:this.times, sign: this.saign,data:this.phoneYzm};
                this.$http({
                    method:'post',
                    url:this.apiUrl.userBindPhone,
                    params:this.dataList
                }).then(res=>{
                    if(res.status == 200){
                        if(res.data.status==1){
                            this.phoneNumber = this.decrypt(this.phoneYzm,this.userKey).substring(0, 11);
                            JSON.parse(localStorage.getItem('kdtt')).phoneNumber = this.phoneNumber;
                            this.$store.state.phoneNumber = this.phoneNumber;
                            this.$router.go(-1);
                        }else{
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                                this.yzmNumer = '';
                                this.yzmShow = true;
                                this.downTime = false;
                        }
                    }
                }).catch();
            },
        }
    };
</script>
<style>

    .myPhone .top-banner {
        width: 100%;
        height: 44px;
        background-color: #fff;
    }

    .myPhone .top-banner .ret-btn {
        width: 36px;
        height: 100%;
        float: left;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }
    .myPhone .top-banner .ret-btn img {
        width: 10px;
        vertical-align: middle;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
    .myPhone .top-banner span {
        float: left;
        line-height: 46px;
        font-size: 18px;
        vertical-align: middle;
        padding-left: 5px;
    }
    .myPhone .mi-header {
        height: 60px;
        background: #fff;
        color: #000;
        font-size: 20px;
        text-align: left;
        -webkit-box-align: center;
        white-space: nowrap;
        position: relative;
        line-height: 1;
        padding: 0 10px;
        display: flex;
        align-items: center;
    }
    .myPhone .down-time {
        line-height: 45px;
        text-align: center;
        position: absolute;
        right: 44px;
        top: 50%;
        color: #999;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        padding-left: 15px;
        font-size: 16px;
    }
    .myPhone .down-time::after {
        content: " ";
        position: absolute;
        height: 18px;
        width: 1px;
        left: 0;
        top: 52%;
        transform: translateY(-50%);
        background-color: #9a9a9a;
    }
     .myPhone .btn-text {
        font-size: 20px !important;
        width: 80% !important;
        height: 45px !important;
        border-radius: 25px !important;
        margin: 20px auto !important;
        text-align: center;
        display: block !important;
        outline: 0;
        overflow: hidden;
        position: relative;
        -webkit-appearance: none;
        border: 0;
        padding: 0 12px;
    }
     .proving-box {
        height: 40px;
        width: 100%;
        background: rgba(0, 0, 0, .5);
        color: #fff;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
    }
     .mi-button-icon {
        height: 60px;
        line-height: 60px;
        padding-right: 10px;
        vertical-align: middle;
        display: inline-block;
    }

     .mi-header-title{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: inherit;
        font-weight: 400;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }

     .mintui-back {
        font-size: 26px;
    }

     .none-box {
        width: 100%;
        height: 20px;
        background: #f2f4f1;
    }

    .mi-searchbar-inner {
        box-sizing: border-box;
        margin: 25px auto;
        width: 80%;
        border-radius: 25px;
        border: 1px solid #e0e0e0;
        height: 45px;
        padding: 6px 10px 6px 20px;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;
        display: flex;
        -webkit-box-flex: 1;

    }

    .sendYm {
        position: relative;
    }

    .sendYm .yymm {
        padding-right: 104px;
    }

    .sendYm .yzma {
        line-height: 45px;
        position: absolute;
        right: 15px;
        top: 50%;
        color: #e53526;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        padding-left: 15px;
        font-size: 16px;
    }

    .sendYm .yzma::after {
        content: " ";
        position: absolute;
        height: 18px;
        width: 1px;
        left: 0;
        top: 52%;
        transform: translateY(-50%);
        background-color: #9a9a9a;
        border: 1 rpx solid lightgray;
    }

    .mi-button {
        width: 80%;
        height: 45px;
        border-radius: 25px;
        margin: 20px auto;
        display: block;
        font-size: 18px;
        -webkit-appearance: none;
        outline: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        border-width: 0;
    }

    .mi-searchbar-core{
        -webkit-appearance: none;
        border: 0;
        width: 100%;
        height: 100%;
        outline: 0;
        font-size: 16px;
    }
    .phoneYZ{
        width: 100% !important;
        bottom: 0 !important;
        max-width: 100% !important;
        border-radius: 0!important;
        letter-spacing: 1px;
    }
</style>

