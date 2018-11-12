<template>
    <div style="height:100vh;overflow:hidden!important;">
        <topsearch v-on:goldCoin="getGoldCoin"></topsearch>
        <div class="page-loadmore">
            <div class="nav-swiper">
                <div class="swiper-container" id="swiper-container2">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in infoList" :class="{'activeve':index==0}"><span>{{item.name}}</span>
                        </div>
                    </div>
                    <!-- <div class="more">
                    <img src="../assets/sign.png" alt="">
                    </div> -->
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in infoList">
                        <div class="page-loadmore-wrapper" @scroll="(type=='aggregation_kd'||type=='toutiao')?abc(adList[index]):''" ref="wrapper" :style="{height:wrapperHeight+'px'}">
                            <mt-loadmore :bottom-method="loadBottom" :top-method="loadTop"
                                         :bottom-all-loaded="allLoaded" ref="loadmore"
                                         @bottom-status-change="handleBottomChange" @top-status-change="handleTopChange"
                                         :autoFill=false :bottomDistance=35 :topDistance=35>
                                <ul class="page-loadmore-list clearfloat">
                                    <li v-if="item.id!='beauty_kd'&&item.id!='emotion_kd'&&item.id!='soul_kd'"
                                        class="page-loadmore-listitem" v-for="items in item.val">
                                        <div v-if="items.imgs.length==1"
                                             v-bind:class="{'add_class':items.logExtra!=null,'gxw':items.logExtra==null}">
                                            <div class="aaa clearfloat" v-if="items.logExtra==null">
                                                <div class="left">
                                                    <div v-for="list in items.imgs"
                                                         @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                        <img class="page-lazyload-image" v-lazy="list.src" :key="list.src" alt="">
                                                    </div>
                                                </div>
                                                <div class="right"
                                                     @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                    <p class="advert-tile">{{items.topic}}</p>
                                                    <div class="advert-pic">
                                                        <!-- <span class="span-pic"><img src="../assets/top.png" alt=""></span> -->
                                                        <span :style="{color:'#'+ucColor}"
                                                              v-if="items.logExtra!=null?(items.logExtra.mark!=''?true:false):false"
                                                              class="source">{{items.logExtra.mark}}</span>
                                                        <span v-else class="source">{{items.source}}</span>
                                                        <!-- <span v-if="items.logExtra==null" class="date">{{items.date}}</span>
                                                        <span @click="visitUrl(app_download_url)" v-else class="date">{{items.logExtra.app_download_desc}}</span> -->
                                                        <span
                                                            v-if="items.logExtra!=null?(items.logExtra.app_download_desc!=''?true:false):false"
                                                            class="date"
                                                            @click="visitUrl(app_download_url)">{{items.logExtra.app_download_desc}}</span>
                                                        <span v-else class="date">{{items.date}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="ccc" v-else-if="items.logExtra!=null">
                                                <div class="adShowWraper" v-if="items.logExtra.style_type==1">
                                                    <div v-for="list in items.imgs">
                                                        <img class="video-logo" v-lazy="list.src" :key="list.src" alt=""
                                                            @click="item.type=='apk'?loadApk(items.url,items.adId,items.source):loadLd(items.url,items.adId,items.topic,items.type,items.map,items.imgs[0],items.source)">
                                                    </div>
                                                    <img class="adPeg" src="../assets/img/adshow1.png" alt="">
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="items.imgs.length==3"
                                             v-bind:class="{'add_class':items.logExtra!=null,'gxw':items.logExtra==null}">
                                            <div class="bbb"
                                            >
                                                <div class="b-title"
                                                     @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                    {{items.topic}}
                                                </div>
                                                <div class="b-pic-wra clearfloat"
                                                     @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                    <div class="b-pic" v-for="list in items.imgs">
                                                        <img class="page-lazyload-image" v-lazy="list.src" :key="list.src" alt="">
                                                    </div>
                                                </div>
                                                <div class="b-text">
                                                    <span :style="{color:'#'+ucColor}"
                                                          v-if="items.logExtra!=null">{{items.logExtra.mark}}</span>
                                                    <span v-else>{{items.source}}</span>
                                                    <!-- <span v-if="items.logExtra==null" class="date">{{items.date}}</span>
                                                    <span @click="visitUrl(app_download_url)" v-else class="date">{{items.logExtra.app_download_desc}}</span> -->
                                                    <span
                                                        v-if="items.logExtra!=null?(items.logExtra.app_download_desc!=''?true:false):false"
                                                        class="date"
                                                        @click="visitUrl(app_download_url)">{{items.logExtra.app_download_desc}}</span>
                                                    <span v-else class="date">{{items.date}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="items.imgs.length==0">
                                            <div class="ccc" v-if="items.logExtra==null">
                                                <img class="video-logo" v-lazy="items.bigImg" :key="items.bigImg" alt=""
                                                     @click="goVideoDetail(items.url,items.type,items.topic,items.bigImg,items.pk)">
                                                <div class="source"></div>
                                                <div class="title">
                                                    <div class="text">{{items.topic}}</div>
                                                    <div class="watchTatol"></div>
                                                </div>
                                                <div class="videoLod"
                                                     @click="goVideoDetail(items.url,items.type,items.topic,items.bigImg,items.pk)">
                                                    <img src="../assets/img/videoPause.png" alt=""></div>
                                                <!-- <div class="video-time">{{items.date}}</div> -->
                                            </div>
                                            <div v-else-if="items.logExtra!=null">
                                                <iframe :key="items.adId" class="sogouAd" :class="{sgThree:items.logExtra.style_type==6}" referrerpolicy="origin" frameborder="0" :src="items.topic"></iframe>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-if="item.id=='beauty_kd'" class="page-loadmore-listitem float-left"
                                        v-for="items in item.val">
                                        <div class="picBox clearfloat">
                                            <img class="page-lazyload-image" v-lazy="items.imgs[0].src" :key="items.imgs[0].src" alt=""
                                                 @click="see(items.url,items.pk,items.topic,items.type,items.map)">
                                            <div class="pltitle">{{items.topic}}</div>
                                        </div>
                                    </li>
                                    <li v-if="item.id=='emotion_kd'||item.id=='soul_kd'" class="page-loadmore-listitem"
                                        v-for="items in item.val">
                                        <div class="aaa clearfloat"
                                        >
                                            <div class="left">
                                                <div class="imgWrapper">
                                                    <img class="page-lazyload-image" v-lazy="items.imgs[0].src" :key="items.imgs[0].src" alt=""
                                                         @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                </div>
                                            </div>
                                            <div class="right"
                                                 @click="see(items.url,items.pk,items.topic,items.type,items.map,items.imgs[0])">
                                                <p class="advert-tile">{{items.topic}}</p>
                                                <div class="advert-pic">
                                                    <span class="source">{{items.source}}</span>
                                                    <span class="date">{{items.date}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div slot="top" class="mint-loadmore-top">
                                    <span v-show="topStatus !== 'loading'"
                                          :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                                    <span v-show="topStatus === 'loading'">
                      <mt-spinner type="snake"></mt-spinner>
                    </span>
                                </div>
                                <div class="mint-loadmore-bottom" slot="bottom">
                                    <span v-show="bottomStatus !== 'loading'"
                                          :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                                    <span v-show="bottomStatus === 'loading'">
                      <mt-spinner type="snake"></mt-spinner>
                    </span>
                                </div>
                            </mt-loadmore>
                        </div>
                    </div>
                </div>
                <img class="neterro" v-if="$store.state.noNetPic" src="../assets/img/nonet.png" alt="">
                <img v-if="loadingpic" class="loading-pic" src="../assets/img/loadingmore.jpg" alt="">
            </div>
        </div>
        <div class="float_1" v-if="oneStatus&&redpackStatus">
        <!--<div class="float_1" v-if="true">-->
            <div class="float_1_exit" @click="redpackStatus=transparentBgStatus=oneStatus=false"></div>
            <!--<div class="float_1_txt">-->
                <!--<span class="float_1_txt_1">恭喜获得</span>-->
                <!--<span class="float_1_txt_2">新用户红包</span>-->
                <!--<span class="float_1_txt_3">1.35元</span>-->
            <!--</div>-->
            <!--<div class="float_1_bottom">满2元即可提现</div>-->
            <!--<div class="float_1_btn" @click.stop="redPackBtn"></div>-->
            <!--<img class="float_1_img" src="../assets/img/float_1_bg.png"/>-->
            <img class="float_1_img" @click="gosavemoneypay" src="../assets/img/payapp.jpg"/>
        </div>
        <div class="float_2" v-if="oneStatus&&inviteStatus">
        <!--<div class="float_2" v-if="true">-->
            <div class="float_2_exit" @click.stop="inviteBtn('exit')"></div>
            <!--<img class="float_1_img" src="../assets/img/payapp.jpg" @click.stop="inviteBtn('invite')"/>-->
            <img class="float_1_img" src="../assets/img/payapp.jpg" @click.stop="gosavemoneypay"/>
            <!--<div class="float_1_img_btn"><img src="../assets/img/inviteRedBtn.png" /></div>-->
        </div>
        <div class="getGolds" v-if="isTrue">
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
                            <span>恭喜您获得<span class="gold">50金币</span></span>
                        </div>
                    </div>
                    <img class="explainBg" src="../assets/img/explainBg.png" alt="">
                </div>
                <div class="fuckCon" :style="{height:fuckHeight+'px'}">
                    <div class="moreInfo" v-for="item in moreInfoList">
                        <div v-if="item.imgs.length==3"
                             @click="see(item.url,item.pk,item.topic,item.type,item.map,item.imgs[0])">
                            <div class="moreInfo-one">
                                <div class="moreInfo-one-title">
                                    {{item.topic}}
                                </div>
                                <div class="moreInfo-one-pic-wra clearfloat">
                                    <div class="moreInfo-one-pic" v-for="list in item.imgs">
                                        <img class="page-lazyload-image" v-lazy="list.src" :key="list.src" alt="">
                                    </div>
                                </div>
                                <div class="moreInfo-one-text">
                                    <span>{{item.source}}</span>
                                    <span class="date">{{item.date}}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="item.imgs.length==1"
                             @click="see(item.url,item.pk,item.topic,item.type,item.map,item.imgs[0])">
                            <div class="moreInfo-two clearfloat">
                                <div class="left">
                                    <div v-for="list in item.imgs">
                                        <img class="page-lazyload-image" v-lazy="list.src" :key="list.src" alt="">
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
        <div class="getGoldsBg" v-if="isTrue"></div>
        <div class="transparentBg" v-if="transparentBgStatus"></div>
        <bottom-nav v-on:refreshList="loadTop"></bottom-nav>
        <div class="chooseSex" v-if="sexFuck">
            <div class="title">
                <div class="title-sex">请选择您的性别</div>
                <div class="title-info">我们将为您推荐感兴趣的新闻</div>
            </div>
            <div class="sexPic">
                <div v-for="(item,index) in sexList" @click="exchangeSex(index)">
                    <img :src="item.src" alt="">
                    <div>{{item.sex}}</div>
                </div>
            </div>
        </div>
        <float></float>
    </div>
</template>
<script>
    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.min.css';
    import topsearch from 'components/topSearch';
    import bottomNav from 'components/bottomNav';
    import float from 'components/float';
    import {Indicator} from 'mint-ui';
    import Float from "../components/float";


    export default {
        name: 'index',
        data() {
            return {
                infoList: [],
                picList: [],
                qingganList: [],
                list: [],
                allLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                autoFill: false,
                index: 0,
                picLength: 0,
                lastKeys: '',
                isFirstEnter: false, // 是否第一次进入，默认false
                loadingpic: false,
                redpackStatus: false,
                inviteStatus: false,
                transparentBgStatus: false,
                oneStatus: true,
                isTrue: false,
                type: '',
                flag: false,
                dataJson: '',
                ucColor: '',
                adList: [],
                scrollList: [],
                ulHeight: 0,
                defalutId: '',
                auths: {},
                moreInfoList: [],
                fuckHeight: 0,
                sexList: [
                    {
                        src: require('../assets/img/sexBoy.png'),
                        sex: '男士'
                    },
                    {
                        src: require('../assets/img/sexGirl.png'),
                        sex: '女士'
                    }
                ],
                sexFuck: false,
            };
        },
        components: {
            Float,
            topsearch,
            bottomNav,
            float,
        },
        mounted() {
            var _this = this;
            this.wrapperHeight = document.documentElement.clientHeight - 86;
            var mySwiper = new Swiper('#swiper-container2', {
                freeMode: true,
                freeModeMomentumRatio: 0.5,
                slidesPerView: 'auto',
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });

            mySwiper.on('tap', function () {
                var swiperWidth = mySwiper.el.clientWidth;
                var maxTranslate = mySwiper.maxTranslate();
                var maxWidth = -maxTranslate + swiperWidth / 2;
                mySwiper3.slideTo(mySwiper.clickedIndex, 300);
                var slide = mySwiper.slides[mySwiper.clickedIndex];
                var slideLeft = slide.offsetLeft;
                var slideWidth = slide.clientWidth;
                var slideCenter = slideLeft + slideWidth / 2;
                mySwiper.setTransition(300);
                if (slideCenter < swiperWidth / 2) {
                    mySwiper.setTranslate(0);
                } else if (slideCenter > maxWidth) {
                    mySwiper.setTranslate(maxTranslate);
                } else {
                    var nowTlanslate = slideCenter - swiperWidth / 2;
                    mySwiper.setTranslate(-nowTlanslate);
                }
                $('#swiper-container2  .activeve').removeClass('activeve');
                $('#swiper-container2 .swiper-slide').eq(mySwiper.clickedIndex).addClass('activeve');
            });
            var mySwiper3 = new Swiper('#swiper-container3', {
                on: {
                    slideChangeTransitionStart: function (e) {
                        _this.index = mySwiper3.activeIndex;
                        _this.channelUpload(1, _this.infoList[mySwiper3.previousIndex].id, _this.infoList[mySwiper3.activeIndex].id);
                        updateNavPosition();
                    },
                    slideChangeTransitionEnd: function () {
                        _this.scrollList = [];
                        _this.type = _this.infoList[mySwiper3.activeIndex].id;
                        _this.pageInfo(_this.type, mySwiper3.activeIndex);
                    }
                },
                resistanceRatio: 0,//边缘抵抗力
                direction: 'horizontal',//横向切换
                observeParents: true,
                touchRatio: 1,
                speed: 100,
                preventLinksPropagation: false,//拖动Swiper时阻止click事件。
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });

            function updateNavPosition() {
                $('#swiper-container2 .activeve').removeClass('activeve');
                var activeNav = $('#swiper-container2 .swiper-slide').eq(mySwiper3.activeIndex).addClass('activeve');
                if (!activeNav.hasClass('swiper-slide-visible')) {
                    if (activeNav.index() >= mySwiper.activeIndex) {
                        var thumbsPerNav = Math.floor(mySwiper.width / (activeNav.width() + 20)) - 1;
                        mySwiper.slideTo(activeNav.index() - thumbsPerNav);
                    }
                    else {
                        mySwiper.slideTo(activeNav.index());
                    }
                }
            }
        },
        methods: {
            /*领取金币*/
            getGoldCoin() {
                this.isTrue = true;
                this.fuckHeight = document.documentElement.clientHeight * 0.65 - 140;
                this.moreGroom();
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            /*顶部加载*/
            loadTop(type) {
                if (type == 'menu') {
                    Indicator.open('加载中...');
                }
                var types = this.infoList[this.index].id;
                this.downPageInfo(types, this.lastKeys);
                $('.page-loadmore-wrapper').eq(this.index).scrollTop(0);
            },
            /*底部加载*/
            loadBottom() {
                // this.allLoaded = true;
                var types = this.infoList[this.index].id;
                this.pullPageInfo(types, this.lastKeys);
            },
            /*获取资讯频道*/
            getNewsChannels(sex) {
                if (!this.networkStatus()) {
                    return false;
                }
                this.networkType();//获取网络类型
                console.log(sex);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetNewsChannels,
                    params: {
                        imei: this.$store.state.deviceuuid,
                        // imei: 1,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        // fr: this.$store.state.platForm
                    },
                    headers: {'gender': sex}
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res)
                        this.infoList = res.data.channels;
                        this.defalutId = this.infoList[0].id;
                        this.type = this.infoList[0].id;
                        this.$store.state.defalutID = this.defalutId;
                        this.pageInfo(this.defalutId, this.index);
                    } else {
                        this.getNewsChannels();
                    }
                }).catch(err => {
                    // this.getNewsChannels();
                });
            },
            /*更多推荐列表*/
            moreGroom() {
                this.networkType();//获取网络类型
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsRefresh,
                    params: {
                        type: this.infoList[0].id,
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
                }).then(res => {
                    if (res.status == 200) {
                        this.moreInfoList = res.data.list.slice(0, 2);
                    }
                }).catch();
            },
            /*下拉刷新*/
            downPageInfo(type, lastKey) {
                this.refreshUpload(1, 1, this.infoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.networkType();//获取网络类型
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsPull,
                    params: {
                        type: type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        lastKey: lastKey
                    },
                    headers: {
                        'uuid': uuid,
                        'isad': 1,
                        'accessToken': JSON.parse(localStorage.getItem('acsToken')).accessToken,
                        'nonce': JSON.parse(localStorage.getItem('acsToken')).nonce,
                        'timestamp': JSON.parse(localStorage.getItem('acsToken')).timestamp,
                        'mediaSource': JSON.parse(localStorage.getItem('acsToken')).mediaSource,
                        'isad': 1
                    },
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.infoList[this.index].val = [];
                        var data = res.data.list;
                        this.adList[this.index] = [];
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].logExtra != null) {
                                this.adList[this.index].push(data[j].logExtra);
                                this.dataJson = data[j].logExtra;
                                this.ucColor = this.dataJson.mark_color;
                            }
                        }
                        var data = res.data.list;
                        this.infoList[this.index].val = data;
                        this.$refs.loadmore[this.index].onTopLoaded();
                        this.lastKeys = this.infoList[this.index].val[this.infoList[this.index].val.length - 1].last_key;
                        Indicator.close();
                    } else {
                        Indicator.close();
                    }
                }).catch(res => {
                    Indicator.close();
                });
            },
            /*获取首页列表*/
            pageInfo(id, index) {
                if (this.infoList[this.index].val.length > 0) {
                    return false;
                }
                if (!this.networkStatus()) {
                    return false;
                }
                this.loadingpic = true;
                this.refreshUpload(1, 1, this.infoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.networkType();//获取网络类型
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsRefresh,
                    params: {
                        type: id,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        fr: this.$store.state.platForm
                    },
                    headers: {
                        'uuid': uuid,
                        'isad': 1,
                        'accessToken': JSON.parse(localStorage.getItem('acsToken')).accessToken,
                        'nonce': JSON.parse(localStorage.getItem('acsToken')).nonce,
                        'timestamp': JSON.parse(localStorage.getItem('acsToken')).timestamp,
                        'mediaSource': JSON.parse(localStorage.getItem('acsToken')).mediaSource,
                        'isad': 1
                    },
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res)
                        this.infoList[this.index].val = [];
                        var data = res.data.list;
                        if (data.length > 0) {
                            this.adList[index] = [];
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].logExtra != null) {
                                    this.adList[index].push(data[j].logExtra);
                                    this.dataJson = data[j].logExtra;
                                    this.ucColor = this.dataJson.mark_color;
                                }
                            }
                            this.infoList[this.index].val = data;
                            this.loadingpic = false;
                            this.lastKeys = this.infoList[this.index].val[this.infoList[this.index].val.length - 1].last_key;
                        }
                    }
                }).catch();
            },
            /*上拉加载*/
            pullPageInfo(type, lastKey) {
                this.refreshUpload(1, 2, this.infoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.networkType();//获取网络类型
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsPull,
                    params: {
                        type: type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        lastKey: lastKey
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
                        console.log(res);
                        var data = res.data.list;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].logExtra != null) {
                                this.adList[this.index].push(data[j].logExtra);
                                this.dataJson = data[j].logExtra;
                                this.ucColor = this.dataJson.mark_color;
                            }
                        }
                        this.infoList[this.index].val = this.infoList[this.index].val.concat(data);
                        this.$refs.loadmore[this.index].onBottomLoaded();
                        this.lastKeys = this.infoList[this.index].val[this.infoList[this.index].val.length - 1].last_key;
                    }
                }).catch();
            },
            /*详情页*/
            see(url, pk, topic, type, map, firstImg) {
                // location.href = url;
                this.isTrue = false;
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
            loadApk(url, pk, srckey) {
                this.isTrue = false;
                this.adUpload(5,pk,srckey);
                this.fileDownLoad(url,pk,srckey);
            },
            loadLd(url, pk, topic, type, map, firstImg,srckey) {
                this.isTrue = false;
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
            },
            goUrl() {
                if(!this.isLogin()){
                    return false;
                }else{
                    this.$router.push({path:'activity'});
                }
            },
            //引导注册
            redPackBtn() {
                this.oneStatus = this.transparentBgStatus = false;
                this.authsList();
            },
            //引导收徒
            inviteBtn(flag) {
                this.oneStatus = this.inviteStatus = this.transparentBgStatus = false;
                if (flag == 'invite') {
                    if(!this.isLogin()){
                        return false;
                    }else{
                        // this.$router.push({path:'activity'});
                        this.gowx();
                    }
                }
            },
            /*点击下载*/
            visitUrl(url) {
                cosnole.log(url);
                location.href(url);
            },
            /*第一次加载广告展现*/
            abc(obj) {
                if ($('.swiper-slide-active .add_class').length > 0) {
                    for (var i = 0; i < $('.swiper-slide-active .add_class').length; i++) {
                        var adHeight = $('.swiper-slide-active .add_class')[i].getBoundingClientRect().top - 86;
                        var nowAdHeight = $('.swiper-slide-active .add_class').eq(i).height() / 2;
                        var topHeight = -nowAdHeight;
                        var botHeight = $('body').height() - 86 - nowAdHeight;
                        if (adHeight < botHeight && adHeight > topHeight) {
                            if (this.scrollList.indexOf(obj[i]) == -1) {
                                this.scrollList.push(obj[i]);
                                console.log(this.scrollList);
                                console.log(obj[i]);
                                $.ajax({
                                    type: 'get',
                                    url: obj[i].show_impression_url,
                                });
                            }
                        } else {
                            if (this.scrollList.indexOf(obj[i]) != -1) {
                                this.scrollList.splice(this.scrollList.indexOf(obj[i]), 1);
                            }
                        }
                    }
                }
            },
            /*获取用户token*/
            getAccessToken(sex) {
                if (JSON.parse(localStorage.getItem('acsToken')) != null) {
                    if (Date.parse(new Date()) / 10000 >= JSON.parse(localStorage.getItem('acsToken')).expired) {
                        localStorage.removeItem('acsToken');
                    }
                }
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetAccessToken,
                    params: {imei: this.$store.state.deviceuuid}
                }).then(res => {
                    if (res.status == 200) {
                        var acsToken = new Object();
                        acsToken.accessToken = res.data.accessToken;
                        acsToken.expired = res.data.expired;
                        acsToken.nonce = res.data.nonce;
                        acsToken.timestamp = res.data.timestamp;
                        acsToken.mediaSource = 'today';
                        localStorage.setItem('acsToken', JSON.stringify(acsToken));
                        this.getNewsChannels(sex);
                    }
                }).catch();
            },
            //登录
            authsList() {
                this.auths = {};
                let _this = this;
                plus.oauth.getServices(function (services) {
                    _this.auths.aList = services;
                    _this.weixinLogin();
                }, function (e) {
                    plus.nativeUI.toast('获取第三方服务列表失败');
                    this.$router.push({path: 'login'});
                });
            },
            //微信登录
            weixinLogin() {
                if (!this.isWeixin()) {
                    this.$router.push({path: 'login'});
                    return false;
                }
                let s = new Object();
                this.auths.aList.forEach(item => {
                    s = item.id == 'weixin' ? item : null;
                });
                let _this = this;
                if (!s.authResult) {
                    try {
                        this.loginUpload('wx_login');
                        Indicator.open('登录中...');
                        s.login(function (e) {
                            console.log(e);
                            // 获取登录操作结果
                            s.getUserInfo(function (e) {
                                console.log('获取用户信息成功：' + JSON.stringify(s.userInfo));
                                _this.serviceTime(s.userInfo);
                                //注销登录授权认证
                                s.logout(function (e) {
                                    console.log('注销登录认证成功！');
                                }, function (e) {
                                    console.log('注销登录认证失败！');
                                });
                            }, function (e) {
                                console.log('获取用户信息失败：' + e.message + ' - ' + e.code);
                                _this.$router.push({path: 'login'});
                                Indicator.close();
                            });
                        }, function (e) {
                            console.log(e);
                            _this.$router.push({path: 'login'});
                            Indicator.close();
                        });
                    } catch (err) {
                        console.log('catch' + err + s);
                    }
                } else {
                    console.log();
                }
            },
            //获取服务器时间戳
            serviceTime(userInfo) {
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                let _this = this;
                $.ajax({
                    url: 'http://api.55duanzi.com/tt/api/user/time',
                    type: 'get',
                    headers: {
                        'uuid': uuid
                    },
                    success: function (res) {
                        var time = Date.parse(new Date()).toString().slice(0, 10);
                        var differ = res.timestamp - time;
                        localStorage.setItem('timestamp', differ);
                        _this.wxUserInfoUpload(userInfo);
                        console.log('存储' + localStorage.getItem('timestamp'));
                    },
                    error: function () {
                        localStorage.setItem('timestamp', 0);
                    }
                });
            },
            //提交用户信息
            wxUserInfoUpload(userInfo) {
                let device = {
                    deviceID: this.$store.state.deviceuuid,
                    mobileModel: this.$store.state.devicemodel,
                };
                userInfo = JSON.stringify({...this.delKey(userInfo, 'language', 'privilege', 'unionid'), ...device});
                this.nowTime = Date.parse(new Date()) / 1000 + parseInt(localStorage.getItem('timestamp')) || 0;
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
                            this.$router.push({path: 'personal'});
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
                localStorage.removeItem('kdtt');
                plus.nativeUI.toast('服务器繁忙请稍后再试！');
            },
            /*推荐视频详情页*/
            goVideoDetail(url, type, title, videoPoster, pk) {
                this.detailClickUpload(2, type, title, pk);
                this.$router.push({
                    path: 'videodetail',
                    query: {url: url, type: type, title: title, videoPoster: videoPoster}
                });
            },
            /*隐藏更多推荐*/
            hideMore() {
                this.isTrue = false;
            },
            /*前往首页*/
            goIndex() {
                this.$router.push({path: 'index'});
                this.isTrue = false;
            },
            /*变换性别*/
            exchangeSex(index) {
                if (index == 0) {
                    this.sexList[0].src = require('../assets/img/sexBoy1.png');
                    this.sexList[1].src = require('../assets/img/sexGirl.png');
                    this.getAccessToken('1');
                    localStorage.setItem('chooseSex', '1');
                    this.sexFuck = false;
                } else if (index == 1) {
                    this.sexList[0].src = require('../assets/img/sexBoy.png');
                    this.sexList[1].src = require('../assets/img/sexGirl1.png');
                    this.getAccessToken('2');
                    this.sexFuck = false;
                    localStorage.setItem('chooseSex', '2');
                }
                this.myUpload('select_sex', {
                    sex: index + 1,
                    action: 7,
                });
            }
        },
        created() {
            this.isFirstEnter = true;
        },
        activated() {
            if (!this.$route.meta.isBack || this.isFirstEnter) {
                // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
                let _this = this;
                if (JSON.parse(localStorage.getItem('kdtt')) == null && localStorage.getItem('chooseSex') == null) {
                    _this.sexFuck = true;
                } else {
                    _this.getAccessToken(localStorage.getItem('chooseSex') || '');
                }
                //push处理
                plus.push.addEventListener('receive', function (msg) {
                    // 分析msg.payload处理业务逻辑
                    console.log('You receive: ');
                    console.log(msg);
                }, false);
                plus.push.addEventListener('click', function (msg) {
                    // 分析msg.payload处理业务逻辑
                    console.log('You clicked: ');
                    console.log(msg);
                    if (msg.payload) {
                        _this.pushMessage(msg.payload);
                    }
                }, false);
            } else {
                //重置scrollTop
                let scrollTop = sessionStorage.getItem('scroll').split(',');
                scrollTop.forEach((item, i) => {
                    $('.page-loadmore-wrapper').eq(i).scrollTop(parseInt(item));
                });
            }
            //判断是否显示引导层
            if (this.networkStatus() && this.oneStatus) {
                if (JSON.parse(localStorage.getItem('kdtt')) != null) {
                    /*引导收徒展示规则：启动app次数为3的倍数*/
                    let invite = parseInt(localStorage.getItem('invite')) || 0;
                    if (invite % 3 == 0) {
                        this.inviteStatus = true;
                        this.transparentBgStatus = true;
                    } else {
                        this.oneStatus = false;
                        this.transparentBgStatus = false;
                    }
                    invite++;
                    localStorage.setItem('invite', invite.toString());
                    this.redpackStatus = false;
                    /*引导收徒展示规则：一天内第一次启动app*/
                    // if(!this.$cookies.isKey('isFirstStart')){
                    //     this.$cookies.set("isFirstStart","true","60s");
                    //     this.inviteStatus = true;
                    //     this.transparentBgStatus = true;
                    // }else{
                    //     this.oneStatus = false;
                    //     this.transparentBgStatus = false;
                    // }
                    // this.redpackStatus = false;
                } else {
                    this.redpackStatus = true;
                    this.inviteStatus = false;
                    this.transparentBgStatus = true;
                }
            }
            // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
            this.$route.meta.isBack = false;
            // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
            this.isFirstEnter = false;
        },
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import '../style/my-mint.scss';
</style>
<style scoped>


    * {
        margin: 0;
        padding: 0;
    }

    ul,
    li {
        list-style: none;
    }

    .flaot-box {
        position: fixed;
        bottom: 60px;
        right: 10px;
        z-index: 3;
        width: 95px;
    }

    .flaot-box img {
        width: 100%;
        vertical-align: middle;
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

    .aaa {
        width: 100%;
        margin-top: 10px;
    }

    .aaa .left {
        width: 34%;
        height: 84px;
        overflow: hidden;
        float: left;
        margin-right: 6%;
    }

    .aaa .left .imgWrapper {
        height: 84px;
        overflow: hidden;
    }

    .aaa .left img {
        width: 100%;
        min-height: 84px;
        vertical-align: middle;
    }

    .aaa .right {
        width: 58%;
        height: 84px;
        float: left;
        position: relative;
        /* height: 100%; */
    }

    .aaa .right .advert-tile {
        max-height: 68px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .aaa .right .advert-pic {
        font-size: 12px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        color: #999999;
        /* padding-top: 6px; */
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .aaa .right .advert-pic .source {
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
    }

    .aaa .right .advert-pic .date {
        white-space: nowrap;
    }

    .aaa .right .advert-pic .span-pic {
        width: 14%;
    }

    .aaa .right .advert-pic .span-pic img {
        vertical-align: middle;
        width: 100%;
    }

    .bbb {
        /* padding: 15px 0 0 0; */
        margin-top: 10px;
    }

    .bbb .b-title {
        padding-bottom: 10px;
        /* line-height: 28px; */
        /* letter-spacing: 2px; */
        font-size: 16px;
        color: #333333;
    }

    .bbb .b-text {
        padding-top: 10px;
        font-size: 12px;
        vertical-align: middle;
        color: #999;
    }

    .bbb .b-text span {
        padding-left: 10px;
    }

    .bbb .b-pic-wra {
        width: 100%;
        /* overflow: hidden; */
    }

    .bbb .b-pic {
        margin-right: 6px;
        width: 32%;
        float: left;
    }

    .bbb .b-pic:last-child {
        margin-right: 0;
    }

    .bbb .b-pic img {
        width: 100%;
        vertical-align: middle;
        margin-right: 5px;
    }

    .bbb .b-pic img:last-child {
        margin-right: 0;
    }

    .ccc {
        padding-top: 10px;
        position: relative;
    }

    .ccc .adShowWraper{
        position: relative;
    }

    .ccc .adShowWraper .adPeg{
        width:32px;
        position: absolute;
        left: 5px;
        bottom:5px;
    }

    .ccc .video-logo {
        width: 100%;
        vertical-align: middle;
    }

    .ccc .videoLod {
        width: 50px;
        height: 50px;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .ccc .videoLod img {
        width: 100%;
        vertical-align: middle;
    }

    .ccc .title {
        position: absolute;
        left: 0;
        top: 10px;
        font-size: 16px;
        color: #fff;
        background: rgba(0, 0, 0, .3);
        width: 100%;
        /* background: url('../assets/img/voideotitlebg.png') repeat-x; */
    }

    .ccc .title .text {
        padding: 5px 20px;
    }

    .ccc .video-time {
        width: 50px;
        line-height: 20px;
        border: 1px solid #fff;
        border-radius: 15px;
        background: rgba(0, 0, 0, .1);
        color: #fff;
        text-align: center;
        position: absolute;
        right: 10px;
        bottom: 22px;
        font-size: 12px;
    }

    .page-loadmore .nav-swiper {
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #f8f8f8;
        /* font-size: 16px; */
    }

    #swiper-container2 {
        width: 100%;
        font-size: 18px;
        color: #353535;
        font-weight: 500;
        height: 42px;
        line-height: 42px;
    }

    #swiper-container2 .more {
        width: 40px;
        height: 42px;
        position: absolute;
        top: 0;
        right: -1px;
        z-index: 9;
        background: #fff;
        text-align: center;
    }

    #swiper-container2 .more img {
        width: 43%;
        margin: 12px auto;
    }

    #swiper-container2 .swiper-slide:first-child {
        margin-left: 10px;
    }

    #swiper-container2 .swiper-slide {
        /* padding-right: 22px; */
        width: auto;
        padding: 0 10px;
        /* text-align: center; */
    }

    #swiper-container2 .swiper-slide span {
        transition: all 0.3s ease;
        /* display: block; */
    }

    .activeve {
        transform: scale(1.1) !important;
        color: #ff2d2d;
    }

    #swiper-container3 {
        font-size: 16px;
        background: #fff;
    }

    #swiper-container3 .loading-pic {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    #swiper-container3 .neterro {
        width: 80%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 76px;
    }

    .page-loadmore .mint-spinner {
        display: inline-block;
        vertical-align: middle;
    }

    .page-loadmore-wrapper {
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        padding-bottom: 9vh;
    }

    .page-loadmore-desc:last-of-type {
        border-bottom: solid 1px #eee;
    }

    .page-loadmore-list {
        padding: 0 15px;
        /* padding-bottom: 54px; */
        font-family: 'noto';
        background: #fff;
        list-style: none;
    }

    .page-loadmore-list .float-left {
        width: 50%;
        float: left;
        border-bottom: none;
    }

    .page-loadmore-list .float-left:nth-child(even) {
        padding-left: 6px;
    }

    .page-loadmore-list .float-left:nth-child(odd) {
        padding-right: 6px;
    }

    .page-loadmore-list .float-left .picBox {
        position: relative;
        width: 100%;
        height: 220px;
        overflow: hidden;
    }

    .page-loadmore-list .float-left .picBox img {
        width: 100%;
        vertical-align: middle;
    }

    .page-loadmore-list .picBox .pltitle {
        font-size: 14px;
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        line-height: 30px;
        background: rgba(245, 212, 217, .5);
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
    }

    .page-loadmore-listitem {
        padding-bottom: 12px;
        border-bottom: solid 1px #eee;
        /* overflow: hidden; */
    }

    .page-loadmore .mint-spinner {
        display: inline-block;
        vertical-align: middle;
    }

    .page-loadmore-desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px;
    }

    .mint-loadmore-top span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .mint-loadmore-bottom span {
        display: inline-block;
        -webkit-transition: 0.2s linear;
        transition: 0.2s linear;
        vertical-align: middle;
    }

    .mint-loadmore-bottom span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .loading-background,
    .mint-loadmore-top span {
        -webkit-transition: 0.2s linear;
        transition: 0.2s linear;
    }

    .mint-loadmore-top span {
        display: inline-block;
        vertical-align: middle;
    }

    .mint-loadmore-top span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .mint-loadmore-top {
        margin-top: -50px;
    }

    /* .mint-loadmore-bottom {
        margin-bottom: -50px;
    } */
    .float_1, .float_2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -40%);
        -webkit-transform: translate(-50%, -40%);
        width: 80%;
        z-index: 100;
        text-align: center;
    }

    .float_1_exit {
        width: 40px;
        height: 40px;
        background: url(../assets/img/wx.png) no-repeat center;
        background-size: 50% 50%;
        -webkit-background-size: 50% 50%;
        position: absolute;
        right: 12%;
        top: 2%;
    }

    .float_2_exit {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 10%;
        /*top: -12%;*/
        background: url(../assets/img/cx.png) no-repeat center;
        background-size: 65%;
        -webkit-background-size: 65%;
    }

    .float_1_txt {
        position: absolute;
        top: 8%;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        text-align: center;
    }

    .float_1_txt span {
        display: block;
        text-align: center;
        color: #f7eab3;
        margin: 0 auto;
    }

    .float_1_txt_1 {
        font-size: 21px;
        height: 40px;
        line-height: 40px;
        letter-spacing: 2px;

    }

    .float_1_txt_2 {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
    }

    .float_1_txt_3 {
        font-size: 38px;
        height: 80px;
        line-height: 80px;
    }

    .float_1_bottom {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        color: #f7eab3;
    }

    .float_1_btn {
        width: 100px;
        height: 100px;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
    }

    .float_1_img {
        width: 80%;
        height: auto;
    }
    .float_1_img_btn{
        position:absolute;
        width:100%;
        left:0;
        bottom:0;
    }
    .float_1_img_btn img{
        width:70%;
        margin:0 auto;
    }
    .transparentBg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        background: #333;
        opacity: .5;
    }

    /* .page-lazyload-image[lazy=loading] {
        width: 32%;
        height: auto;
        margin: auto;
        background:red;
    } */
    .getGolds {
        position: fixed;
        left: 0;
        right: 0;
        top:0;
        bottom:0;
        margin:auto;
        width: 80%;
        height: 65%;
        z-index: 999;
    }

    .getGoldsBg {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 998;
    }

    .getGolds .SignGoldContent {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 8px;
        padding: 0 10px;
    }

    .getGolds .SignGoldContent .fuckMoreTop {
        width: 100%;
        height: 90px;
    }

    .getGolds .SignGoldContent .fuckCon {
        height: 65%;
        overflow-y: auto;
    }

    .getGolds .SignGoldContent .cliMoreCons {
        width: 100%;
        height: 50px;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .getGolds .SignGoldContent .cliMoreCons .clickMore {
        text-align: center;
        position: absolute;
        top:0;
        right: 0;
        bottom:0;
        left: 0;
        margin:auto;
        width: 130px;
        height: 24px;
        line-height:24px;
        border-radius: 16px;
        background: red;
        color: #fff;
    }

    .getGolds .SignGoldContent .moreInfo {
        width: 100%;
        padding-bottom: 10px;
        padding-top: 10px;
        border-bottom: 1px solid #eee;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-text {
        font-size: 12px;
        color: #999;
        padding-top: 5px;
        dispaly: flex;
        align-items: center;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-text .date {
        transform: scale(.8);
        -webkit-transform: scale(.8);
        padding-top: 2px;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-title {
        font-size: 14px;
        padding-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic-wra {
        width: 100%;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic {
        margin-right: 5px;
        width: 32%;
        float: left;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic:last-child {
        margin-right: 0px;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-one .moreInfo-one-pic img {
        width: 100%;
        vertical-align: middle;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two {
        width: 100%;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .left {
        width: 34%;
        height: 75px;
        overflow: hidden;
        float: left;
        margin-right: 6%;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .left img {
        width: 100%;
        min-height: 75px;
        vertical-align: middle;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .right {
        width: 58%;
        height: 70px;
        float: left;
        position: relative;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .tile {
        max-height: 56px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        font-size: 14px;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text {
        font-size: 12px;
        white-space: nowrap;
        color: #999999;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text .date {
        white-space: nowrap;
        transform: scale(.8);
        -webkit-transform: scale(.8);
        padding-top: 2px;
    }

    .getGolds .SignGoldContent .moreInfo .moreInfo-two .right .text .source {
        width: 60px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .getGolds .SignGoldContent .fanhui {
        position: absolute;
        right: 0;
        top: 0;
        width: 50px;
        height: 50px;
    }

    .getGolds .SignGoldContent .explainBg {
        width: 100%;
    }

    .getGolds .SignGoldContent .fanhui img {
        width: 12px;
        margin-left: 24px;
        margin-top: 12px;
    }

    .getGolds .SignGoldContent .signGoldTop {
        width: 206px;
        margin: 0 auto;
        padding-left: 5px;
    }

    .getGolds .SignGoldContent .signGoldTop-left {
        float: left;
        width: 70px;
    }

    .getGolds .SignGoldContent .signGoldTop-left img {
        width: 100%;
        vertical-align: middle;
    }

    .getGolds .SignGoldContent .signGoldTop-right {
        float: left;
        padding-top: 10px;
        line-height: 26px;
        font-size: 14px;
    }

    .getGolds .SignGoldContent .signGoldTop-right .title {
        font-weight: 700;
        font-size: 16px;
    }

    .getGolds .SignGoldContent .signGoldTop-right .gold {
        color: #e53526;
    }

    .chooseSex {
        width: 100%;
        height: 100%;
        background: url('../assets/img/sexbackground.png') no-repeat;
        z-index: 999;
        position: fixed;
        left: 0;
        top: 0;
    }

    .chooseSex .title {
        width: 100%;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 165px;
        color: #fff;
        transform:translate(-50%);
        -ms-transform:translate(-50%); 	/* IE 9 */
        -moz-transform:translate(-50%); 	/* Firefox */
        -webkit-transform:translate(-50%); /* Safari 和 Chrome */
        -o-transform:translate(-50%);
    }

    .chooseSex .title .title-sex {
        font-size: 18px;
        padding-bottom: 6px;
    }

    .chooseSex .title .title-info {
        font-size: 14px;
    }

    .chooseSex .sexPic {
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%);
        -ms-transform:translate(-50%); 	/* IE 9 */
        -moz-transform:translate(-50%); 	/* Firefox */
        -webkit-transform:translate(-50%); /* Safari 和 Chrome */
        -o-transform:translate(-50%);
        width: 100%;
        display: flex;
        display: -webkit-box;
        display: -ms-flexbox;
        align-items: center;
        text-align: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        color: #fff;
    }

    .chooseSex .sexPic div {
        flex: 1;
    }

    .chooseSex .sexPic div img {
        height: 70px;
    }

    /* .add_class{
        height: 193px;
    } */
    .sogouAd{
        width:100%;
        height:100px;
        padding-top:10px;
    }
    .sgThree{
        height:130px;
    }
</style>
