import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import {Toast,MessageBox} from 'mint-ui';

var mixin = {
    data: () => {
        return {
            apiUrl: {
                newsPull: '/tt/api/news/pull',
                newsRefresh: '/tt/api/news/refresh',
                newsGetDetail: '/tt/api/news/getDetail',
                newsReport: '/tt/api/news/report',
                userGetCode: '/tt/api/user/getcode',
                userLogin: '/tt/api/user/login',
                userWxLogin: '/tt/api/user/welogin',
                userGetUser: '/tt/api/user/getuser',
                userUpdateNick: '/tt/api/user/updatenick',
                userBindPhone: '/tt/api/user/bindphone',
                userUpdateBirthday: '/tt/api/user/updatebirthday',
                userUpdateSex: '/tt/api/user/updatesex',
                userUpdateImage: '/tt/api/user/updateimage',
                userQuit: '/tt/api/user/quit',
                taskHour: '/tt/api/task/hour',
                taskVisit: '/tt/api/task/visit',
                mentorIsmentor: '/tt/api/mentor/ismentor',
                taskBalance: '/tt/api/task/balance',
                mentorList: '/tt/api/mentor/list',
                mentorCreateMentor: '/tt/api/mentor/creatementor',
                taskDepsiHistory: '/tt/api/task/depsitHistory',
                taskSiginList: '/tt/api/task/siginList',
                taskSigin: '/tt/api/task/sigin',
                taskMyTaskList: '/tt/api/task/myTaskList',
                taskOnce: '/tt/api/task/once',
                taskDay: '/tt/api/task/day',
                shareApprentice: '/tt/api/share/apprentice',
                userBindWechat: '/tt/api/user/bindwechat',
                taskDoneDay: '/tt/api/task/done_day',
                shareAwaken: '/tt/api/share/awaken',
                cashGet: '/tt/api/cash/get',
                cashBindAccount: '/tt/api/cash/bindaccount',
                cashApply: '/tt/api/cash/apply',
                questionSubmit: '/tt/api/question/submit',
                newsGetVideoList: '/tt/api/news/getvideolist',
                newsGetArticle: '/tt/api/news/getarticle',
                newsGetNewsChannels: '/tt/api/news/getnewschannels',
                newsGetVideoChannels: '/tt/api/news/getvideochannels',
                taskTaskInfo: '/tt/api/task/tasksInfo',
                newsGetAccessToken: '/tt/api/news/getaccesstoken',
                shareGetCashList: '/tt/api/share/getcashlist',
                cashOrders: '/tt/api/cash/orders',
                fictionPull: '/tt/api/fiction/pull',
                fictionCatalog: '/tt/api/fiction/catalog',
                fictionContent: '/tt/api/fiction/content',
                taskShare:'/tt/api/task/share',
                adCarousel:'/tt/api/ad/carousel',
                adDetailad:'/tt/api/ad/detailad',
                taskWallList:'/tt/api/task/wallList',
                taskDoneWall:'/tt/api/task/done_wall',
                taskWall:'/tt/api/task/wall'
            }
        };
    },
    methods: {
        /*格式化时间*/
        formatDateTime(date, format) {
            if (!date) {
                return '';
            }
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            if (format == 'y-m-d h-m-s') {
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            } else if (format == 'h-m') {
                return ' ' + h + ':' + minute;
            } else if (format == 'y-m-d') {
                return y + '-' + m + '-' + d;
            } else if (format == 'y/m/d') {
                return y + '/' + m + '/' + d;
            } else if (format == 'ymd') {
                return y + '' + m + '' + d;
            }
        },
        /*isLogin*/
        isLogin() {
            if (JSON.parse(localStorage.getItem('kdtt')) == null) {
                // Toast({
                //     message: '请先登录',
                //     position: 'bottom',
                //     duration:1000
                // });
                this.$router.push({
                    path: 'login',
                });
                return false;
            } else {
                return true;
            }
        },
        /*解密*/
        decrypt(encrypted, key) {
            if (!encrypted)
                return '';
            var keys = CryptoJS.enc.Latin1.parse(key);
            var decrypted = CryptoJS.AES.decrypt(encrypted, keys, {
                iv: keys,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        },
        /*加密*/
        encrypt(encrypted, key) {
            if (!encrypted)
                return '';
            var keys = CryptoJS.enc.Latin1.parse(key);
            var decrypted = CryptoJS.AES.encrypt(encrypted, keys, {
                iv: keys,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString();
            return decrypted;
        },
        /*MD5*/
        getmd5(str) {
            var md5 = crypto.createHash('md5');
            md5.update(str);
            return md5.digest('hex');
        },
        /*token,siagn*/
        creatSiagn(uri) {
            let timestamp = localStorage.getItem('timestamp') != null ? localStorage.getItem('timestamp') : 0;
            this.times = Date.parse(new Date()) / 1000 + parseInt(timestamp);
            this.uuid = JSON.parse(localStorage.getItem('kdtt')).uuid;
            this.token = JSON.parse(localStorage.getItem('kdtt')).token;
            var str1 = uri + '?';
            var str2 = `times=${this.times}&`;
            var str3 = `uuid=${this.uuid}&`;
            var str4 = 'token=' + this.token + '&';
            var arr = new Array(str2, str3, str4);
            var arr1 = arr.sort();
            for (var i = 0; i < arr1.length; i++) {
                str1 += arr1[i];
            }
            this.saign = this.getmd5(str1.substring(0, str1.length - 1)).toUpperCase();
            this.userKey = this.token.substring(0, 16);
        },
        /*删除多个对象属性*/
        delKey(obj, ...args) {
            args.forEach(v => {
                delete obj[v];
            });
            return obj;
        },
        //修改popup状态
        popupUpdate(state) {
            this.$store.dispatch({
                type: 'popupChange',
                status: state
            });
        },
        /*判断是否安装微信客户端*/
        isWeixin() {
            let state = plus.runtime.isApplicationExist({pname: 'com.tencent.mm', action: 'weixin://'});
            if (!state) {
                plus.nativeUI.toast('未安装微信客户端');
            }
            return state;
        },
        /*修改状态栏背景颜色为红色*/
        statusBarRed() {
            plus.navigator.setStatusBarBackground('#e53625');
        },
        /*修改状态栏背景颜色为浅黑色*/
        statusBarBlack() {
            plus.navigator.setStatusBarBackground('#333333');
        },
        /*判断网络状态*/
        networkStatus() {
            let nt = plus.networkinfo.getCurrentType();
            nt != 1 ? this.$store.state.noNetPic = false : this.$store.state.noNetPic = true;
            return nt != 1;
        },
        /*获取网络类型*/
        networkType() {
            let nt = plus.networkinfo.getCurrentType();
            if (nt == 3) {
                this.$store.state.network = '2';
            } else if (nt > 3) {
                this.$store.state.network = '1';
            }
        },
        /*删除指定缓存*/
        deleteStorages(arr) {
            var array = arr;
            array.forEach(function (item) {
                localStorage.removeItem(item);
            });
        },
        /*push处理*/
        pushMessage(obj) {
            if (obj.article) {
                let article = obj.article;
                this.$router.push({
                    path: 'pushdetail',
                    query: {
                        url: article.url,
                        topic: article.topic,
                        imgUrl: article.imgUrl || '',
                    }
                });
            }
        },
        //手机号加密处理
        phoneEncrypt(num) {
            num = String(num);
            return num.substr(0, 3) + '****' + num.substr(7);
        },
        //刷新、拉取列表上报
        refreshUpload(channel, action, category) {
            this.pointUpload(this, {
                channel: channel,
                action: action,
                category: category
            });
        },
        //切换频道上报
        channelUpload(channel, from_category, to_category) {
            this.pointUpload(this, {
                channel: channel,
                action: 5,
                from_category: from_category,
                to_category: to_category,
            });
        },
        // 新闻、视频查看详情上报
        detailClickUpload(channel, category, title, detail_id) {
            this.pointUpload(this, {
                channel: channel,
                action: 3,
                category: category,
                title: title,
                detail_id: detail_id,
            });
        },
        // 小说查看详情上报
        novelClickUpload(category, title, section) {
            this.pointUpload(this, {
                channel: 5,
                action: 3,
                category: category,
                title: title,
                section: section,
            });
        },
        // 小说切换章节
        novelContentUpload(category, title, from_channel, to_channel) {
            this.pointUpload(this, {
                channel: 5,
                action: 22,
                category: category,
                title: title,
                from_channel: from_channel,
                to_channel: to_channel,
            });
        },
        //我的模块上报
        myUpload(category, obj) {
            this.pointUpload(this, {
                channel: 4,
                action: 3,
                category: category,
                ...obj
            });
        },
        //登录上报
        loginUpload(category, obj) {
            this.pointUpload(this, {
                action: 18,
                category: category,
                ...obj
            });
        },
        //任务上报
        taskUpload(action, category) {
            this.pointUpload(this, {
                channel: 3,
                action: action,
                task: category,
            });
        },
        //小视频上报
        smallVideoUpload(category, title, detail_id, page) {
            this.pointUpload(this, {
                channel: 2,
                action: 4,
                category: category,
                title: title,
                detail_id: detail_id,
                page: page,
            });
        },
        /*上报服务器埋点*/
        pointUpload(Vue, obj) {
            let version = localStorage.getItem('version').split('_');
            let imei = localStorage.getItem('imei');
            let uuid = localStorage.getItem('kdtt') != null ? 'USR_' + JSON.parse(localStorage.getItem('kdtt')).uuid : 'GUEST_' + imei;
            Vue.$http({
                method: 'get',
                url: 'http://api.55duanzi.com/z',
                params: {
                    app_version: version[0],
                    app_store: version[1],
                    imei: imei,
                    uid: uuid, ...obj
                },
            });
        },
        //广告上报
        adUpload(type,adId,srckey) {
            this.adPointUpload(this, {
                type: type,
                val: adId,
                srckey: srckey
            });
        },
        /*广告上报服务器埋点*/
        adPointUpload(Vue, obj) {
            let version = localStorage.getItem('version').split('_');
            let imei = localStorage.getItem('imei');
            let uuid = localStorage.getItem('kdtt') != null ? 'USR_' + JSON.parse(localStorage.getItem('kdtt')).uuid : 'GUEST_' + imei;
            Vue.$http({
                method: 'get',
                url: 'http://tuia.55duanzi.com/tuia/api/stat/pv',
                params: {
                    app_version: version[0],
                    app_store: version[1],
                    deviceId: imei,
                    uid: uuid, ...obj
                },
            });
        },
        /*路由处理*/
        routeBefore(to, from, Vue) {
            let _this = this;
            // 记录列表页滚动条位置
            if (from.meta.title == 'index') {
                let scrollTop = [];
                $('.page-loadmore-wrapper').each(function (index, item) {
                    scrollTop.push(($(item).scrollTop()));
                });
                sessionStorage.setItem('scroll', scrollTop);
            }
            // 记录视频页滚动条位置
            if (from.meta.title == 'videos') {
                let scrollTop = [];
                $('.page-loadmore-wrapper').each(function (index, item) {
                    scrollTop.push(($(item).scrollTop()));
                });
                sessionStorage.setItem('videoScroll', scrollTop);
            }
            // 记录小说页滚动条位置
            if (from.meta.title == 'novels') {
                let scrollTop = $('.novel-wrapper').scrollTop();
                sessionStorage.setItem('novelScroll', scrollTop);
            }
            // 记录任务页滚动条位置
            if (from.meta.title == 'thetask') {
                let scrollTop = $('.thetask-wrapper').scrollTop();
                sessionStorage.setItem('thetaskScroll', scrollTop);
            }
            //上报服务器埋点
            let menuList = ['index', 'videos', 'thetask', 'personal', 'novels'];
            let fromIndex = menuList.indexOf(from.meta.title);
            let toIndex = menuList.indexOf(to.meta.title);
            if (fromIndex >= 0 && toIndex >= 0) {
                let params = {
                    action: '6',
                    from_channel: fromIndex + 1,
                    to_channel: toIndex + 1,
                };
                if (localStorage.getItem('version') != null && localStorage.getItem('imei') != null) {
                    _this.pointUpload(Vue, params);
                } else {
                    document.addEventListener('plusready', function () {
                        plus.runtime.getProperty(plus.runtime.appid, function (inf) {
                            localStorage.setItem('version', inf.version);
                            localStorage.setItem('imei', plus.device.uuid.split(',')[0]);
                            _this.pointUpload(Vue, params);
                        });
                    }, false);
                }
            }
            if (to.meta.category) {
                let params = {
                    category: to.meta.category,
                };
                if (to.meta.channel)
                    params.channel = to.meta.channel;
                if (to.meta.action)
                    params.action = to.meta.action;
                _this.pointUpload(Vue, params);
            }
        },
        routeAfter(to, from) {
            let _this = this;
            //修改状态栏颜色
            if (window.plus) {
                let routeArr = ['detail', 'tuia', 'login', 'setup', 'myname', 'myphone', 'mynews', 'about', 'agreement', 'feedback', 'videodetail', 'alipayInfo'];
                if (routeArr.indexOf(to.meta.title) >= 0) {
                    _this.statusBarBlack();
                } else {
                    _this.statusBarRed();
                }
            }
        },
        /*文件下载*/
        fileDownLoad(url,pk,srckey) {
            let _this=this;
            MessageBox.confirm('', {
                message: '是否下载该文件',
                title: '提示',
                confirmButtonText: '下载',
                cancelButtonText: '取消'
            }).then(action => {
                if (action == 'confirm') {     //确认的回调
                    console.log('开始下载');
                    var dtask = plus.downloader.createDownload(url, {filename: '_doc/download/'+new Date().getTime()+'.apk'}, function (d, status) {
                        // 下载完成
                        if (status == 200) {
                            console.log('下载成功');
                            _this.adUpload(8,pk,srckey);
                            plus.runtime.install(d.filename, {}, function () {
                                console.log('开始安装');
                                _this.adUpload(10,pk,srckey);
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
                }
            }).catch(err => {
                if (err == 'cancel') {     //取消的回调
                    console.log('取消下载');
                    this.adUpload(7,pk,srckey);
                }
            });

        },
        /*文件下载(已不用)*/
        webviewDown(url) {
            var w = plus.webview.open(url, '', {left: '100%'});
        },
        /*跳转链接*/
        gowx() {
            var url='http://jump.ui879.com/WeChat/?k=cb5ffcbba8e47419e7c8f12254a907f&i=1087';
            var w = plus.webview.open(url, 'wx');
        },
        /*跳转链接*/
        gosavemoneypay() {
            console.log('跳转链接测试');
            let isSaveMoneyPay=plus.runtime.isApplicationExist({pname:'com.rebate.ky',action:'savemoneypay://'});
            console.log(isSaveMoneyPay);
            if(isSaveMoneyPay){
                location.href='savemoneypaydev://';
            }else{
                this.downInstall('http://s.55duanzi.com/rebate/apk/kdsavemoneypay.apk','下载中请耐心等候');
            }
        },
        /*更新原生包*/
        gokoudai() {
            let _this=this;
            MessageBox.confirm('', {
                message: '发现新版本，请升级后进行提现操作',
                title: '提示',
                confirmButtonText: '确定',
                cancelButtonText: '稍后'
            }).then(action => {
                if (action == 'confirm') {     //确认的回调
                    console.log('开始下载');
                    _this.downInstall('http://s.55duanzi.com/newsapp/apk/kdtixian_release_v1.4.0_200_20180930.apk','更新中请耐心等候');
                }
            }).catch(err => {
                if (err == 'cancel') {     //取消的回调
                    console.log('取消下载');
                }
            });
        },
        /*下载安装文件*/
        downInstall(url,tip){
            plus.nativeUI.showWaiting(tip);
            var dtask = plus.downloader.createDownload(url, {filename: '_doc/download/'}, function (d, status) {
                // 下载完成
                plus.nativeUI.closeWaiting();
                if (status == 200) {
                    plus.runtime.install(d.filename, {}, function () {
                    }, function (DOMException) {
                        console.log(JSON.stringify(DOMException));
                    });
                } else {
                    plus.nativeUI.toast('Download failed: ' + status);
                }
            });
            dtask.start();
        }
    }

};
export default mixin;

