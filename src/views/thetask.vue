<template>
    <div class="thetask">
        <!-- <div class="thetask-top"> -->
        <!-- <img class="logo" src="../assets/img/taskcenter.png" alt=""> -->
        <!-- <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt=""> -->
        <!-- </div> -->

        <div class="thetask-content">
            <div class="thetask-wrapper" ref="mainContent" :style="{height:wrapperHeights+'px'}">
                <div class="toppicBg">
                    <div class="loopBanner">
                        <div class="swiper-container" id="loopBanSwiper">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="item in $store.state.cashLists">{{item}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="thetask-banner" @click="sianPicSrc?signTask():null">
                        <div class="gold-wrapper">
                            <img :class="{'move':sianPicSrc}" :src="saignPic" alt="">
                            <div id="tsxtgolds" :class="{'move':sianPicSrc}">
                                <div :class="[isDisabled ? 'fuckingGold' : 'fuckingGoldWite']">{{fuckGold}}</div>
                            </div>
                            <!-- <img v-if="!sianPicSrc" src="../assets/img/taskgold1.png" alt=""> -->
                        </div>
                        <div class="flotbox">连续签到有惊喜</div>
                        <!-- <img class="flotbox" src="../assets/img/suprise.jpg" alt=""> -->
                        <!-- <div class="gold-wrapper" v-if="false">
                            <img src="../assets/img/taskgold1.png" alt="">
                        </div> -->
                    </div>
                    <div class="task-register clearfloat">
                        <div class="receive-gold" v-for="(items,index) in daysList">
                            <div>
                                <img :src="items.src" alt="">
                                <!-- <div class="signGold">
                                  <div>+50</div>
                                </div> -->
                            </div>
                            <div class="date">{{items.date}}</div>
                        </div>
                    </div>
                </div>
                <div class="taskad-banner">
                    <div class="swiper-container" id="taskAdSwiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="(item,index) in $store.state.TaskAdvertLists" v-if="index==0">
                                <img :src="item.imgs[0].src" alt="" @click="taskRequest">
                            </div>
                            <div class="swiper-slide" v-for="(item,index) in $store.state.TaskAdvertLists" v-if="index>0">
                                <iframe v-if="item.type=='lm'" :key="item.adId" class="sogouAd" referrerpolicy="origin" frameborder="0" :src="item.url"></iframe>
                                <img v-else :src="item.imgs[0].src" alt="" @click="taskLoadApks(item.url,item.adId,item.topic,item.type,item.map,item.imgs[0],item.source)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="day-task">
                    <div class="title">
                        <span>新手任务</span>
                    </div>
                    <div class="cWrapper" v-for="(item,index) in $store.state.newTaskList">
                        <div class="dayTasks" @click="newCheckout(index)">
                            <div class="task-text">{{item.name}}</div>
                            <div class="task-golds">+{{item.bouns}}</div>
                            <div class="goldspic">
                                <img src="../assets/img/smallgold.png" alt="">
                            </div>
                            <transition name="rotate">
                                <div class="goldsjt" v-if="item.show">
                                    <img src="../assets/img/taskfh.png" alt="">
                                    <!-- <i class="mint-cell-allow-right"></i> -->
                                </div>
                                <div class="goldsjt1" v-else>
                                    <img src="../assets/img/taskfh2.png" alt="">
                                </div>
                            </transition>
                        </div>
                        <transition name="collapse">
                            <div v-show="item.detail" class="hiddenbox">
                                <div class="detail-left">{{item.desc}}</div>
                                <div class="detail-right" @click="newTaskGo(index)" v-if="item.doneStatus==0">
                                    <img src="../assets/img/btn-task1.png" alt="">
                                    <div class="table">
                                        <div>{{item.btnText}}</div>
                                    </div>
                                </div>
                                <div @click="onceTask(item.type,item.taskCode)" class="detail-right"
                                     v-else-if="item.doneStatus==1">
                                    <img src="../assets/img/btn-task2.png" alt="">
                                </div>
                                <div class="detail-right" v-else="item.doneStatus==2">
                                    <img src="../assets/img/btn-task3.png" alt="">
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="day-task">
                    <div class="title">
                        <span>日常任务</span>
                    </div>
                    <div class="cWrapper">
                        <div class="dayTasks" @click="apkTaskInfoShow">
                            <div class="task-text">下载APP赚金币</div>
                            <div class="task-golds">+10,000,000</div>
                            <div class="goldspic">
                                <img src="../assets/img/smallgold.png" alt="">
                            </div>
                            <transition name="rotate">
                                <div class="goldsjt" v-if="show">
                                    <img src="../assets/img/taskfh.png" alt="">
                                </div>
                                <div class="goldsjt1" v-else>
                                    <img src="../assets/img/taskfh2.png" alt="">
                                </div>
                            </transition>
                        </div>
                        <transition name="collapse">
                            <div v-if="detail" >
                                <div class="apkhiddenbox" v-for="(item,index) in $store.state.wallListItems">
                                    <div class="apkType">
                                        <div class="logo"><img :src="item.picUrl" alt=""></div>
                                        <div class="info">
                                            <div class="logotext">{{item.name}}</div>
                                            <div class="lineH">文件大小：{{item.size}}</div>
                                            <div class="lineH">{{item.disc}}</div>
                                        </div>
                                        <div class="apkGold">
                                            <div class="gNums">
                                                <span>+{{item.bouns}}</span>
                                                <img src="../assets/img/smallgold.png" alt="">
                                            </div>
                                            <div v-if="item.status==2">
                                                <img v-if="$store.state.loadArr[index]" @click="loadingAdApk(item.apkUrl,item.taskId,item.source,index)" src="../assets/img/wallbtndefalut.png" alt="">
                                                <img v-else src="../assets/img/wallbtndefalut1.png" alt="">
                                            </div>
                                            <img @click="getWallGolds(item.taskId)" v-if="item.status==0" src="../assets/img/btn-task2.png" alt="">
                                            <img v-if="item.status==1" src="../assets/img/btn-task3.png" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div class="cWrapper" v-for="(item,index) in $store.state.dayTaskList">
                        <div class="dayTasks" @click="dayCheckout(index)">
                            <div class="task-text">{{item.name}}</div>
                            <div class="task-golds">+{{item.bouns}}</div>
                            <div class="goldspic">
                                <img src="../assets/img/smallgold.png" alt="">
                            </div>
                            <transition name="rotate">
                                <div class="goldsjt" v-if="item.show">
                                    <img src="../assets/img/taskfh.png" alt="">
                                </div>
                                <div class="goldsjt1" v-else>
                                    <img src="../assets/img/taskfh2.png" alt="">
                                </div>
                            </transition>
                        </div>
                        <transition name="collapse">
                            <div v-show="item.detail" class="hiddenbox">
                                <div class="detail-left">{{item.desc}}</div>
                                <div class="detail-right" @click="dayTaskGo (index)" v-if="item.doneStatus==0">
                                    <img src="../assets/img/btn-task1.png" alt="">
                                    <div class="table">
                                        <div>{{item.btnText}}</div>
                                    </div>
                                </div>
                                <div @click="dayTaskGold(item.type,item.taskCode)" class="detail-right"
                                     v-else-if="item.doneStatus==1">
                                    <img src="../assets/img/btn-task2.png" alt="">
                                </div>
                                <div class="detail-right" v-else="item.doneStatus==2">
                                    <img src="../assets/img/btn-task3.png" alt="">
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div class="cWrapper">
                        <div class="dayTasks" @click="loadRequest">
                            <div class="task-text">邀请好友</div>
                            <div class="task-golds">+30000</div>
                            <div class="goldspic">
                                <img src="../assets/img/smallgold.png" alt="">
                            </div>
                            <transition name="rotate">
                                <div class="goldsjt" v-if="show1">
                                    <img src="../assets/img/taskfh.png" alt="">
                                </div>
                                <div class="goldsjt1" v-else>
                                    <img src="../assets/img/taskfh2.png" alt="">
                                </div>
                            </transition>
                        </div>
                        <transition name="collapse">
                            <div v-if="detail1" class="hiddenbox">
                                <div class="detail-left">每邀请1名好友即可获得高额金币奖励，好友阅读文章还会向您进贡额外金币奖励</div>
                                <div class="detail-right" @click="skipRequest">
                                    <img src="../assets/img/btn-task1.png" alt="">
                                    <div class="table">
                                        <div>立即邀请</div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <div class="getGolds" v-if="moreRecom">
            <div class="SignGoldContent">
                <div class="fuckMoreTop">
                    <div class="fanhui" @click="hideMore">
                        <img src="../assets/img/x.png" alt="">
                    </div>
                    <div class="signGoldTop clearfloat">
                        <div class="signGoldTop-left">
                            <img src="../assets/img/yindaojinbi.png" alt="">
                        </div>
                        <div class="signGoldTop-right">
                            <div class="title">签到成功</div>
                            <span>恭喜您获得<span class="gold">{{fuckGold}}金币</span></span>
                        </div>
                    </div>
                    <img class="explainBg" src="../assets/img/explainBg.png" alt="">
                </div>
                <div class="fuckCon" :style="{height:fuckTaskHeight+'px'}">
                    <div class="moreInfo" v-for="item in moreRecomList">
                        <div v-if="item.imgs.length==3" @click="see(item.url,item.pk,item.topic,item.type,item.map,item.imgs[0])">
                            <div class="moreInfo-one">
                                <div class="moreInfo-one-title">
                                    {{item.topic}}
                                </div>
                                <div class="moreInfo-one-pic-wra clearfloat">
                                    <div class="moreInfo-one-pic" v-for="list in item.imgs">
                                        <img class="page-lazyload-image" v-lazy="list.src" alt="">
                                    </div>
                                </div>
                                <div class="moreInfo-one-text">
                                    <span>{{item.source}}</span>
                                    <span class="date">{{item.date}}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="item.imgs.length==1" @click="see(item.url,item.pk,item.topic,item.type,item.map,item.imgs[0])">
                            <div class="moreInfo-two clearfloat">
                                <div class="left">
                                    <div v-for="list in item.imgs">
                                        <img class="page-lazyload-image" v-lazy="list.src" alt="">
                                    </div>
                                </div>
                                <div class="right">
                                    <p class="tile">{{item.topic}}</p>
                                    <div class="text">
                                        <span class="source">{{item.source}}</span>
                                        <span class="date">{{item.date}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cliMoreCons">
                    <div class="clickMore" @click="goIndex">点击查看更多</div>
                </div>
            </div>
        </div>
        <div class="getGoldsBg" v-if="moreRecom"></div>
        <share
            :shareInfo="{url:inviteUrl+invitateCode,title:shareTitle,content:shareContent,type:taskType,uploadInfo:uploadInfo}"
            v-on:reloadTaskList="taskList"></share>
        <float></float>
        <bottom-nav></bottom-nav>
    </div>
</template>
<script>
    import topsearch from 'components/topSearch';
    import bottomNav from 'components/bottomNav';
    import float from 'components/float';
    import {Toast} from 'mint-ui';
    import share from 'components/share';
    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.min.css';

    export default {
        name: 'true',
        data() {
            return {
                moreRecom:false,
                wrapperHeights: '',
                show: true,
                detail: false,
                show1: true,
                detail1: false,
                isDisabled: true,
                shareTitle: '',
                shareContent: '',
                invitateCode: '',
                inviteUrl: '/shareOne.html?code=',
                auths: {},
                taskType: '',
                sianPicSrc: true,
                saignPic: require('../assets/img/hhhhhhhhhhhhh.png'),
                daysList: [
                    {date: '1天', src: require('../assets/img/50.png')},
                    {date: '2天', src: require('../assets/img/100.png')},
                    {date: '3天', src: require('../assets/img/300.png')},
                    {date: '4天', src: require('../assets/img/888.png')},
                    {date: '5天', src: require('../assets/img/150.png')},
                    {date: '6天', src: require('../assets/img/200.png')},
                    {date: '7天', src: require('../assets/img/2888.png')},
                ],
                // sianPicSrc: require("../assets/img/taskgold.png"),
                week: 0,
                weeks: [],
                uploadInfo: {
                    channel: 3,
                    action: 8,
                    task: ''
                },
                zhouSaignList: [],
                fuckGold: '',
                fuckTaskHeight:0,
                moreRecomList:[],
                wallListItems:[],
            };
        },
        components: {
            topsearch,
            bottomNav,
            float,
            share
        },
        mounted() {
            this.fuckTaskHeight = document.documentElement.clientHeight*0.65-140;
            this.wrapperHeights = document.documentElement.clientHeight - 44;
            var _this = this;
            var taskAdSwiper = new Swiper('#taskAdSwiper', {
                    direction : 'horizontal',
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:false,//修改swiper的父元素时，自动初始化swiper 
                    noSwiping : true,
                    resistanceRatio: 0,
                    autoplay: {
                        delay:3000,
                        disableOnInteraction: false,
                    },
            })
            var LoopSwiper = new Swiper('#loopBanSwiper', {
                on: {
                    slideChangeTransitionStart: function () {
                    },
                    slideChangeTransitionEnd: function () {
                        if (this.isEnd) {
                            // console.log('last：' + this.isEnd);
                        }
                    }
                },
                direction : 'vertical',
                autoplay: {delay:1000},//可选选项，自动滑动
                loop : true,
                allowTouchMove: false,
                speed:500,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:false,//修改swiper的父元素时，自动初始化swiper
            });
        },
        created() {
            this.inviteUrl = this.$store.state.shareDomain + this.inviteUrl;
            if (JSON.parse(localStorage.getItem('kdtt')) != null) {
                this.taskList();
                this.invitateCode = JSON.parse(localStorage.getItem('kdtt')).invitateCode;
                if (this.$store.state.signList.length == 0) {
                    this.signTaskList();
                } else {
                    if (this.$store.state.signCompleted) {
                        this.saignPic = require('../assets/img/taskgold1.png');
                        this.sianPicSrc = false;
                        this.isDisabled = false;
                        switch (this.$store.state.signList.length) {
                            case 1:
                                this.fuckGold = 50;
                                break;
                            case 2:
                                this.fuckGold = 100;
                                break;
                            case 3:
                                this.fuckGold = 300;
                                break;
                            case 4:
                                this.fuckGold = 888;
                                break;
                            case 5:
                                this.fuckGold = 150;
                                break;
                            case 6:
                                this.fuckGold = 200;
                                break;
                            case 7:
                                this.fuckGold = 2888;
                                break;
                        }
                    } else {
                        this.saignPic = require('../assets/img/biggoldbg.png');
                        this.sianPicSrc = true;
                        this.isDisabled = true;
                        switch (this.$store.state.signList.length) {
                            case 0:
                                this.fuckGold = 50;
                                break;
                            case 1:
                                this.fuckGold = 100;
                                break;
                            case 2:
                                this.fuckGold = 300;
                                break;
                            case 3:
                                this.fuckGold = 888;
                                break;
                            case 4:
                                this.fuckGold = 150;
                                break;
                            case 5:
                                this.fuckGold = 200;
                                break;
                            case 6:
                                this.fuckGold = 2888;
                                break;
                        }
                    }
                    this.$store.state.signList.forEach((ele, index) => {
                        var s = ele - 1;
                        this.daysList[s].src = require('../assets/img/golds' + (s) + '.png');
                    });
                }
            } else {
                this.saignPic = require('../assets/img/biggoldbg.png');
                this.sianPicSrc = true;
                this.fuckGold = 50;
            }
            if(this.$store.state.newAndDayTaskState){
                 this.TaskAdvertList();
                 this.getTaskInfo();
                 this.cashList();
                 this.wallList();
            }
            this.$nextTick(function () {
                //重置scrollTop
                let scrollTop = sessionStorage.getItem('thetaskScroll');
                if(scrollTop){
                    $('.thetask-wrapper').scrollTop(parseInt(scrollTop));
                }
            });
        },
        methods: {
            /*广告列表*/
            TaskAdvertList(){
                this.$http({
                    method:'get',
                    url:this.apiUrl.adCarousel,
                    params:{imei:this.$store.state.deviceuuid,category:'task'}
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        if(res.data.status==1){
                            this.$store.state.TaskAdvertLists = res.data.list;
                        }
                    }
                }).catch()
            },
            goBack() {
                this.$router.go(-1);
            },
            /*新手任务状态的显示隐藏*/
            newCheckout(index) {
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.$store.state.newTaskList[index].detail = !this.$store.state.newTaskList[index].detail;
                    this.$store.state.newTaskList[index].show = !this.$store.state.newTaskList[index].show;
                }
            },
            /*做新手任务*/
            newTaskGo(index) {
                if (this.$store.state.newTaskList[index].type == 3) {
                    this.authsList(this.$store.state.newTaskList[index].taskCode);
                } else {
                    this.taskUpload(3, this.$store.state.newTaskList[index].taskCode);
                    this.$router.push({path: this.$store.state.newTaskList[index].url});
                }
            },
            /*做日常任务*/
            dayTaskGo(index) {
                console.log(this.$store.state.dayTaskList[index].type);
                if (this.$store.state.dayTaskList[index].type == 13 || this.$store.state.dayTaskList[index].type == 14) {
                    this.taskType = this.$store.state.dayTaskList[index].type;
                    this.uploadInfo.task = this.$store.state.dayTaskList[index].taskCode;
                    this.shareAction();
                } else {
                    this.taskUpload(3, this.$store.state.dayTaskList[index].taskCode);
                    this.$router.push({path: this.$store.state.dayTaskList[index].url});
                }
            },
            /*日常任务状态的显示隐藏*/
            dayCheckout(index) {
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.$store.state.dayTaskList[index].detail = !this.$store.state.dayTaskList[index].detail;
                    this.$store.state.dayTaskList[index].show = !this.$store.state.dayTaskList[index].show;
                }
            },
            /*下载任务状态显示隐藏*/
            apkTaskInfoShow(){
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.detail = !this.detail;
                    this.show = !this.show;
                }
            },
            /*邀请好友任务引导事件*/
            loadRequest(){
                if (this.isLogin() == false) {
                    return false;
                } else {
                    this.detail1 = !this.detail1;
                    this.show1 = !this.show1;
                }
            },
            /*跳转到邀请徒弟页面*/
            skipRequest(){
                if(this.isLogin()==false){
                    return false;
                }else{
                    this.$router.push({path:'request'});
                }
            },
            /*获取金币信息*/
            getTaskInfo() {
                this.$http({
                    method: 'get',
                    url: this.apiUrl.taskTaskInfo,
                    // params:{'uuid': this.uuid,'times':this.times,'sign':this.saign}
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        var ddata = res.data.dayList;
                        var odata = res.data.onceList;
                        ddata.forEach(function (item, index) {
                            item.detail = false;
                            item.show = true;
                            item.doneStatus = 0;
                            if (item.type == 10) {
                                item.url = 'index';
                                item.btnText = '去分享';
                            }
                            if (item.type == 11) {
                                item.url = 'index';
                                item.btnText = '立即阅读';
                            }
                            if (item.type == 13) {
                                item.btnText = '去分享';
                            }
                            if (item.type == 14) {
                                item.btnText = '去分享';
                            }
                            if (item.type == 15) {
                                item.btnText = '去唤醒';
                                item.url = 'disciple';
                            }
                        });
                        odata.forEach(function (item, index) {
                            item.detail = false;
                            item.show = true;
                            item.doneStatus = 0;
                            if (item.type == 3) {
                                item.url = 'setup';
                                item.btnText = '绑定';
                            }
                            if (item.type == 4) {
                                item.url = 'myphone';
                                item.btnText = '绑定';
                            }
                            if (item.type == 6) {
                                item.url = 'index';
                                item.btnText = '去阅读';
                            }
                            if (item.type == 8) {
                                item.url = 'request';
                                item.btnText = '去收徒';
                            }
                            if (item.type == 24) {
                                item.btnText = '去填写';
                                item.url = 'feedback';
                            }
                        });
                        this.$store.state.dayTaskList = ddata;
                        this.$store.state.newTaskList = odata;
                        this.$store.state.newAndDayTaskState=false;
                    }
                }).catch();
            },
            /*签到列表*/
            signTaskList() {
                this.creatSiagn(this.apiUrl.taskSiginList);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.taskSiginList,
                    params: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        this.zhouSaignList = res.data.sigins;
                        this.$store.state.signList = res.data.sigins;
                        this.$store.state.signCompleted = res.data.completed;
                        if (res.data.completed) {
                            this.saignPic = require('../assets/img/taskgold1.png');
                            this.sianPicSrc = false;
                            this.isDisabled = false;
                            res.data.sigins.forEach((ele, index) => {
                                var s = ele - 1;
                                this.daysList[s].src = require('../assets/img/golds' + (s) + '.png');
                            });
                            switch (this.$store.state.signList.length) {
                                case 1:
                                    this.fuckGold = 50;
                                    break;
                                case 2:
                                    this.fuckGold = 100;
                                    break;
                                case 3:
                                    this.fuckGold = 300;
                                    break;
                                case 4:
                                    this.fuckGold = 888;
                                    break;
                                case 5:
                                    this.fuckGold = 150;
                                    break;
                                case 6:
                                    this.fuckGold = 200;
                                    break;
                                case 7:
                                    this.fuckGold = 2888;
                                    break;
                            }
                        } else {
                            res.data.sigins.forEach((ele, index) => {
                                var s = ele - 1;
                                this.daysList[s].src = require('../assets/img/golds' + (s) + '.png');
                            });
                            this.saignPic = require('../assets/img/biggoldbg.png');
                            this.sianPicSrc = true;
                            this.isDisabled = true;
                            switch (this.zhouSaignList.length) {
                                case 0:
                                    this.fuckGold = 50;
                                    break;
                                case 1:
                                    this.fuckGold = 100;
                                    break;
                                case 2:
                                    this.fuckGold = 300;
                                    break;
                                case 3:
                                    this.fuckGold = 888;
                                    break;
                                case 4:
                                    this.fuckGold = 150;
                                    break;
                                case 5:
                                    this.fuckGold = 200;
                                    break;
                                case 6:
                                    this.fuckGold = 2888;
                                    break;
                            }
                        }
                    }
                }).catch();
            },
            /*点击签到*/
            signTask() {
                if (this.isLogin() == false) {
                    return false;
                }
                this.moreGroom();
                this.moreRecom = true;
                this.saignPic = require('../assets/img/taskgold1.png');
                this.sianPicSrc = false;
                this.isDisabled = false;
                this.taskUpload(3, 'T9');
                this.creatSiagn(this.apiUrl.taskSigin);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.taskSigin,
                    params: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        // console.log(res);
                        if (res.data.status == 1) {
                            this.signTaskList();
                        } else if (res.data.status == 2) {
                            Toast({
                                message: '今日已签到',
                                position: 'bottom'
                            });
                        }
                    }
                }).catch();
            },
            /*任务列表*/
            taskList() {
                this.creatSiagn(this.apiUrl.taskMyTaskList);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.taskMyTaskList,
                    params: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        var data = res.data.listItems;
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < this.$store.state.newTaskList.length; j++) {
                                if (this.$store.state.newTaskList[j].type == data[i].type) {
                                    this.$store.state.newTaskList[j].doneStatus = data[i].doneStatus;
                                }
                            }
                        }
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < this.$store.state.dayTaskList.length; j++) {
                                if (this.$store.state.dayTaskList[j].type == data[i].type) {
                                    this.$store.state.dayTaskList[j].doneStatus = data[i].doneStatus;
                                }
                            }
                        }
                    }
                }).catch();
            },
            /*一次性任务*/
            onceTask(type, taskCode) {
                this.taskUpload(9, taskCode);
                this.creatSiagn(this.apiUrl.taskOnce);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.taskOnce,
                    params: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign, type: type}
                }).then(res => {
                    if (res.status == 200) {
                        this.taskList();
                         Toast({
                           message: res.data.message,
                           position: 'center'
                         });
                    }
                }).catch();
            },
            /*每日任务*/
            dayTaskGold(type, taskCode) {
                // console.log(type);
                this.taskUpload(9, taskCode);
                this.creatSiagn(this.apiUrl.taskDay);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.taskDay,
                    params: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign, type: type}
                }).then(res => {
                    if (res.status == 200) {
                        Toast({
                            message: res.data.message,
                            position: 'center'
                        });
                        this.taskList();
                    }
                }).catch();
            },
            /*提现流水*/
            cashList(){
                this.$http({
                    method:'get',
                    url:this.apiUrl.shareGetCashList,
                }).then(res=>{
                    console.log(res);
                    if(res.status==200){
                        this.$store.state.cashLists = res.data.list;
                    }
                }).catch();
            },
            /*获取auth*/
            authsList(taskCode) {
                if (!this.isWeixin()) {
                    return false;
                }
                this.auths = {};
                let _this = this;
                plus.oauth.getServices(function (services) {
                    _this.auths.aList = services;
                    _this.weixinLogin(taskCode);
                    // localStorage.setItem('auths', JSON.stringify(_this.auths));
                }, function (e) {
                    plus.nativeUI.toast('获取第三方服务列表失败');
                });
            },
            /*微信登录*/
            weixinLogin(taskCode) {
                console.log(this.auths);
                let s = new Object();
                this.auths.aList.forEach(item => {
                    s = item.id == 'weixin' ? item : null;
                });
                let _this = this;
                if (!s.authResult) {
                    try {
                        this.taskUpload(3, taskCode);
                        s.login(function (e) {
                            console.log(e);
                            // 获取登录操作结果
                            s.getUserInfo(function (e) {
                                console.log('获取用户信息成功：' + JSON.stringify(s.userInfo));
                                _this.bindWechat(s.userInfo);
                                //注销登录授权认证
                                s.logout(function (e) {
                                    console.log('注销登录认证成功！');
                                }, function (e) {
                                    console.log('注销登录认证失败！');
                                });
                            }, function (e) {
                                console.log('获取用户信息失败：' + e.message + ' - ' + e.code);
                            });
                        }, function (e) {
                            console.log(e);

                        });
                    } catch (err) {
                        plus.nativeUI.toast('已经登录认证！');
                    }
                } else {
                    plus.nativeUI.toast('已经登录认证！');
                }
            },
            /*绑定微信*/
            bindWechat(userInfo) {
                let device = {
                    deviceID: this.$store.state.deviceuuid,
                    mobileModel: this.$store.state.devicemodel
                };
                userInfo = JSON.stringify({...this.delKey(userInfo, 'language', 'privilege', 'unionid'), ...device});
                // console.log(userInfo);
                this.nowTime = Date.parse(new Date()) / 1000 + parseInt(localStorage.getItem('timestamp'));
                this.creatSiagn(this.apiUrl.userBindWechat);
                this.$http({
                    method: 'post',
                    url: this.apiUrl.userBindWechat,
                    data: {
                        // data: this.encrypt(userInfo,this.nowTime+'Dq2KO0'),b
                        data: this.encrypt(userInfo, this.userKey),
                        times: this.nowTime
                    },
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        // console.log(res);
                        if (res.data.status == 1) {
                            this.taskList();
                        } else {
                            Toast({
                                message: res.data.message,
                                position: 'bottom',
                                className: 'toasted',
                                duration: 1000,
                            });
                        }
                    } else {
                        this.clearStorage();
                    }
                }).catch((err) => {
                    this.clearStorage();
                });
            },
            clearStorage() {
                // localStorage.clear();
                plus.nativeUI.toast('服务器繁忙请稍后再试！');
                // this.$router.push({path: 'personal'});
            },
            /*立即邀请*/
            shareAction() {
                if (!this.isWeixin()) {
                    return false;
                }
                this.creatSiagn(this.apiUrl.shareApprentice);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.shareApprentice,
                    params: {code: this.invitateCode},
                    headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
                }).then(res => {
                    if (res.status == 200) {
                        this.shareTitle = res.data.title;
                        this.shareContent = res.data.content;
                        this.popupUpdate(true);
                    } else {
                        Toast({
                            message: '获取分享内容失败，请稍后再试',
                            position: 'bottom',
                            className: 'toasted',
                            duration: 1000,
                        });
                    }
                }).catch(res => {
                    Toast({
                        message: '获取分享内容失败，请稍后再试',
                        position: 'bottom',
                        className: 'toasted',
                        duration: 1000,
                    });
                });
            },
            /*隐藏更多推荐*/
            hideMore(){
                this.moreRecom = false;
            },
            /*更多推荐列表*/
            moreGroom() {
                // if (!this.networkStatus()) {
                //     return false;
                // }
                // this.networkType();//获取网络类型
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsRefresh,
                    params: {
                        type: this.$store.state.defalutID,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        fr: this.$store.state.platForm
                    },
                    headers: {
                        'uuid': uuid,
                        'accessToken': JSON.parse(localStorage.getItem('acsToken')).accessToken,
                        'nonce': JSON.parse(localStorage.getItem('acsToken')).nonce,
                        'timestamp': JSON.parse(localStorage.getItem('acsToken')).timestamp,
                        'mediaSource': JSON.parse(localStorage.getItem('acsToken')).mediaSource
                    },
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        this.moreRecomList = res.data.list.slice(0,2);
                    }
                }).catch();
            },
            /*详情页*/
            see(url, pk, topic, type, map, firstImg) {
                // location.href = url;
                this.isTrue=false;
                this.detailClickUpload(1, type, topic, pk);
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
            },
            /*前往首页*/
            goIndex(){
                this.$router.push({path:'index'});
                this.moreRecom = false;
            },
            /*积分墙任务列表*/
            wallList(){
                this.creatSiagn(this.apiUrl.taskWallList);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskWallList,
                    params:{'uuid': this.uuid, 'times': this.times, 'sign': this.saign}
                }).then(res=>{
                    if(res.status==200){
                        if(res.data.status==0){
                            console.log(res);
                            // this.wallListItems=[];
                            this.$store.state.wallListItems = res.data.listItems;
                            if(!this.$store.state.firstLoadImg){
                                for(var i =0;i<this.$store.state.wallListItems.length;i++){
                                    this.$store.state.loadArr[i]=true;
                                }
                                this.$store.state.firstLoadImg=true;
                            }
                        }
                    }
                }).catch();
            },
            /*积分墙点击下载*/
            loadingAdApk(url,pk,srckey,index){
                this.$store.state.loadArr[index]=false;
                this.$forceUpdate();
                let _this=this;
                var dtask = plus.downloader.createDownload(url, {filename: '_doc/download/'+new Date().getTime()+'.apk'}, function (d, status) {
                    // 下载完成
                    if (status == 200) {
                        console.log('下载成功');
                        _this.adUpload(8,pk,srckey);
                        plus.runtime.install(d.filename, {}, function () {
                            console.log('开始安装');
                            _this.adUpload(10,pk,srckey);
                            _this.doneWallTask(pk);
                        }, function (DOMException) {
                            console.log('安装失败');
                            console.log(JSON.stringify(DOMException));
                            _this.adUpload(11,pk,srckey);
                        });
                    } else {
                        plus.nativeUI.toast('下载失败');
                        _this.adUpload(9,pk,srckey);
                    }
                });
                dtask.start();
            },
            /*做积分墙任务*/
            doneWallTask(id){
                this.creatSiagn(this.apiUrl.taskDoneWall);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskDoneWall,
                    params:{'uuid': this.uuid, 'times': this.times, 'sign': this.saign,'taskId':id}
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        this.wallList();
                    }
                }).catch()
            },
            /*领取积分墙金币*/
            getWallGolds(id){
                this.creatSiagn(this.apiUrl.taskWall);
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskWall,
                    params:{'uuid': this.uuid, 'times': this.times, 'sign': this.saign,'taskId':id}
                }).then(res=>{
                    if(res.status==200){
                        console.log(res);
                        Toast({
                            message: res.data.message,
                            position: 'center'
                        });
                        this.wallList();
                    }
                }).catch()
            },
            /*师徒邀请页*/
            taskRequest () {
                if(this.isLogin()==false){
                    return false;
                }else{
                    this.$router.push({path:'request'});
                    // this.$router.push({path:'activity'});
                }
            },
            /*下载apk*/
            taskLoadApks(url, pk, topic, type, map, firstImg,srckey){
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
        },
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

    .thetask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
        font-size: 16px;
        color: #333;
    }

    .thetask .thetask-top {
        height: 44px;
        width: 100%;
        background: #e53526;
        position: relative;
        top: 0;
        left: 0;
    }

    .thetask .thetask-top .logo {
        height: 22px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .thetask .thetask-top .return {
        width: 14px;
        text-align: center;
        margin-left: 24px;
        margin-top: 16px;
        float: left;
    }

    .thetask .thetask-top .return img {
        width: 32%;
        vertical-align: middle;
    }

    .thetask .thetask-content .thetask-wrapper {
        overflow-y: auto;
        padding-bottom: 60px;
    }

    .thetask .thetask-banner {
        width: 100%;
        height: 190px;
        position: relative;
    }

    .thetask .thetask-content .thetask-wrapper .toppicBg {
        background: url('../assets/img/bgcolor1.png') repeat-x;
    }

    .thetask .thetask-content .thetask-wrapper .toppicBg .loopBanner{
        width: 100%;
        height: 30px;
        /* background: rgba(0,0,0,.3); */
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background:rgba(0,0,0,.2);
    }

    .thetask .thetask-content .thetask-wrapper .toppicBg .loopBanner .swiper-wrapper{
        height: 30px;
        font-size: 14px;
    }

    .thetask .thetask-content .thetask-wrapper .toppicBg .loopBanner .swiper-wrapper .swiper-slide{
    }

    .thetask .thetask-banner .flotbox {
        position: absolute;
        right: 0;
        top: 40px;
        font-size: 12px;
        width: 100px;
        height: 20px;
        line-height: 21px;
        background: #ffe800;
        text-align: center;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        color: #e70a03;
        /* width: 120px; */
    }

    .thetask .thetask-banner .gold-wrapper {
        width: 165px;
        padding-top: 5px;
        position: absolute;
        margin: auto;
        left: 0;
        top: 30px;
        right: 0;
        bottom: 0;
    }

    .thetask .thetask-banner .gold-wrapper #tsxtgolds {
        position: absolute;
        width: 164px;
        top: 52px;
        font-size: 25px;
        text-align: center;
    }

    .thetask .thetask-banner .gold-wrapper #tsxtgolds .fuckingGold {
        color: #e53526;
    }

    .thetask .thetask-banner .gold-wrapper #tsxtgolds .fuckingGoldWite {
        color: #fff;
    }

    .thetask .thetask-banner .move {
        animation: butt .5s linear infinite alternate;
    }

    .thetask .thetask-banner img {
        width: 100%;
        max-width: 162px;
        height: auto;
        vertical-align: middle;
    }

    .thetask .taskad-banner{
        width: 100%;
        height: 86px;
        overflow: hidden;
        margin: 10px 0;
    }

    .thetask .taskad-banner .taskOneImg{
        width: 100%;
        height: 100%;
    }

    .thetask .taskad-banner .taskOneImg img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }

    .thetask .taskad-banner #taskAdSwiper{
        width: 100%;
        height: 86px;
    }

    .thetask .taskad-banner #taskAdSwiper .swiper-slide{
        width: 100%;
        height: 86px;
        overflow: hidden;
    }

    .thetask .taskad-banner #taskAdSwiper .swiper-slide img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }

    .thetask .task-register .receive-gold {
        width: 10%;
        float: left;
        margin-right: 4%;
        padding-top: 10px;
        padding-bottom: 8px;
    }

    .thetask .task-register .receive-gold:first-child {
        margin-left: 3%;
    }

    .thetask .task-register .receive-gold:last-child {
        margin-right: 0;
    }

    .thetask .task-register .receive-gold img {
        width: 100%;
        vertical-align: middle;
    }

    .thetask .task-register .receive-gold .date {
        text-align: center;
        color: #fff;
        padding-top: 8px;
        font-size: 12px;
    }

    .thetask .day-task {
        font-size: 14px;
        color: #333;
        background: #fff;
    }

    .thetask .day-task .title {
        padding: 4%;
        font-size: 20px;
        font-weight: 600;
        border-bottom: 1px solid #eee;
    }

    .thetask .day-task .title span {
        padding-left: 10px;
        border-left: 4px solid #e53526;
    }

    .thetask .day-task .dayTasks {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 3% 4% 3% 5%;
        border-bottom: 1px solid #eee;
    }

    .thetask .day-task .cWrapper .hiddenbox {
        padding: 4% 10% 4% 5%;
        background: #f2f2f2;
        display: flex;
        align-items: center;
        font-size: 14px;
    }

    .thetask .day-task .cWrapper .hiddenbox .detail-left {
        /* text-indent:2em; */
        flex: 3;
        padding-right: 10%;
    }

    .thetask .day-task .cWrapper .hiddenbox .detail-right {
        flex: 1;
        text-align: center;
        position: relative;
    }

    .thetask .day-task .cWrapper .hiddenbox .detail-right img {
        width: 100%;
        vertical-align: middle;
    }

    .thetask .day-task .cWrapper .hiddenbox .detail-right .table {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 92%;
        color: #fff;
        display: flex;
        align-items: center;
    }

    .thetask .day-task .cWrapper .hiddenbox .detail-right .table div {
        flex: 1;
    }

    .thetask .day-task .dayTasks .task-text {
        flex: 10;
    }

    .thetask .day-task .dayTasks .task-golds {
        /* flex: 1.5; */
        color: #e53526;
        font-size: 14px;
        text-align: right;
        padding-top: 4px;
    }

    .thetask .day-task .dayTasks .goldspic {
        padding: 0 3% 0 5px;
    }

    .thetask .day-task .dayTasks .goldspic img {
        height: 26px;
        vertical-align: middle;
    }

    .thetask .day-task .dayTasks .goldsjt {
        width: 16px;
        text-align: center;
    }

    .thetask .dayTasks .goldsjt1 {
        width: 16px;
        text-align: center;
    }

    .thetask .dayTasks .goldsjt img {
        height: 15px;
        vertical-align: middle;
    }

    .thetask .dayTasks .goldsjt1 img {
        /* width: 15px; */
        height: 8px;
    }

    .collapse-enter-active {
        max-height: 10rem;
        -webkit-transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .collapse-leave-active {
        -webkit-transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .rotate-enter-active {
        transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .rotate-leave-active {
        transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    @keyframes butt {
        from {
            transform: scale(1, 1);
        }
        to {
            transform: scale(0.8, 0.8);
        }
    }

    .thetask .getGolds {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 80%;
        height:65%;
        z-index: 999;
    }

    .thetask .getGoldsBg{
        width: 100%;
        height:100%;
        background:rgba(0,0,0,.5);
        position: fixed;
        left:0;
        top:0;
        z-index: 998;
    }

    .thetask .getGolds .SignGoldContent{
        width: 100%;
        height:100%;
        background:#fff;
        border-radius:8px;
        padding:0 10px;
    }

    .thetask .getGolds .SignGoldContent .fuckMoreTop{
        width: 100%;
        height: 90px;
    }

    .thetask .getGolds .SignGoldContent .fuckCon{
        height: 65%;
        overflow-y:auto;
    }

    .thetask .getGolds .SignGoldContent .cliMoreCons{
        width:100%;
        height: 50px;
        position: absolute;
        left:0;
        bottom:0;
    }

    .thetask .getGolds .SignGoldContent .cliMoreCons .clickMore{
        text-align:center;
        position: absolute;
        top:0;
        right:0;
        bottom:0;
        left: 0;
        margin: auto;
        width:130px;
        height:24px;
        line-height: 24px;
        border-radius:16px;
        background:red;
        color:#fff;
    }

    .thetask .getGolds .SignGoldContent .moreInfo{
        width:100%;
        padding-bottom:10px;
        padding-top:10px;
        border-bottom: 1px solid #eee;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-text{
        font-size:12px;
        color:#999;
        padding-top:5px;
        dispaly:flex;
        align-items:center;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-text .date{
        transform:scale(.8);
        -webkit-transform: scale(.8);
        padding-top:2px;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-title{
        font-size:14px;
        padding-bottom:5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic-wra{
        width:100%;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic{
        margin-right: 5px;
        width: 32%;
        float: left;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic:last-child{
        margin-right:0px;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic img{
        width: 100%;
        vertical-align: middle;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two{
        width: 100%;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .left{
        width: 34%;
        height: 75px;
        overflow: hidden;
        float: left;
        margin-right: 6%;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .left img{
        width: 100%;
        min-height: 75px;
        vertical-align: middle;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .right{
        width: 58%;
        height: 70px;
        float: left;
        position: relative;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .tile{
        max-height: 56px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        font-size:14px;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text{
        font-size: 12px;
        white-space: nowrap;
        color: #999999;
        position: absolute;
        bottom: 0;
        left: 0;
        display:flex;
        align-items:center;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text .date{
        white-space: nowrap;
        transform:scale(.8);
        -webkit-transform: scale(.8);
        padding-top:2px;
    }

    .thetask .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text .source{
        width:60px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thetask .getGolds .SignGoldContent .fanhui{
        position: absolute;
        right: 0;
        top:0;
        width:50px;
        height: 50px;
    }

    .thetask .getGolds .SignGoldContent .explainBg{
        width: 100%;
    }

    .thetask .getGolds .SignGoldContent .fanhui img{
        width:12px;
        margin-left: 24px;
        margin-top: 12px;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop{
        width:206px;
        margin:0 auto;
        padding-left:5px;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop-left{
        float: left;
        width:70px;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop-left img{
        width:100%;
        vertical-align:middle;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop-right{
        float: left;
        padding-top:10px;
        line-height:26px;
        font-size:14px;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop-right .title{
        font-weight:700;
        font-size:16px;
    }

    .thetask .getGolds .SignGoldContent .signGoldTop-right .gold{
        color:#e53526;
    }

    .cWrapper .apkhiddenbox {
        padding: 1% 10% 1% 5%;
        background: #f2f2f2;
        border-bottom: 1px solid #e0e0e0;
    }

    .cWrapper .apkhiddenbox .apkType{
        display: -webkit-flex;
        display: flex;
        align-items: center;
    }

    .cWrapper .apkhiddenbox .apkType .logo{
        width: 38px;
    }

    .cWrapper .apkhiddenbox .apkType .logo img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }

    .cWrapper .apkhiddenbox .apkType .info{
        font-size: 12px;
        transform: scale(.85,.8);
    }

    .cWrapper .apkhiddenbox .apkType .info .logotext{
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
    }

    .cWrapper .apkhiddenbox .apkType .info .lineH{
        line-height: 16px;
    }

    .apkGold{
        text-align: right;
        flex: 1;
        padding-top: 10px;
    }

    .apkGold img{
        width: 54px;
        height: auto;
    }

    .apkGold .gNums{
        margin-bottom: 5px;
        display: -webkit-flex;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .apkGold .gNums span{
        font-size: 12px;
        color: #e53526;
        padding-right: 2px;
    }

    .apkGold .gNums img{
        width: 17px;
        height: auto;
    }

    .sogouAd{
        width:100%;
        height:82px;
    }


</style>

