<template>
    <div class="videos" style="height:100vh;overflow:hidden!important;">
        <div class="video-content">
            <div class="video-nav">
                <div class="swiper-container" id="swiper-container-nav">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in videoList" :class="{'navActive':index==0}">
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container-video">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in videoList">
                        <div class="page-loadmore-wrapper" ref="wrapper" :style="{height:wrapperHeight+'px'}">
                            <mt-loadmore :bottom-method="loadBottom" :top-method="loadTop"
                                         :bottom-all-loaded="allLoaded" ref="loadmore"
                                         @bottom-status-change="handleBottomChange" @top-status-change="handleTopChange"
                                         :autoFill=false :bottomDistance=0>
                                <ul class="page-loadmore-list clearfloat">
                                    <li v-if="item.id!='sv_dy'" class="page-loadmore-listitem"
                                        v-for="items in item.val">
                                        <div class="videoCSS"
                                             @click="goVideo(items.url,type,items.title,index,items.mulImg,items.pk,items.videoAttr)">
                                            <img class="video-logo" v-lazy="items.mulImg" :key="items.mulImg" alt="">
                                            <!-- <img class="video-pic" src="../assets/img/videomypic.jpg" alt=""> -->
                                            <!-- <div class="source"></div> -->
                                            <div class="title">
                                                <div class="text">{{items.title}}</div>
                                                <div class="watchTatol"></div>
                                            </div>
                                            <div class="videoLod"><img src="../assets/img/videoPause.png" alt=""></div>
                                            <div class="video-time" v-if="items.duration!=''">{{items.duration}}</div>
                                        </div>
                                    </li>
                                    <li v-if="item.id=='sv_dy'" class="page-loadmore-listitem dyContent"
                                        v-for="(items,index) in $store.state.dyVideoList" :id="'video'+index">
                                        <div class="dyBox clearfloat" @click="goVideo(items.url,type,items.title,index,'',items.pk,items.videoAttr)">
                                            <img v-lazy="items.mulImg" :key="items.mulImg"  alt="">
                                            <div class="dyVideoLod"><img src="../assets/img/videoPause.png" alt="">
                                            </div>
                                            <div class="dyTitle">{{items.title}}</div>
                                            <div class="dyTime">{{items.duration}}</div>
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
                <!-- <img class="neterro" v-if="$store.state.noNetPic" src="../assets/img/nonet.png" alt=""> -->
                <img v-if="loadingpic" class="loading-pic" src="../assets/img/loadingmore.jpg" alt="">
            </div>
        </div>
        <img class="neterro" v-if="$store.state.noNetPic" src="../assets/img/nonet.png" alt="">
        <float></float>
        <bottom-nav v-on:refreshVideoList="loadTop"></bottom-nav>
        <!--<div class="flaot-box" @click="goUrl"><img src="../assets/img/hongbao.gif" alt=""></div>-->
    </div>
