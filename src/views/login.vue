<template>
    <div class="login">
        <div class="log-close" @click="backPersonal"><img src="../assets/img/x.png" alt=""></div>
        <div class="login-title"><span class="big-text">登录</span>口袋头条</div>
        <div class="login-info">
            <div class="mi-searchbar-inner">
                <input type="number" placeholder="输入手机号" oninput="value.length>11?value=value.slice(0, 11):null"
                       class="mint-searchbar-core" v-model="phoneNumber">
            </div>
            <div class="mi-searchbar-inner sendYm">
                <input type="search" placeholder="请输入验证码" class="mint-searchbar-core yymm" v-model="yzmNumer">
                <div class="yzma" @click="sendCode" v-show="yzmShow">获取验证码</div>
                <div class="down-time" v-show="downTime" ref="time"></div>
            </div>
            <mt-button class="btn-text" type="danger" @click.native="openIndicatorWithText">登录</mt-button>
            <div class="lg-secret">未注册手机验证后自动登录</div>
        </div>
        <div class="login-bottom">
            <div class="others">
                <div class="lgb-text">第三方账号直接登录</div>
            </div>
            <div class="lgb-pic">
                <img class="img1" src="../assets/img/weixin.png" alt="" @click="authsList">
                <!--<img class="img2" src="../assets/img/qq.png" alt="">-->
            </div>
            <div class="lgb-secret">
                <input id="radio" type="checkbox" v-model="checked" name="radio" value=""/>
                <img src="../assets/img/yisi.png" alt="" @click="agreement">
            </div>
        </div>
    </div>
