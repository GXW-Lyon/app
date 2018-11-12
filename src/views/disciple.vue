<template>
    <div class="disciple">
        <div class="disciple-top">
            <img class="logo" src="../assets/img/0504-a3.png" alt="">
            <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
        </div>
        <div class="content">
            <div class="wrapper" ref="content" :style="{height:wrapperHeight+'px'}">
                <div v-for="item in dataInfoList">
                    <div v-if="item.status>0" class="content-one">
                        <div class="cLeft">
                            <div>{{item.nickName}}</div>
                            <div class="date">{{item.date}}</div>
                        </div>
                        <div class="cCenter"><span>{{item.goldSum}}</span>金币</div>
                        <div v-if="item.status==2" class="cRight">
                            <mt-button class="btn" type="danger" @click="inviteOnline(2,item.did,item.nickName)">唤醒</mt-button>
                        </div>
                        <div v-if="item.status==1" class="cRight">
                            <mt-button class="btn" type="danger" @click="inviteOnline(1,item.did,item.nickName)">邀上线</mt-button>
                        </div>
                    </div>
                    <div v-else class="content-two">
                        <div class="two-left">
                            <div>{{item.nickName}}</div>
                            <div class="date">{{item.date}}</div>
                        </div>
                        <div class="two-right"><span>{{item.goldSum}}</span>金币</div>
                    </div>
                </div>
            </div>
        </div>
        <img v-if="noDisPic" class="noDisPic" src="../assets/img/nonet.png" alt="">
    </div>
</template>
<script>
    export default {
        name: 'income',
        data() {
            return {
                wrapperHeight: '',
                dataInfoList: [],
                link: '',
                content: '',
                title: '',
                sharesss: '',
                noDisPic: false,
                uploadInfo:{
                    channel:4,
                    action:8,
                    category:'wakeup',
                    nick:'',
                },
            };
        },
        created() {
            // this.id = JSON.parse(localStorage.getItem('kdtt')).uuid;
            this.discipleList();
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top;
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            /*徒弟列表*/
            discipleList() {
                this.creatSiagn(this.apiUrl.mentorList);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.mentorList,
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.dataInfoList = res.data.listDisciple;
                        if (res.data.discipleSum == 0) {
                            this.noDisPic = true;
                        }
                    }
                }).catch();
            },
            /*邀请上线*/
            inviteOnline(type, did,nickName) {
                this.uploadInfo.nick=nickName;
                var _this = this;
                plus.share.getServices(function (s) {
                    _this.sharesss = s;
                    console.log(_this.sharesss);
                });
                this.creatSiagn(this.apiUrl.shareAwaken);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.shareAwaken,
                    params: {did: did, type: type},
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.link = res.data.link;
                        this.content = res.data.content;
                        this.title = res.data.title;
                        this.sysShareWX();
                    }
                }).catch();
            },
            //调用系统分享给微信好友
            sysShareWX() {
                if (!this.isWeixin()) {
                    return false;
                }
                this.pointUpload(this,this.uploadInfo);
                let _this = this;
                //导入Java类对象
                var Context = plus.android.importClass('android.content.Intent');
                //获取应用主Activity
                var Main = plus.android.runtimeMainActivity();
                //将类Context的这个行为(Action)ACTION_SEND，赋给shareIntent
                var shareIntent = new Context(Context.ACTION_SEND);
                //***以下两种写法是一样的
                //plus.android.invoke(shareIntent,"setType","text/plain");
                //plus.android.invoke(shareIntent,"putExtra",Context.EXTRA_TEXT,_this.content);
                //设置分享类型
                shareIntent.setType('text/plain');
                //设置分享文本
                shareIntent.putExtra(Context.EXTRA_TEXT, _this.content);
                //***以上两种写法是一样的
                //指定分享的包名
                shareIntent.setPackage('com.tencent.mm');
                Main.startActivity(Context.createChooser(shareIntent, '分享'));
            },
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

    .disciple {
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
    }

    .disciple .disciple-top {
        height: 44px;
        width: 100%;
        background: #e53526;
        position: relative;
        top: 0;
        left: 0;
    }

    .disciple .disciple-top .logo {
        height: 24px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .disciple .disciple-top .return {
        /*width: 14px;*/
        text-align: center;
        /*margin-left: 24px;*/
        /*margin-top: 8px;*/
        float: left;
        height: 100%;
        padding: 10px 15px;
    }

    .disciple .disciple-top .return img {
        width: 32%;
        vertical-align: middle;
    }

    .disciple .content .wrapper {
        overflow-y: auto;
    }

    .disciple .content .content-one {
        display: flex;
        align-items: center;
        padding: 10px 30px 10px 30px;
        margin-top: 10px;
        background: #fff;
    }

    .disciple .content .content-one .cLeft {
        flex: 2;
        line-height: 26px;
        font-size: 14px;
    }

    .disciple .content .content-one .cLeft .date {
        font-size: 12px;
        color: #9a9a9a;
    }

    .disciple .content .content-one .cCenter {
        flex: 1;
        font-size: 12px;
    }

    .disciple .content .content-one .cCenter span {
        color: #e53526;
    }

    .disciple .content .content-one .cRight {
        flex: 1;
        text-align: right;
    }

    .disciple .content .content-one .cRight .btn {
        font-size: 14px !important;
        padding: 0px 0px !important;
        height: 31px !important;
        width: 54px !important;
    }

    .disciple .content .content-two {
        display: flex;
        align-items: center;
        padding: 10px 30px 10px 30px;
        margin-top: 10px;
        background: #fff;
    }

    .disciple .content .content-two .two-left {
        flex: 1;
        line-height: 26px;
        font-size: 14px;
    }

    .disciple .content .content-two .two-left .date {
        color: #9a9a9a;
        font-size: 12px;
    }

    .disciple .content .content-two .two-right {
        flex: 1;
        text-align: right;
        font-size: 12px;
    }

    .disciple .content .content-two .two-right span {
        color: #e53526;
    }

    .disciple .noDisPic {
        width: 60%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 54px;
    }
</style>