</template>
<script>
    import bottomNav from 'components/bottomNav';
    import float from 'components/float';

    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.min.css';
    import {Indicator} from 'mint-ui';

    export default {
        name: 'videos',
        data() {
            return {
                videoList: [],
                // videoChannel:[],
                allLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                autoFill: false,
                index: 0,
                popHeight: 0,
                Media: '',
                type: '',
                isFirstEnter: false, // 是否第一次进入，默认false
                loadingpic: false,
            };
        },
        components: {
            bottomNav,
            float,
        },
        created() {
            this.isFirstEnter = true;
        },
        activated() {
            if (!this.$route.meta.isBack || this.isFirstEnter) {
                // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
                let _this = this;
                this.videoChanel();
            } else {
                //重置scrollTop
                let scrollTop = sessionStorage.getItem('videoScroll').split(',');
                scrollTop.forEach((item, i) => {
                    $('.page-loadmore-wrapper').eq(i).scrollTop(parseInt(item));
                });
                //小视频频道滚动条重置
                if (this.$store.state.smallVideoHash != '') {
                    let index = 0;
                    this.videoList.forEach((item, i) => {
                        item.id == 'sv_dy' ? index = i : null;
                    });
                    let anchor = this.$el.querySelector('#video' + this.$store.state.smallVideoHash);
                    $('.page-loadmore-wrapper').eq(index).scrollTop(anchor.offsetTop);
//                    let scrollTop = sessionStorage.getItem('videoScroll').split(',');
//                    scrollTop[index]=anchor.offsetTop;
//                    sessionStorage.setItem("videoScroll", scrollTop);
                    this.$store.state.smallVideoHash = '';
                }
            }
            // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
            this.$route.meta.isBack = false;
            // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
            this.isFirstEnter = false;
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - 57;
            $('#swiper-container-nav .swiper-slide').eq(0).addClass('navActive');
            var navSwiper = new Swiper('#swiper-container-nav', {
                freeMode: true,
                freeModeMomentumRatio: 0.5,
                slidesPerView: 'auto',
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });
            var _this = this;
            navSwiper.on('tap', function () {
                var swiperWidth = navSwiper.el.clientWidth;
                var maxTranslate = navSwiper.maxTranslate();
                var maxWidth = -maxTranslate + swiperWidth / 2;
                contentSwiper.slideTo(navSwiper.clickedIndex, 300);
                var slide = navSwiper.slides[navSwiper.clickedIndex];
                var slideLeft = slide.offsetLeft;
                var slideWidth = slide.clientWidth;
                var slideCenter = slideLeft + slideWidth / 2;
                // 被点击slide的中心点
                navSwiper.setTransition(300);
                if (slideCenter < swiperWidth / 2) {
                    navSwiper.setTranslate(0);
                } else if (slideCenter > maxWidth) {
                    navSwiper.setTranslate(maxTranslate);
                } else {
                    var nowTlanslate = slideCenter - swiperWidth / 2;
                    navSwiper.setTranslate(-nowTlanslate);
                }
                $('#swiper-container-nav  .navActive').removeClass('navActive');
                $('#swiper-container-nav .swiper-slide').eq(navSwiper.clickedIndex).addClass('navActive');
            });
            var contentSwiper = new Swiper('#swiper-container-video', {
                on: {
                    slideChangeTransitionStart: function () {
                        _this.index = contentSwiper.activeIndex;
                        _this.channelUpload(2, _this.videoList[contentSwiper.previousIndex].id, _this.videoList[contentSwiper.activeIndex].id);
                        updateNavPosition();
                    },
                    slideChangeTransitionEnd: function () {
                        _this.type = _this.videoList[contentSwiper.activeIndex].id;
                        // console.log(contentSwiper.activeIndex);
                        _this.videoInfoList(_this.type, contentSwiper.activeIndex);
                    }
                },
                resistanceRatio: 0,//边缘抵抗力
                direction: 'horizontal',//横向切换
                observeParents: true,
                touchRatio: 1,
                speed: 100,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });

            function updateNavPosition() {
                $('#swiper-container-nav .navActive').removeClass('navActive');
                var activeNav = $('#swiper-container-nav .swiper-slide').eq(contentSwiper.activeIndex).addClass('navActive');
                if (!activeNav.hasClass('swiper-slide-visible')) {
                    if (activeNav.index() >= navSwiper.activeIndex) {
                        var thumbsPerNav = Math.floor(navSwiper.width / (activeNav.width() + 20)) - 1;
                        navSwiper.slideTo(activeNav.index() - thumbsPerNav);
                    }
                    else {
                        navSwiper.slideTo(activeNav.index());
                    }
                }
            }
        },
        methods: {
            goUrl() {
                if(!this.isLogin()){
                    return false;
                }else{
                    this.$router.push({path:'activity'});
                }
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
                var types = this.videoList[this.index].id;
                this.videoInfoListRefresh(types, this.index);
                $('.page-loadmore-wrapper').eq(this.index).scrollTop(0);
            },
            /*底部加载*/
            loadBottom() {
                var types = this.videoList[this.index].id;
                this.videoInfoListMore(types, this.index);
            },
            /*视频频道*/
            videoChanel() {
                if (!this.networkStatus()) {
                    return false;
                }
                this.networkType();//获取网络类型
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetVideoChannels,
                    params: {
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        // fr: this.$store.state.platForm
                    }
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.videoList = res.data.channels;
                        this.type = this.videoList[0].id;
                        // console.log(this.videoList[0].id);
                        this.videoInfoList(this.videoList[0].id);
                    } else {
                        this.videoChanel();
                        console.log(2);
                    }
                }).catch(err => {
                    console.log(1);
                    this.videoChanel();
                });
            },
            /*去详情页*/
            goVideo(url, type, title, index, videoPoster, pk,videoAttr) {
                this.detailClickUpload(2, type, title, pk);
                this.$router.push({
                    path: 'videodetail',
                    query: {url: url, type: type, title: title, index: index, videoPoster: videoPoster,videoAttr:videoAttr}
                });
            },
            /*刷新视频*/
            videoInfoListRefresh(type, index) {
                this.networkType();//获取网络类型
                this.refreshUpload(2, 1, this.videoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetVideoList,
                    params: {
                        type: type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        fr: this.$store.state.platForm
                    },
                    headers: {'uuid': uuid},
                }).then(res => {
                    if (res.status == 200) {
                        this.videoList[index].val = [];
                        var data = res.data.vlist;
                        for (var j = 0; j < data.length; j++) {
                            data[j].url = data[j].url[0];
                        }
                        if (type != 'sv_dy') {
                            this.videoList[this.index].val = data;
                        } else if (type == 'sv_dy') {
                            this.$store.state.dyVideoList = data;
                        }
                        this.$refs.loadmore[this.index].onTopLoaded();
                        Indicator.close();
                    } else {
                        Indicator.close();
                    }
                }).catch(err => {
                    Indicator.close();
                });
            },
            /*视频列表*/
            videoInfoList(type, index) {
                if (!this.networkStatus()) {
                    return false;
                }
                this.networkType();
                if (this.videoList[this.index].val.length > 0) {
                    return false;
                }
                this.loadingpic = true;
                this.refreshUpload(2, 1, this.videoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetVideoList,
                    params: {
                        type: type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        fr: this.$store.state.platForm
                    },
                    headers: {'uuid': uuid},
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        var data = res.data.vlist;
                        for (var j = 0; j < data.length; j++) {
                            data[j].url = data[j].url[0];
                        }
                        this.videoList[this.index].val = data;
                        this.loadingpic = false;
                        if (type == 'sv_dy') {
                            console.log(data);
                            this.$store.state.dyVideoList = data;
                        }
                    }
                }).catch();
            },
            /*上拉加载更多*/
            videoInfoListMore(type, index) {
                this.networkType();//获取网络类型
                this.refreshUpload(2, 2, this.videoList[this.index].id);
                let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
                this.$http({
                    method: 'get',
                    url: this.apiUrl.newsGetVideoList,
                    params: {
                        type: type,
                        imei: this.$store.state.deviceuuid,
                        nt: this.$store.state.network,
                        // ve: this.$store.state.version,
                        fr: this.$store.state.platForm
                    },
                    headers: {'uuid': uuid},
                }).then(res => {
                    if (res.status == 200) {
                        var data = res.data.vlist;
                        for (var j = 0; j < data.length; j++) {
                            data[j].url = data[j].url[0];
                        }
                        if (type != 'sv_dy') {
                            for (var i = 0; i < data.length; i++) {
                                this.videoList[this.index].val.push(data[i]);
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                this.$store.state.dyVideoList.push(data[i]);
                            }
                        }
                        this.$refs.loadmore[this.index].onBottomLoaded();
                    }
                }).catch();
            }
        },
    };
