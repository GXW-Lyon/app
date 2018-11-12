<template>
    <mt-popup v-model="$store.state.popupVisible" position="bottom" class="mint-popup-share">
        <div class="share-title">分享到：</div>
        <div class="share-box">
            <div class="share-box-info" v-for="item in shareDataList" @click="shareList(item.id,item.ex)">
                <img :src="item.src" alt="">
                <div>{{item.text}}</div>
            </div>
        </div>
    </mt-popup>
</template>
<script>
    export default {
        name: 'share',
        data() {
            return {
                shareDataList: [
                    {
                        src: require('../assets/img/weixin.png'),
                        text: '微信好友',
                        id: 'weixin',
                        ex: 'WXSceneSession'  /*微信好友*/
                    },
                    {
                        src: require('../assets/img/freindquan.png'),
                        text: '朋友圈',
                        id: 'weixin',
                        ex: 'WXSceneTimeline' /*微信朋友圈*/
                    },
                    {
                        src: require('../assets/img/countss.png'),
                        text: '更多分享',
                        id: 'system',
                        ex: 'system' /*系统分享*/
                    },
//                    {
//                        src: require('../assets/img/qq.png'),
//                        text: 'QQ好友'
//                    },
//                    {
//                        src: require('../assets/img/countss.png'),
//                        text: '微信'
//                    },
                ],
                dType:''
            };
        },
        props:['shareInfo'],
        created(){
           console.log(this.shareInfo);
        },
        watch:{
            shareInfo(cur,old){
//                console.log(cur,old);
                if(cur){
                    this.shareInfo=cur;
                }
            },
        },
        methods: {
            //获取分享服务列表
            shareList(id,ex){
                // this.$emit('success');
                let _this=this;
                plus.share.getServices( function(s){
                    _this.shareAction(s,id,ex);
                } );
            },
            //分享操作
            shareAction(sList,id, ex) {
                if (!id || sList.length == 0) {
                    plus.nativeUI.toast('无效的分享服务');
                }
                let s = null;
                if (id == 'weixin') {
                    if(!this.isWeixin()){
                        return false;
                    }
                    this.pointUpload(this,this.shareInfo.uploadInfo);
                    sList.forEach(item => {
                        s = item.id == 'weixin' ? item : null;
                    });
                    if (s.authenticated) {
                        this.shareMessage(s, ex);
                    } else {
                        s.authorize(function () {
                            this.shareMessage(s, ex);
                        }, function (e) {
                            console.log('未进行认证');
                        });
                    }
                } else if (id == 'system') {
                    //系统分享
                    this.popupUpdate(false);
                    plus.share.sendWithSystem({content: this.shareInfo.content||'', href: this.shareInfo.url||''}, function () {
                        console.log('分享成功');
                    }, function (e) {
                        console.log('分享失败');
                    });
                }
            },
            //发送微信分享消息
            shareMessage(s, ex) {
                let imgSrc='';
                let obj=this.shareInfo.imgurl;
                if(obj&&typeof obj=='object'){
                    if(obj.src){
                        imgSrc=obj.src.split('&');
                        imgSrc.splice(-2,2,'width=128','height=128');
                        imgSrc=imgSrc.join('&');
                    }
                }else if(obj&&typeof obj=='string'){
                    imgSrc=obj;
                }
                this.popupUpdate(false);
                console.log(imgSrc);
                var msg = {
                    href: this.shareInfo.url||'',
                    title: this.shareInfo.title||'',
                    content: this.shareInfo.content||'能赚钱的头条',
                    thumbs: [imgSrc||require("../assets/img/toutiao.png")],
                    pictures: [imgSrc||require("../assets/img/toutiao.png")],
                    extra: {
                        scene: ex
                    }
                };
                var exs = ex;
                s.send(msg, ()=> {
                    plus.nativeUI.toast('分享成功!');
                    this.$emit('success');
                    if(this.shareInfo.type!=''){
                        // console.log(exs);
                        if(this.shareInfo.type=='weixinRequest'){
                            if(exs=='WXSceneSession'){
                                this.dType=14;
                                // console.log(1+'--'+this.dType);
                            }else if(exs=='WXSceneTimeline'){
                                this.dType=13;
                                // console.log(2+'--'+this.dType);
                            }
                        }else{
                            this.dType = this.shareInfo.type;
                            // console.log(3+'--'+this.dType);
                        }
                        // console.log(this.dType);
                        this.creatSiagn(this.apiUrl.taskDoneDay);
                        this.$http({
                            method: 'post',
                            url:this.apiUrl.taskDoneDay,
                            params:{'uuid': this.uuid,'times':this.times,'sign':this.saign,'type':this.dType}
                        }).then(res =>{
                            if(res.status==200){
                                console.log(res);
                                if(this.shareInfo.type!=10&&this.shareInfo.type!='weixinRequest'){
                                    console.log(4);
                                    this.$emit('reloadTaskList');
                                    // location.reload();
                                }
                            }
                        }).catch()
                    }
                }, function (e) {
                    plus.nativeUI.toast('分享失败!');
                });
            },
        }
    };
</script>
<style>
    .mint-popup-share {
        width: 100%;
    }

    .mint-popup-share .share-title {
        padding-left: 20px;
        line-height: 50px;
        font-size: 16px;
    }

    .mint-popup-share .share-box {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        align-items: center;
        font-size: 14px;
    }

    .mint-popup-share .share-box .share-box-info {
        width: 25%;
        padding-bottom: 15px;
    }

    .mint-popup-share .share-box .share-box-info img {
        width: 50%;
        padding-bottom: 5px;
    }
</style>


