<template>
    <div class="setUp">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">设置</span>
        </div>
        <div class="setInfo">
            <div class="mint-cell touPic" @click="sheetVisible2=true">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">头像</span>
                    </div>
                    <div class="mint-cell-value is-link headPic"><img class="myImg" :src="avatar" alt=""></div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <mt-actionsheet :actions="actions2" v-model="sheetVisible2" cancel-text="取消"></mt-actionsheet>
            <div class="mint-cell" @click="toName">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">昵称</span>
                    </div>
                    <div class="mint-cell-value is-link"><span class="noSet">{{userName ? userName : '未设置'}}</span>
                    </div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <div class="mint-cell" @click="toPhone">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">手机号</span>
                    </div>
                    <div class="mint-cell-value is-link"><span
                        class="noSet">{{phoneNumber ? phoneNumber : '未设置'}}</span></div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <div class="mint-cell" @click="sheetVisible=true">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">性别</span>
                    </div>
                    <div class="mint-cell-value is-link">
                        <span class="noSet" v-if="mySex">{{mySex}}</span>
                        <div class="mint-cell-title yindao_tip" v-else>
                            <span class="noSet">500金币</span>
                            <img class="pimg" src="../assets/img/smallgold.png" alt="" style="width:auto;height: 100%;">
                        </div>
                    </div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <mt-actionsheet :actions="actions" v-model="sheetVisible" cancel-text=""></mt-actionsheet>
            <div class="mint-cell" @click="open('picker')">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">生日</span>
                    </div>
                    <div class="mint-cell-value is-link">
                        <span class="noSet" v-if="mybirthday">{{mybirthday}}</span>
                        <div class="mint-cell-title yindao_tip" v-else>
                            <span class="noSet">300金币</span>
                            <img class="pimg" src="../assets/img/smallgold.png" alt="" style="width:auto;height: 100%;">
                        </div>
                    </div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <mt-datetime-picker
                ref="picker"
                type="date"
                v-model="dateValue"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                :startDate="startDate"
                :endDate="endDate"
                @confirm="handleChange"
                style="z-index:9999">
            </mt-datetime-picker>
        </div>
        <div class="application">
            <div class="mint-cell" @click="authsList">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">微信</span>
                    </div>
                    <div class="mint-cell-value is-link"><span class="noSet">{{wechatName ? wechatName : '未设置'}}</span></div>
                    <i class="mint-cell-gxw"></i>
                </div>
            </div>
            <!--<div class="mint-cell">-->
            <!--<div class="mint-cell-wrapper">-->
            <!--<div class="mint-cell-title">-->
            <!--<span class="mint-cell-text">支付宝</span>-->
            <!--</div>-->
            <!--<div class="mint-cell-value is-link"><span class="noSet">未设置</span></div>-->
            <!--<i class="mint-cell-allow-right"></i>-->
            <!--</div>-->
            <!--</div>-->
        </div>
        <div class="loginOut" @click="loginOut">
            <div class="mint-cell loginOO">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-loginout">退出登录</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import crypto from 'crypto';
    import CryptoJS from 'crypto-js';
    import AlloyCrop from 'alloycrop';

    export default {
        name: 'setup',
        data() {
            return {
                loginT: false,
                loginO: true,
                dateValue: '1985-01-01',
                startDate: new Date('1960-1-1'),
                endDate: new Date(),
                actions: [],
                actions2: [],
                saign: '',
                times: '',
                uuid: '',
                token: '',
                dataList: {},
                userKey: '',
                sheetVisible: false,
                sheetVisible2: false,
                userName: '',
                phoneNumber: '',
                mybirthday: '',
                wechatName:'',
                wechatNameCache:'',
                mySex: '',
                fileUrl: null,
                avatar:require('../assets/img/hhhhhhhhhhhhh.png'),
                IMAGE_UNSPECIFIED:"image/*",
                main:null,
                Intent:null,
                MediaStore:null,
                File:null,
                Uri:null,
                userKey:''
            };
        },
        created() {
            // this.abcde();
            if (JSON.parse(localStorage.getItem('kdtt')) != null) {
                this.userName = JSON.parse(localStorage.getItem('kdtt')).userName;
                this.phoneNumber = JSON.parse(localStorage.getItem('kdtt')).phoneNumber;
                this.mybirthday = JSON.parse(localStorage.getItem('kdtt')).mybirthday;
                this.wechatName = JSON.parse(localStorage.getItem('kdtt')).wechatName;
                this.mySex = JSON.parse(localStorage.getItem('kdtt')).mySex;
                this.avatar = JSON.parse(localStorage.getItem('kdtt')).avatar;
            } else {
                this.loginT = false;
                this.loginO = true;
            }
        },
        methods: {
            // abcde(){
            //     this.$http({
            //         method:'get',
            //         url:this.apiUrl.abc,
            //         params:{}
            //     }).then().catch()
            // },
            toName() {
                if (this.isLogin() == false) {
                    return false;
                }
                this.$router.push({path: 'myname'});
            },
            toPhone() {
                if (this.isLogin() == false) {
                    return false;
                }
                this.$router.push({path: 'myphone'});
            },
            goBack() {
                this.$router.push({path: 'personal'});
            },
            //打开日期选择器
            open(picker) {
                this.$refs[picker].open();
            },
            /*生日*/
            handleChange(value) {
                if (this.isLogin() == false) {
                    return false;
                }
                this.dateValue = this.formatDateTime(value, 'y-m-d');
                this.creatSiagn(this.apiUrl.userUpdateBirthday);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign, data: this.encrypt(this.dateValue, this.userKey)};
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userUpdateBirthday,
                    params: this.dataList
                }).then(res => {
                    if (res.status == 200) {
                        if (res.data.status == 1) {
                            plus.nativeUI.toast(res.data.message);
                            this.mybirthday = this.dateValue;
                            var kdtt = localStorage.getItem('kdtt');
                            kdtt = JSON.parse(kdtt);
                            kdtt.mybirthday = this.mybirthday;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
                            this.$store.state.birthday = this.myBirthday;
                        }
                    }
                }).catch();
            },
            man() {
                this.makeSex(1);
            },
            women() {
                this.makeSex(2);
            },
            //设置性别
            makeSex(sex) {
                if (this.isLogin() == false) {
                    return false;
                }
                this.creatSiagn(this.apiUrl.userUpdateSex);
                sex = this.encrypt(sex.toString(), this.userKey);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign, data: sex};
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userUpdateSex,
                    params: this.dataList
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
                            plus.nativeUI.toast(res.data.message);
                            if (this.decrypt(sex.toString(), this.userKey) == 1) {
                                this.mySex = '男';
                            } else {
                                this.mySex = '女';
                            }
                            var kdtt = localStorage.getItem('kdtt');
                            kdtt = JSON.parse(kdtt);
                            kdtt.mySex = this.mySex;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
                            this.$store.state.mySex = this.mySex;
                        }
                    }
                }).catch();
            },
            //退出
            loginOut() {
                if (this.isLogin() == false) {
                    return false;
                }
                if(this.phoneNumber==''||!this.phoneNumber){
                    MessageBox.confirm('', {
                        message: '您尚未绑定手机号，退出登录有可能会导致账号丢失且无法找回，墙裂建议您绑定手机号后再尝试退出操作',
                        title: '温馨提示',
                        confirmButtonText: '快速绑定',
                        cancelButtonText: '退出登录'
                    }).then(action => {
                        if (action == 'confirm') {     //确认的回调
                            this.toPhone();
                        }
                    }).catch(err => {
                        if (err == 'cancel') {     //取消的回调
                            this.loginOutApi();
                        }
                    });
                }else{
                    MessageBox.confirm('', {
                        message: '确定执行此操作?',
                        title: '提示',
                        confirmButtonText: '取消',
                        cancelButtonText: '确认'
                    }).then(action => {
                        if (action == 'confirm') {     //确认的回调
                            console.log(1);
                        }
                    }).catch(err => {
                        if (err == 'cancel') {     //取消的回调
                            this.loginOutApi();
                        }
                    });
                }
            },
            //退出登录
            loginOutApi(){
                console.log(1);
                this.myUpload('sys_setting_quit');
                let timestamp=localStorage.getItem('timestamp')!=null?localStorage.getItem('timestamp'):0;
                this.times = Date.parse(new Date()) / 1000+parseInt(timestamp);
                this.uuid = JSON.parse(localStorage.getItem('kdtt')).uuid;
                this.token = JSON.parse(localStorage.getItem('kdtt')).token;
                var str1 = this.apiUrl.userQuit + '?';
                var str2 = `times=${this.times}&`;
                var str3 = `uuid=${this.uuid}&`;
                var str4 = 'token=' + this.token + '&';
                var arr = new Array(str2, str3, str4);
                var arr1 = arr.sort();
                for (var i = 0; i < arr1.length; i++) {
                    str1 += arr1[i];
                }
                this.saign = this.getmd5(str1.substring(0, str1.length - 1)).toUpperCase();
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign};
                this.$http({
                    method: 'delete',
                    url: this.apiUrl.userQuit,
                    params: this.dataList
                }).then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
