<template>
    <div class="videoDetail">
        <div v-if="videoType!='sv_dy'">
            <div class="fixedTop">
                <div class="videoInfo">
                    <video id="media" height="200" width="100%" controls :src="videoSrc" controlsList="nodownload"
                           :poster="videoPoster"></video>
                    <div class="fxbtnBox" @click="pauseVideo">
                        <img src="../assets/img/requestFH.png" alt="">
                    </div>
                </div>
            </div>
            <div class="poprights">
                <div class="videoOthers">
                    <div class="votherInfo">
                        <div class="title">{{videoTitle}}</div>
                        <!-- <div class="watchNum">
                            <span class="wnums">54次观看</span>
                            <span>2017-08-02 00:00 发布</span>
                        </div>
                        <div class="personInfo">
                            <img src="../assets/img/videomypic.jpg" alt="">
                            <span>啦啦啦</span>
                        </div> -->
                    </div>
                    <div class="recommend">
                        <span>相关推荐</span>
                    </div>
                    <div class="recommendInfo clearfloat">
                        <div class="page-infinite-wrapper" ref="wrapperVideo" :style="{ height: overHeight + 'px' }">
                            <ul class="page-infinite-list" v-infinite-scroll="loadMore"
                                infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                                <li v-for="item in deatailList" class="page-infinite-listitem"
                                    @click="refreshList(item.url,item.title,item.mulImg,item.pk)">
                                    <div class="wra clearfloat">
                                        <div class="left">
                                            <div class="image">
                                                <img :src="item.mulImg" alt="">
                                                <div class="videoTime">{{item.duration}}</div>
                                            </div>
                                        </div>
                                        <div class="right">
                                            <p class="advert-tile">{{item.title}}</p>
                                            <!-- <div class="advert-pic">
                                                <span class="source">lalalalal</span>
                                                <span class="date">564次观看</span>
                                            </div> -->
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <p v-show="loading" class="page-infinite-loading">
                                <mt-spinner type="fading-circle"></mt-spinner>
                                加载中...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="dyBox" :style="{height:wHeight+'px'}" @click="playOrPause">
                <div @click="pauseVideo" class="dyBack">
                    <img src="../assets/img/requestFH.png" alt="">
                </div>
                <img v-if="flag" class="pause" src="../assets/img/videoPause.png" alt="">
                <div class="swiper-container" id="dySwiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in $store.state.dyVideoList">
                            <video id="media" src="" :poster="item.mulImg" loop="loop" type="video/mp4"></video>
                            <div class="dyspTitle">{{item.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sircle ref="gxw" :Type="{type:videoType,videoAttr:videoAttr}"></sircle>
    </div>

</template>
<script>
    import {MessageBox} from 'mint-ui';
    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.min.css';
    import sircle from 'components/sircleanimation';

    export default {
        name: 'videodetail',
        data() {
            return {
                Media: '',
                dyMedia: '',
                videoSrc: '',
                videoPoster: '',
                videoType: '',
                videoTitle: '',
                deatailList: [],
                wHeight: 0,
                index: 0,
                flag: false,
                topStatus: '',
                detail_id: '',
                loading: false,
                allLoaded: false,
                overHeight: 0,
                videoAttr:'',
            };
        },
        components: {
            sircle
        },
        created() {
            this.videoSrc = this.$route.query.url;
            this.videoType = this.$route.query.type;
            this.videoPoster = this.$route.query.videoPoster;
            this.videoTitle = this.$route.query.title;
            this.detail_id = this.$route.query.pk;
            this.index = this.$route.query.index;
            this.videoInfoList(this.videoType);
            this.videoAttr = this.$route.query.videoAttr;
            if (this.videoType != 'sv_dy') {
                this.videoInfoList(this.videoType);
            }
            this.phoneBack();
        },
        updated: function () {
            this.$nextTick(function () {
                if (this.videoType != 'sv_dy') {
                    this.overHeight = document.documentElement.clientHeight - this.$refs.wrapperVideo.getBoundingClientRect().top;
                }
            });
        },
        mounted() {
            var _this = this;
            // this.overHeight = document.documentElement.clientHeight - 208;
            this.wHeight = document.documentElement.clientHeight;
            if (this.videoType != 'sv_dy') {
                this.Media = document.getElementById('media');
                this.playVideo();
                // this.$store.state.videoState = this.Media.paused;
            } else {
                // console.log(this.$store.state.dyVideoList.length);
                this.Media = document.getElementsByTagName('video');
                if (this.index == 0) {
                    this.Media[0].src = this.$store.state.dyVideoList[0].url;
                    this.$store.state.smallVideoHash = 0;
                    this.playVideo(0);
                    this.smallVideoUpload(this.videoType, this.videoTitle, this.detail_id, 0);
                }else if(this.index==this.$store.state.dyVideoList.length-1){
                    this.videoInfoListMore(this.videoType);
                }
            }
            var dySwiper = new Swiper('#dySwiper', {
                on: {
                    slideChangeTransitionStart: function () {
                        _this.index = this.activeIndex;
                        _this.Media[this.activeIndex].src = _this.$store.state.dyVideoList[this.activeIndex].url;
                        _this.Media[this.previousIndex].currentTime = 0;
                        // console.log('视频id:' + this.activeIndex);
                        _this.$store.state.smallVideoHash = this.activeIndex;
                        _this.flag = false;
                        let activeObj = _this.$store.state.dyVideoList[this.activeIndex];
                        _this.smallVideoUpload(_this.videoType, activeObj.title, activeObj.pk, this.activeIndex);
                    },
                    slideChangeTransitionEnd: function () {
                        for (var j = 0; j < _this.Media.length; j++) {
                            if (j != this.activeIndex) {
                                _this.Media[j].src = '';
                            }
                        }
                        if (_this.flag == false) {
                            _this.playVideo(_this.index);
                        }
                        _this.Media[this.previousIndex].pause();
                        if (this.isEnd) {
                            // console.log('last：' + this.isEnd);
                            _this.videoInfoListMore(_this.videoType);
                        }
                    },
                },
                direction: 'vertical',
                initialSlide: _this.index,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });
        },
        methods: {
            /*手机按键返回*/
            phoneBack() {
                let _this = this;
                plus.key.addEventListener('backbutton', function () {
                    _this.etime = Date.parse(new Date());
                    clearInterval(_this.$store.state.draw);
                    clearTimeout(_this.$store.state.timeOut);
                    localStorage.setItem('hasLoaded',_this.$store.state.hasLoaded);
                });
            },
            /*暂停播放*/
            pauseVideo() {
                clearInterval(this.$store.state.draw);
                clearTimeout(this.$store.state.timeOut);
                localStorage.setItem('hasLoaded',this.$store.state.hasLoaded);
                if (this.videoType != 'sv_dy') {
                    this.Media.pause();
                } else {
                    this.Media[this.index].pause();
                }
                this.$router.go(-1);
            },
            /*开始播放*/
            playVideo(index) {
                let _this = this;
                // console.log(this.$store.state.videoNetwork);
                if (this.$store.state.videoNetwork) {
                    this.networkType();
                    if (this.$store.state.network != '2') {
                        MessageBox.confirm('', {
                            message: '当前不是WIFI状态，是否继续播放？',
                            title: '温馨提示',
                            confirmButtonText: '继续播放',
                            cancelButtonText: '停止播放'
                        }).then(action => {
                            if (action == 'confirm') {     //确认的回调
                                _this.$store.state.videoNetwork = false;
                                if (_this.videoType != 'sv_dy') {
                                    _this.Media.play();
                                    // _this.$refs.gxw.dataInfo();
                                } else {
                                    _this.Media[index].play();
                                }
                            }
                        }).catch(err => {
                            if (err == 'cancel') {     //取消的回调
                               console.log(_this.Media.paused)
                            }
                        });
                    } else {
                        if (this.videoType != 'sv_dy') {
                            this.Media.play();
                        } else {
                            this.Media[index].play();
                        }
                    }
                } else {
                    if (this.videoType != 'sv_dy') {
                        this.Media.play();
                    } else {
                        this.Media[index].play();
                    }
                }
            },
            /*视频列表*/
            videoInfoList(type) {
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
                        for (var i = 0; i < data.length; i++) {
                            data[i].url = data[i].url[0];
                        }
                        this.deatailList = data;
                    }
                }).catch();
            },
            /*点击推荐*/
            refreshList(url, title, pk, img) {
                this.detailClickUpload(2, this.videoType, title, pk);
                this.videoPoster = img;
                this.videoSrc = url;
                this.videoTitle = title;
                this.deatailList = [];
                this.videoInfoList(this.videoType);
                setTimeout(() => {
                    this.playVideo();
                }, 100);
            },
            /*暂停或则播放*/
            playOrPause() {
                if (!this.flag) {
                    this.Media[this.index].pause();
                    this.flag = true;                
                    // clearInterval(this.$store.state.draw);
                    // clearTimeout(this.$store.state.timeOut);
                } else {
                    this.Media[this.index].play();
                    this.flag = false;
                }
            },
            /*上拉加载更多*/
            videoInfoListMore(type) {
                this.networkType();//获取网络类型
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
                        // console.log(res);
                        var data = res.data.vlist;
                        for (var j = 0; j < data.length; j++) {
                            data[j].url = data[j].url[0];
                        }
                        if (type == 'sv_dy') {
                            for (var i = 0; i < data.length; i++) {
                                this.$store.state.dyVideoList.push(data[i]);
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                this.deatailList.push(data[i]);
                                this.loading = false;
                            }
                        }
                    }
                }).catch();
            },
            loadMore() {
                this.loading = true;
                this.videoInfoListMore(this.videoType);
            },
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

    #media {
        background: rgba(0, 0, 0);
    }

    .videoDetail .fixedTop {
        width: 100%;
        height: 203px;
    }

    .videoDetail .fixedTop .videoInfo .fxbtnBox {
        position: fixed;
        width: 50px;
        height: 50px;
        z-index: 2;
        left: 0;
        top: 0;
        text-align: center;
    }

    .videoDetail .fixedTop .videoInfo .fxbtnBox img {
        width: 15px;
        margin-top: 10px;
        width: 15px;
    }

    .videoDetail .fixedTop .videoInfo video {
        width: 100%;
    }

    .videoDetail .poprights {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .videoDetail .poprights .videoOthers .votherInfo {
        padding: 20px 0;
    }

    .videoDetail .poprights .videoOthers .votherInfo .title {
        line-height: 22px;
        font-size: 16px;
        font-weight: 700;
        font-family: 'noto';
    }

    .videoDetail .poprights .videoOthers .votherInfo .watchNum {
        line-height: 28px;
        font-size: 12px;
        color: #999;
    }

    .videoDetail .poprights .videoOthers .votherInfo .personInfo {
        padding-bottom: 10px;
    }

    .videoDetail .poprights .videoOthers .votherInfo .personInfo img {
        width: 32px;
        border-radius: 50%;
        vertical-align: middle;
    }

    .videoDetail .poprights .videoOthers .votherInfo .personInfo span {
        vertical-align: middle;
        font-size: 12px;
        color: #999;
    }

    .videoDetail .poprights .videoOthers .votherInfo .watchNum .wnums {
        padding-right: 20px;
    }

    .videoDetail .poprights .videoOthers {
        padding: 0 20px;
    }

    .videoDetail .poprights .videoOthers .recommend {
        padding: 15px 0;
        font-size: 16px;
        font-weight: 600;
    }

    .videoDetail .poprights .videoOthers .recommend span {
        padding-left: 10px;
        border-left: 4px solid #e53526;
    }

    .videoDetail .poprights .videoOthers .recommendInfo {
        overflow-y: auto;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .wra {
        /* padding: 15px 0; */
        padding-bottom: 15px;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .left {
        width: 34%;
        float: left;
        margin-right: 6%;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .left .image {
        position: relative;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .left .videoTime {
        width: 34px;
        height: 15px;
        border-radius: 10px;
        text-align: center;
        position: absolute;
        right: 3px;
        bottom: 2px;
        font-size: 12px;
        color: #fff;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .left img {
        width: 100%;
        height: 68px;
        vertical-align: middle;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .right {
        width: 58%;
        float: left;
        position: relative;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .right .advert-tile {
        max-height: 68px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-family: 'noto';
    }

    .videoDetail .poprights .videoOthers .recommendInfo .right .advert-pic .source {
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
        line-height: 30px;
        font-size: 12px;
    }

    .videoDetail .poprights .videoOthers .recommendInfo .right .advert-pic .date {
        font-size: 12px;
    }

    video::-webkit-media-controls-fullscreen-button {
        display: block;
    }

    video::-webkit-media-controls-volume-slider {
        display: block !important;
        padding: 0;
    }

    video::-webkit-media-controls-time-remaining-display {
        display: block !important;
    }

    video::-webkit-media-controls-current-time-display {
        display: block !important;
    }

    video::-webkit-media-controls-timeline {
        padding: 0 !important;
    }

    video::-webkit-media-controls-mute-button {
        width: 20px;
    }

    video::-webkit-media-controls {
        overflow: hidden !important;
    }

    .videoDetail .dyBox {
        width: 100%;
        height: 100%;
        /* background: rgba(0,0,0,.8); */
        position: relative;
    }

    .videoDetail .dyBox video {
        width: 100%;
        height: 100%;
    }

    .videoDetail .dyBox .dyspTitle {
        position: absolute;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
        width: 100%;
        padding-left: 15px;
        line-height: 28px;
        color: #fff;
        font-size: 14px;
    }

    .videoDetail .swiper-container {
        width: 100%;
        height: 100%;
    }

    .videoDetail .dyBox .dyBack {
        position: fixed;
        width: 50px;
        height: 50px;
        z-index: 2;
        left: 0;
        top: 0;
        text-align: center;
    }

    .videoDetail .dyBox .dyBack img {
        margin-top: 10px;
        width: 15px;
    }

    .videoDetail .dyBox .pause {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        width: 50px;
    }

    .page-infinite-wrapper {
        margin-top: -1px;
        overflow: scroll;
    }

    .page-infinite-loading {
        text-align: center;
        height: 50px;
        line-height: 50px;
    }

    .page-infinite-loading div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
</style>

