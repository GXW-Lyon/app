import { MessageBox } from 'mint-ui';
(function (w) {
    var checkUrl = 'http://s.55duanzi.com/newsapp/update.json?v='+Date.parse(new Date()); // 检测更新 地址是自己服务器检测的地址根据自己项目填写
    var downloadWgtUrl = null; // 升级包目录
    var downloadApkUrl = null; // 升级包目录
    var iosURL = null; // 苹果地址
    var oldVer = null; // 当前应用版本号
    var newVer = null; // 新版本号
    var isios = null; // ios是否需要升级 1 不升级 2 appStore升级 3 差量升级
    var isandroid = null; // android是否需要升级 1 不升级 2 apk升级 3 差量升级
    var channel = null; // 渠道标识
    // plusReady 加载完毕执行
    function plusReady() {
        //状态栏设置默认背景色
        plus.navigator.setStatusBarBackground('#e53625');
        // 获取设备信息IMEI
        //  alert( "IMEI: " + plus.device.imei );
        localStorage.setItem('imei', plus.device.uuid.split(',')[0]);
        // 获取本地应用资源版本号
        plus.runtime.getProperty(plus.runtime.appid, function (inf) {
            oldVer = inf.version;
            localStorage.setItem('version', inf.version);

            //判断启动方式
            checkArguments();

            channel=oldVer.split('_')[1];
            // console.log(oldVer);
            checkUpdate();
        });
        //安卓返回键处理
        var first = null;
        plus.key.addEventListener("backbutton",function(){
            var otherView=plus.webview.getWebviewById('ali')||plus.webview.getWebviewById('ad')||plus.webview.getWebviewById('wx')||null;
            if(otherView){
                otherView.canBack( function(e){
                    if(e.canBack){
                        otherView.back();//回退到上一页面
                    }else{
                        plus.webview.close(otherView);
                    }
                });
            }else{
                var fileHref=window.location.href;
                console.log(fileHref);
                var reg = RegExp(/#\/(index|videos|novels|personal|thetask)/g);
                if(reg.test(fileHref)){
                    //首次按键，提示‘再按一次退出应用’
                    if (!first) {
                        first = new Date().getTime();//记录第一次按下回退键的时间
                        plus.nativeUI.toast('再按一次退出应用');//给出提示
                        setTimeout(function() {//1s中后清除
                            first = null;
                        }, 1000);
                    } else {
                        if (new Date().getTime() - first < 1000) {//如果两次按下的时间小于1s，
                            plus.runtime.quit();//那么就退出app
                        }
                    }
                }else{
                    history.go(-1)//回退到上一页面
                }
            }
        });
        //拦截url跳转
        var currentView=plus.webview.getWebviewById('index');
        currentView.overrideUrlLoading({mode:"reject",match:".*sogou\.com/.*"}, function (e) {
            var url=e.url;
            var w = plus.webview.open(url, 'ad');
        });
        //处理从后台恢复
        document.addEventListener('newintent',function(){
            console.log('后台启动');
            checkArguments();
        },false);
    }

    // 检测更新
    function checkUpdate() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 4:
                    if (xhr.status == 200) {
                        var res = eval('(' + xhr.responseText + ')');
                        // 判断是否需要升级
                        newVer = res.version; // 版本号
                        // console.log(newVer);
                        isios = res.ios; // ios是否需要升级 1 不升级 2 appStore升级 3 差量升级
                        iosURL = res.ipaURL;
                        downloadWgtUrl = res.wgtURL;
                        downloadApkUrl = res.apkURL[channel];
                        // console.log(downloadApkUrl);
                        isandroid = res.android; // android是否需要升级 1 不升级 2 apk升级 3 差量升级

                        // 监听应用启动界面关闭事件
                        if (plus.navigator.hasSplashscreen()) { // 启动页未关闭
                            document.addEventListener('splashclosed', checkOs, false);
                        } else { //启动界面已关闭
                            checkOs();
                        }
                    } else {
                        console.log('检测更新失败！');
                    }
                    break;
                default:
                    break;
            }
        };
        xhr.open('GET', checkUrl);
        xhr.send();
    }
    //判断手机系统检测升级
    function checkOs() {
        var isupdate = compareVersion(oldVer, newVer); // 是否差量升级
        if (!isupdate) {
            return false;
        };
        if (plus.os.name == 'Android') {    // Android 用户
            if (isandroid == 1) {
                return false;
            } else if (isandroid == 2) {
                // plus.nativeUI.alert('发现新版本，请立即更新体验!', function () {
                //     createDownload();
                // }, '提示', '立即去更新');
                MessageBox.confirm('', {
                    message: '发现新版本，请立即更新体验!',
                    title: '提示',
                    confirmButtonText: '立即更新',
                    cancelButtonText: '以后再说'
                }).then(action => {
                    if (action == 'confirm') {     //确认的回调
                        console.log('ok');
                        plus.nativeUI.showWaiting( "加载中..." );
                        createDownload();
                    }
                }).catch(err => {
                    if (err == 'cancel') {     //取消的回调
                        console.log('cannel');
                    }
                });
            } else {
                downWgt();
            }
        } else { // 苹果用户
            if (isios == 1) {
                return false;
            } else if (isios == 2) {
                plus.nativeUI.alert('发现新版本，请立即更新体验!', function () {
                    plus.runtime.openURL(iosURL);
                }, '提示', '立即去更新');
            } else {
                downWgt();
            }
        }
    }
    /**
     * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
     * @param {String} ov
     * @param {String} nv
     * @return {Boolean}
     */
    function compareVersion(ov, nv) {
        if (!ov || !nv || ov == '' || nv == '') {
            return false;
        }
        var ovNum=ov.split('_')[0];
        var b = false,
            ova = ovNum.split('.', 4),
            nva = nv.split('.', 4);
        for (var i = 0; i < ova.length && i < nva.length; i++) {
            var so = ova[i], no = parseInt(so), sn = nva[i], nn = parseInt(sn);
            if (nn > no || sn.length > so.length) {
                return true;
            } else if (nn < no) {
                return false;
            }
        }
        if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
            return true;
        }
    }
    // 下载wgt文件
    function downWgt() {
        plus.nativeUI.showWaiting('更新文件...');
        plus.downloader.createDownload(downloadWgtUrl, {filename: '_doc/update/'}, function (d, status) {
            if (status == 200) {
                console.log('下载wgt成功：' + d.filename);
                installWgt(d.filename); // 安装wgt包
            } else {
                console.log('下载wgt失败！');
            }
            plus.nativeUI.closeWaiting();
        }).start();
    }
    // 更新应用资源升级包
    function installWgt(path) {
        // console.log(path);
        plus.nativeUI.showWaiting('安装文件...');
        plus.runtime.install(path, {}, function () {
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast('应用资源更新完成！');
            plus.runtime.restart();
        }, function (e) {
            plus.nativeUI.closeWaiting();
            console.log(e);
            // plus.nativeUI.alert(JSON.stringify(e));
            plus.nativeUI.toast('应用资源更新失败！');
        });
    }
    //创建下载任务 安卓
    function createDownload() {
        var dtask = plus.downloader.createDownload(downloadApkUrl, {filename: '_doc/download/'}, function (d, status) {
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
    //判断启动方式
    function checkArguments() {
        var args= plus.runtime.arguments;
        if(args&&args.indexOf('koudai://')==0){
            // 处理args参数
            let url=args.replace(/koudai:\/\//g,'');
            let currentUrl=plus.webview.currentWebview().getURL().split('/');
            let currentUrlLen=currentUrl.length;
            currentUrl[currentUrlLen-1]=url;
            window.location.href=currentUrl.join('/');
        }
        //上报埋点&&匹配服务器时间
        uploadService();
    }
    //上报埋点&&匹配服务器时间
    function uploadService() {
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
                console.log('存储'+localStorage.getItem('timestamp'));
            },
            error:function(){
                localStorage.setItem('timestamp', 0);
            }
        })
        let version=localStorage.getItem('version').split('_');
        let imei=localStorage.getItem('imei');
        let uid=localStorage.getItem('kdtt') != null?'USR_'+JSON.parse(localStorage.getItem('kdtt')).uuid:'GUEST_'+imei;
        $.ajax({
            url:'http://api.55duanzi.com/z',
            type:'get',
            data:{
                app_version:version[0],
                app_store:version[1],
                imei:imei,
                uid:uid,
                action:'15',
            }
        });
    }
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }
})(window);