</script>
<style>
    * {
        padding: 0;
        margin: 0;
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

    .videos .video-content .video-nav {
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
    }

    #swiper-container-nav {
        width: 100%;
        font-size: 16px;
        color: #353535;
        height: 42px;
        line-height: 42px;
    }

    #swiper-container-nav .swiper-slide {
        width: auto;
        padding: 0 10px;
    }

    #swiper-container-nav .swiper-slide span {
        transition: all 0.3s ease;
    }

    .navActive {
        transform: scale(1.1) !important;
        color: #ff2d2d;
    }

    #wiper-container-video {
        background: #fff;
        font-family: 'noto';
    }

    .loading-pic {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .page-loadmore-wrapper {
        overflow-y: auto;
        box-sizing: border-box;
        padding-bottom: 9vh;
    }

    .page-loadmore-list {
        width: 100%;
        font-family: 'noto';
        background: #fff;
        list-style: none;
        padding: 0 10px;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS {
        position: relative;
        max-height: 214px;
        padding-bottom: 10px;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .video-logo {
        width: 100%;
        height: auto;
        vertical-align: middle;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .video-pic {
        width: 40px;
        border-radius: 50%;
        position: absolute;
        left: 15px;
        bottom: 40px;
        vertical-align: middle;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .source {
        /* line-height: 50px; */
        /* padding-left: 20px; */
        height: 10px;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .title {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 16px;
        color: #fff;
        background: rgba(0, 0, 0, .3);
        /* background: url('../assets/img/voideotitlebg.png') repeat-x; */
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .title .text {
        padding: 5px 20px;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .title .watchTatol {
        font-size: 12px;
        font-weight: normal;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .videoLod {
        width: 50px;
        height: 50px;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .videoLod img {
        width: 100%;
        height: auto;
        vertical-align: middle;
    }

    .page-loadmore-list .page-loadmore-listitem .videoCSS .video-time {
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

    .mint-loadmore-top span {
        display: inline-block;
        vertical-align: middle;
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

    .mint-popup-right {
        width: 100%;
        height: 100%;
    }

    .videos .neterro {
        width: 80%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 45px;
    }

    .videos .dyContent {
        width: 50%;
        float: left;
        padding-bottom: 12px;
    }

    .videos .dyContent:nth-child(even) {
        padding-left: 6px;
    }

    .videos .dyContent:nth-child(odd) {
        padding-right: 6px;
    }

    .videos .dyBox {
        width:100%;
        height: 280px;
        overflow-y: hidden;
        position: relative;
        background: #000;
    }

    .videos .dyBox img {
        width: 100%;
        height: auto;
        vertical-align: middle;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .videos .dyBox .dyTitle {
        text-align: center;
        line-height: 30px;
        position: absolute;
        left: 0;
        bottom: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        background: rgba(0, 0, 0, .3);
    }

    .videos .dyBox .dyTime {
        position: absolute;
        right: 10px;
        bottom: 35px;
        color: #fff;
        background: rgba(0, 0, 0, .3);
        border-radius: 10px;
        font-size: 12px;
        width: 40px;
        text-align: center;
        line-height: 18px;
    }

    .videos .dyBox .dyVideoLod {
        width: 50px;
        height: 50px;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .videos .dyBox .dyVideoLod img {
        width: 100%;
        vertical-align: middle;
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
    /* video::-webkit-media-controls-fullscreen-button{ display: block; }
    video::-webkit-media-controls-time-remaining-display{display: block}
    video::-webkit-media-controls-current-time-display{display: block} */
</style>