</template>
<script>
    import {Indicator,Toast} from 'mint-ui';
    import CryptoJS from 'crypto-js';
    export default {
        name: 'login',
        data() {
            return {
                yzmShow: true,
                downTime: false,
                nowTime: '',
                phoneNumber: '',
                yzmNumer: '',
                timer: '',
                timers: '',
                auths: {},
                checked: true,
                isBack: false,
                differ: 0,
            };
        },
        created() {
            this.serviceTime();
        },
        methods: {
            //获取服务器时间戳
            serviceTime(){
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                $.ajax({
                    url:'http://api.55duanzi.com/tt/api/user/time',
                    type:'get',
                    headers:{
                        'uuid':uuid
                    },
                    success:function (res) {
                        var time=Date.parse(new Date()).toString().slice(0,10);
                        var differ=res.timestamp-time;
                        localStorage.setItem('timestamp', differ);
                        console.log('login存储'+localStorage.getItem('timestamp'));
                    },
                    error:function(){
                        localStorage.setItem('timestamp', 0);
                    }
                })
            },
            //更新本地与服务器的时间戳差
            updateDiffer(){
                this.differ = parseInt(localStorage.getItem('timestamp')) || 0;
                console.log('本地'+parseInt(localStorage.getItem('timestamp')));
            },
            //发送验证码
            sendCode() {
                if (this.phoneNumber == '' || !(/^1(3|4|5|7|8|9)\d{9}$/.test(this.phoneNumber))) {
                    Toast({
                        message: '手机号不符合规则，请重新输入！',
                        position: 'bottom',
                        className:'phoneYZ'
                    });
                    return false;
                }
                this.loginUpload('login_code',{
                    mobile:this.phoneEncrypt(this.phoneNumber)
                });
                this.yzmShow = false;
                this.downTime = true;
                this.updateDiffer();
                this.nowTime = Date.parse(new Date()) / 1000 + this.differ;
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
                    params: {phone: this.encrypt(this.phoneNumber, this.nowTime + 'Th6F0h'), times: this.nowTime}
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        // clearInterval(this.timer);
                        if (res.data.status == 2) {
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
            backPersonal() {
                this.$router.go(-1);
            },
            //验证码登陆
            openIndicatorWithText() {
                if (this.checked == false) {
                    Toast({
                        message: '请勾选用户协议',
                        position: 'bottom'
                    });
                    return false;
                }
                if (this.yzmNumer == '') {
                    Toast({
                        message: '验证码不能为空',
                        position: 'bottom'
                    });
                    return false;
                }
                if (this.phoneNumber == '' || !(/^1(3|4|5|7|8|9)\d{9}$/.test(this.phoneNumber))) {
                    Toast({
                        message: '手机号不符合规则，请重新输入！',
                        position: 'bottom',
                        className:'phoneYZ'
                    });
                    return false;
                }
                this.loginUpload('login_start',{
                    mobile:this.phoneEncrypt(this.phoneNumber),
                    code:this.yzmNumer,
                });
                clearInterval(this.timer);
                Indicator.open('登录中...');
                this.updateDiffer();
                this.nowTime = Date.parse(new Date()) / 1000 + this.differ;
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userLogin,
                    params: {
                        phone: this.encrypt(this.phoneNumber, this.nowTime + 'Th6F0h'),
                        code: this.encrypt(this.yzmNumer, this.nowTime + 'Th6F0h'),
                        deviceID: this.encrypt(this.$store.state.deviceuuid, this.nowTime + 'Th6F0h'),
                        channelCode: '渠道号',
                        mobileModel: this.encrypt(this.$store.state.devicemodel, this.nowTime + 'Th6F0h'),
                        times: this.nowTime
                    }
                }).then(res => {
                    if (res.status == 200) {
                        if (res.data.status == 1) {
                            Indicator.close();
                            var uuid = res.data.uuid;
                            var encrypted = res.data.sign;
                            var key = res.data.times + 'kt0Atd';
                            var token = this.decrypt(encrypted, key);
                            var sTime = Date.parse(new Date());
                            var kdtt = new Object();
                            kdtt.uuid = uuid;
                            kdtt.sTime = sTime;
                            kdtt.token = token;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
                            this.$router.go(-1);
                        } else {
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
            //勾选用户协议
            authsList() {
                if (this.checked == false) {
                    Toast({
                        message: '请勾选用户协议',
                        position: 'bottom'
                    });
                    return false;
                }
                this.auths = {};
                let _this = this;
                plus.oauth.getServices(function (services) {
                    _this.auths.aList = services;
                    _this.weixinLogin();
                }, function (e) {
                    plus.nativeUI.toast('获取第三方服务列表失败');
                });
            },
            //微信登陆
            weixinLogin() {
                console.log(this.auths);
                if (!this.isWeixin()) {
                    return false;
                }
                let s = new Object();
                this.auths.aList.forEach(item => {
                    s = item.id == 'weixin' ? item : null;
                });
                let _this = this;
                console.log(s);
                if (!s.authResult) {
                    try {
                        this.loginUpload('wx_login');
                        Indicator.open('登录中...');
                        s.login(function (e) {
                            console.log(e);
                            // 获取登录操作结果
                            s.getUserInfo(function (e) {
                                console.log('获取用户信息成功：' + JSON.stringify(s.userInfo));
                                _this.wxUserInfoUpload(s.userInfo);
                                //注销登录授权认证
                                s.logout(function (e) {
                                    console.log('注销登录认证成功！');
                                }, function (e) {
                                    console.log('注销登录认证失败！');
                                });
                            }, function (e) {
                                console.log('获取用户信息失败：' + e.message + ' - ' + e.code);
                                Indicator.close();
                            });
                        }, function (e) {
                            console.log(e);
                            Indicator.close();
//                        if(e.code=="-2"){
//                            plus.runtime.launchApplication({pname:"com.tencent.mm"});
//                            setTimeout(function(){
//                                _this.weixinLogin()//再次执行微信登录
//                            },2000)
//                        }
                        });
                    } catch (err) {
                        console.log('catch' + err + s);
                        plus.nativeUI.toast('已经登录认证！');
                    }
                } else {
                    console.log();
                    plus.nativeUI.toast('已经登录认证！');
                }
            },
            wxUserInfoUpload(userInfo) {
                let device = {
                    deviceID: this.$store.state.deviceuuid,
                    mobileModel: this.$store.state.devicemodel,
                };
                userInfo = JSON.stringify({...this.delKey(userInfo, 'language', 'privilege', 'unionid'), ...device});
                console.log(userInfo);
                this.updateDiffer();
                this.nowTime = Date.parse(new Date()) / 1000 + this.differ;
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userWxLogin,
                    data: {
                        data: this.encrypt(userInfo, this.nowTime + 'Dq2KO0'),
                        times: this.nowTime
                    }
                }).then(res => {
                    Indicator.close();
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
                            var uuid = res.data.uuid;
                            var encrypted = res.data.sign;
                            var key = res.data.times + 'kt0Atd';
                            var token = this.decrypt(encrypted, key);
                            var sTime = Date.parse(new Date());
                            var kdtt = new Object();
                            kdtt.uuid = uuid;
                            kdtt.sTime = sTime;
                            kdtt.token = token;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
//                            this.$router.push({path: 'personal'});
                            this.$router.go(-1);
                        } else {
                            this.clearStorage();
                        }
                    } else {
                        this.clearStorage();
                    }
                }).catch((err) => {
                    Indicator.close();
                    this.clearStorage();
                });
            },
            clearStorage() {
                // localStorage.clear();
                localStorage.removeItem('kdtt');
                plus.nativeUI.toast('服务器繁忙请稍后再试！');
//                this.$router.push({path: 'personal'});
                this.$router.go(-1);
            },
            agreement() {
                this.$router.push({path: 'agreement'});
            },
        }
    };
</script>
<style>
    * {
        margin: 0;
        padding: 0;
    }

    .login-info .btn-text {
        font-size: 20px;
        width: 80%;
        height: 45px;
        border-radius: 25px;
        margin: 20px auto;
        text-align: center;
        display: block;
    }

    .login {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: #fff;
    }

    .log-close {
        width: 4%;
        position: absolute;
        right: 20px;
        top: 20px;
    }

    .log-close img {
        width: 100%;
        vertical-align: middle;
    }

    .login-title {
        width: 100%;
        font-size: 26px;
        color: #e53526;
        padding-top: 20%;
        margin-bottom: 10%;
    }

    .login-title {
        text-align: center;
    }

    .login-title .big-text {
        font-size: 30px;
        padding-right: 2%;
        font-weight: 700;
        color: #e53526;
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

    .sendYm .down-time {
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

    .sendYm .down-time::after {
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


    .login-info .lg-secret {
        text-align: center;
        font-size: 14px;
        color: #9a9a9a;
    }

    .login-bottom {
        margin: 10% 10% 0 10%;
        position: relative;
    }

    .login-bottom .others {
        width: 100%;
        background: url('../assets/img/henggang-1.png') center repeat-x;
        margin: 0 auto;
    }

    .login-bottom .others .lgb-text {
        background: #fff;
        width: 154px;
        margin: 0 auto;
        text-align: center;
        font-size: 16px;
    }

    .login-bottom .lgb-pic {
        text-align: center;
        margin-top: 7%;
    }

    .login-bottom .lgb-pic img {
        width: 20%;
        vertical-align: middle;
    }

    .login-bottom .lgb-pic img:first-child {
        /* margin-right: 15%; */
    }

    .login-bottom .lgb-secret {
        margin-top: 5%;
        text-align: center;
    }

    .login-bottom .lgb-secret img {
        width: 80%;
        vertical-align: middle;
    }

    #radio {
        vertical-align: middle;
        width: 18px;
        height: 18px;
    }
    .phoneYZ{
        width: 100% !important;
        bottom: 0 !important;
        max-width: 100% !important;
        border-radius: 0!important;
        letter-spacing: 1px;
    }
</style>