//                            localStorage.removeItem('kdtt');
                            this.deleteStorages(['kdtt']);
                            // localStorage.clear();
                            this.$store.state.userName = '';
                            this.$store.state.phoneNumber = '';
                            this.$store.state.birthday = '';
                            this.$router.push({path: 'personal'});
                        }
                        // localStorage.clear();
                    }
                }).catch();
            },
            //拍照
            takePhoto() {
                var cmr = plus.camera.getCamera();
                var resArr=cmr.supportedImageResolutions;
                var res = resArr[0];
//                var res = resArr[resArr.length-1];
                var fmt = cmr.supportedImageFormats[0];
                console.log('Resolution: ' + res + ', Format: ' + fmt);
                var _this = this;
                cmr.captureImage(function (path) {
                        plus.io.resolveLocalFileSystemURL(path, function (entry) {
//                            _this.appendFile(entry.toLocalURL());//把拍照的目录路径，变成本地url路径，例如file:///........之类的
//                            _this.cutImage(entry.toLocalURL());
                            _this.alloyCrop(entry.toLocalURL());
                        },function (e) {
                            plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                        });
                    },
                    function (error) {
                        console.log('Capture image failed: ' + error.message);
                    },
                    {resolution: res, format: fmt}
                );
            },
            //相册
            openAlbum(){
                plus.gallery.pick((path)=>{
//                    this.appendFile(path);//处理图片的地方
//                    this.cutImage(path);
                    this.alloyCrop(path);
                });
            },
            //裁剪图片(系统裁剪，兼容性不好，已不用)
            cutImage(path){
                let _this=this;
                //变量初始化
                _this.main = plus.android.runtimeMainActivity();
                _this.Intent = plus.android.importClass("android.content.Intent");
                _this.MediaStore = plus.android.importClass("android.provider.MediaStore");
                _this.File = plus.android.importClass("java.io.File");
                _this.Uri = plus.android.importClass("android.net.Uri");
                plus.webview.currentWebview().show();
                //裁剪
                var outPutPath = plus.io.convertLocalFileSystemURL("_doc/5"+parseInt(Math.random()*(99999-10000+1)+1000)+".jpg");
                var file = new _this.File(outPutPath);
                // 输出目录uri
                var outPutUri = _this.Uri.fromFile(file);
                //去掉\\或者file://
                path=path.replace("\\", "");
                path=path.replace("file://", "");
                //判断是否存在
                var _file = new _this.File(path);
                var a = _file.exists();
//                console.log(`判断是否存在:${a}`);
                //绝对路径转uri
                var curCropUri=_this.Uri.fromFile(new _this.File(path));
//                console.log("uri:"+curCropUri);
                //裁切
                var cropIntent = new _this.Intent("com.android.camera.action.CROP");
                cropIntent.setDataAndType(curCropUri, _this.IMAGE_UNSPECIFIED);
                // 截图完毕后 输出目录
                cropIntent.putExtra(_this.MediaStore.EXTRA_OUTPUT, outPutUri);
                cropIntent.putExtra("crop", "true");
                // aspectX aspectY 是宽高的比例
                cropIntent.putExtra("aspectX", 1);
                cropIntent.putExtra("aspectY", 1);
                // outputX outputY 是裁剪图片宽高
                cropIntent.putExtra("outputX", 640);
                cropIntent.putExtra("outputY", 640);
                /*解决图片裁剪后过小时，做填充拉伸产生的黑框（目前没有此问题，待测试）*/
                //cropIntent.putExtra("scale", true);
                //cropIntent.putExtra("scaleUpIfNeeded", true);
                cropIntent.putExtra("return-data", true);
                _this.main.startActivityForResult(cropIntent,1);
                _this.main.onActivityResult = function(requestCode, resultCode, data) {
                    //裁剪成功图片上传
//                    console.log(requestCode);
//                    console.log(requestCode==1);
//                    requestCode==1?_this.main.finishActivity(1):null;
                    _this.appendFile(outPutPath);
                };
            },
            //添加文件(canvas压缩图片并转换base64格式，已不用)
            appendFile(path) {
                var img = new Image();
                img.src = path;        // 传过来的图片路径在这里用。
                var _this=this;
                img.onload = function () {
                    var that = this;
                    //生成比例
                    var w = that.width,
                        h = that.height,
                        scale = w / h;
                    w = 640 || w;  //640  你想压缩到多大，改这里
                    h = w / scale;
                    //生成canvas
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    $(canvas).attr({width: w, height: h});
                    ctx.drawImage(that, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8);//1最清晰，越低越模糊
                    _this.fileUrl = base64;   // 存储base64数据
                    _this.uploadFile();
                };
            },
            //AlloyCrop裁剪图片
            alloyCrop(path){
                let _this=this;
                new AlloyCrop({
                    image_src: path,
                    circle:true, // optional parameters , the default value is false
                    width: 200,
                    height: 200,
                    output:2,
                    ok: function (base64, canvas) {
                        _this.fileUrl = base64;    /*存储base64数据*/
                        _this.uploadFile();
                    },
                    cancel: function () {
                        console.log('取消剪裁');
                        plus.nativeUI.toast('取消剪裁');
                    },
                    ok_text: "确认", // optional parameters , the default value is ok
                    cancel_text: "取消" // optional parameters , the default value is cancel
                });
            },
            //上传文件
            uploadFile(){
                this.creatSiagn(this.apiUrl.userUpdateImage);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign,image:this.fileUrl};
                this.$http({
                    method:'post',
                    url:this.apiUrl.userUpdateImage,
                    headers:{'uuid':this.uuid,'times': this.times, 'sign': this.saign},
                    data:{'image':this.fileUrl}
                }).then(res=>{
                    console.log(res);
                    if(res.status == 200){
                        if(res.data.status==1){
                            plus.nativeUI.toast('头像上传成功');
                            this.avatar =this.decrypt(res.data.message, this.userKey);
                            var kdtt = localStorage.getItem('kdtt');
                            kdtt = JSON.parse(kdtt);
                            kdtt.avatar = this.avatar;
                            localStorage.setItem('kdtt', JSON.stringify(kdtt));
                        }else{
                            plus.nativeUI.toast('头像上传失败');
                        }
                    }else{
                        plus.nativeUI.toast('头像上传失败');
                    }
                }).catch(err=>{
                    console.log(err.response.data);
                });
            },
            /*获取auth*/
            authsList(){
                if(!this.isWeixin()){
                    return false;
                }
                this.auths={};
                let _this=this;
                plus.oauth.getServices(function(services){
                    _this.auths.aList = services;
                    _this.weixinLogin();
                    // localStorage.setItem('auths', JSON.stringify(_this.auths));
                }, function(e){
                    plus.nativeUI.toast( "获取第三方服务列表失败");
                });
            },
            /*微信登陆*/
            weixinLogin(){
                    console.log(this.auths);
                    // console.log(this.auths.aList);
                    let s = new Object();
                    this.auths.aList.forEach(item => {
                        s=item.id=='weixin'?item:null;
                    });
                    let _this=this;
                    console.log(s);
                    if ( !s.authResult ) {
                        try{
                            this.myUpload('sys_setting_bind_wechat');
                            s.login( function(e){
                                console.log(e);
                                // 获取登录操作结果
                                s.getUserInfo(function(e) {
                                    console.log("获取用户信息成功：" + JSON.stringify(s.userInfo));
                                    _this.bindWechat(s.userInfo);
                                    //注销登录授权认证
                                    s.logout(function(e){
                                        console.log( "注销登录认证成功！" );
                                    }, function(e){
                                        console.log( "注销登录认证失败！" );
                                    });
                                }, function(e) {
                                    console.log("获取用户信息失败：" + e.message + " - " + e.code);
                                });
                            }, function(e) {
                                console.log("获取用户信息失败：" + e.message + " - " + e.code);
                            });
                        }catch(err){
                        plus.nativeUI.toast( "已经登录认证！" );
                    }
                }else{
                    plus.nativeUI.toast( "已经登录认证！" );
                }
            },
            /*绑定微信*/
            bindWechat(userInfo){
                let device={
                    deviceID:this.$store.state.deviceuuid,
                    mobileModel:this.$store.state.devicemodel
                };
                this.wechatNameCache=userInfo.nickname;
                userInfo=JSON.stringify({...this.delKey(userInfo,'language','privilege','unionid'),...device});
                console.log(userInfo);
                let timestamp=localStorage.getItem('timestamp')!=null?localStorage.getItem('timestamp'):0;
                this.nowTime = Date.parse(new Date()) / 1000+parseInt(timestamp);
                this.creatSiagn(this.apiUrl.userBindWechat);
                this.userKey = this.token.substring(0, 16);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userBindWechat,
                    data: {
                        data: this.encrypt(userInfo,this.userKey),
                        times:this.nowTime
                    },
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
                            this.wechatName=this.wechatNameCache;
                            Toast({
                                message: '绑定成功',
                                position: 'bottom'
                            });
                        }else{
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                        }
                    }else{
                        this.clearStorage();
                    }
                }).catch();
            },
            clearStorage(){
                plus.nativeUI.toast( "服务器繁忙请稍后再试！" );
            },
        },
        mounted() {
            this.actions = [{
                name: '男',
                method: this.man
            }, {
                name: '女',
                method: this.women
            }];
            this.actions2 = [{
                name: '拍照',
                method: this.takePhoto
            }, {
                name: '从相册中选择',
                method: this.openAlbum
            }];
        }
    };
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

    .setUp {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
    }

    .setUp .top-banner {
        width: 100%;
        height: 44px;
        background-color: #fff;
    }

    .setUp .top-banner .ret-btn {
        width: 36px;
        height: 100%;
        float: left;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }

    .setUp .top-banner .ret-btn img {
        width: 10px;
        vertical-align: middle;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .setUp .top-banner span {
        float: left;
        line-height: 46px;
        font-size: 18px;
        padding-left: 5px;
    }

    .setUp .setInfo {
        margin-top: 4%;
        margin-bottom: 4%;
        background-color: #fff;
    }

    .setUp .application {
        background-color: #fff;
    }

    .setUp .touPic {
        min-height: 64px;
    }

    .setUp .myImg {
        width: 40px;
    }

    .mint-cell-gxw::after {
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

    .setUp .mint-cell {
        padding-left: 20px !important;
        border-bottom: 1px solid #eee !important;
    }

    .setUp .mint-cell-value.is-link {
        margin-right: 32px !important;
    }

    .setUp .noSet {
        color: #ed2d15;
    }

    .setUp .mint-cell-wrapper {
        background-image: none !important;
        font-size: 14px !important;
    }

    .setUp .loginOut {
        margin-top: 20px;
        color: #ed2d15;
        text-align: center;
    }

    .setUp .loginOO {
        padding-left: 0 !important;
    }
    .headPic{
        width:40px;
        height:40px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        overflow: hidden;
    }
    .mint-cell-loginout{
        font-size: 18px ;
    }
    .yindao_tip{
        text-align:right;
        height: 20px;
    }
    .yindao_tip span{
        vertical-align: middle;
        font-size:14px;
        margin-right: 5px;
        height:20px;
        line-height:20px;
        display:inline-block;
        color: #666;
    }
    .yindao_tip img{
        vertical-align: top;
    }
</style>

