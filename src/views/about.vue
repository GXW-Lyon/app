<template>
    <div class="mynews">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">关于我们</span>
        </div>
        <div class="mynews-wrapper">
            <div class="mynews-content" ref="wrapper" :style="{height:wrapperHeight+'px'}">
                <div class="about_info">
                    <img style="width:80px;height:80px;" src="../assets/img/toutiao.png" />
                    <span>{{'v'+$store.state.aboutVersion}}</span>
                </div>
                <div class="about_contact">
                    <span class="a_con_email">客服邮箱：kystoutiao@163.com</span>
                    <!--<span class="a_con_email">微信：koudaitoutiao</span>-->
                    <span class="a_con_email">QQ群：801691238</span>
                    <span class="a_con_agreement" @click="agreement">口袋头条用户协议</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'mynews',
        data() {
            return {
                wrapperHeight:0,
            }
        },
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        methods:{
            goBack () {
                this.$router.go(-1);
            },
            agreement(){
//                location.href='http://s.55duanzi.com/newsapp/agreement.html';
                this.$router.push({path:'agreement'});
            },
        }
    }
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

    .mynews {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f4f1;
    }

    .mynews .top-banner {
        width: 100%;
        height: 44px;
        background-color: #fff;
    }

    .mynews .top-banner .ret-btn {
        width: 36px;
        height: 100%;
        float: left;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }

    .mynews .top-banner .ret-btn img {
        width: 10px;
        vertical-align: middle;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }

    .mynews .top-banner span {
        float: left;
        line-height: 46px;
        font-size: 18px;
        padding-left: 5px;
    }
    .mynews .mynews-wrapper .mynews-content{
        width:100%;
        overflow-y: auto;
        padding: 0 20px 20px 20px;
        position: relative;
        /* padding-bottom: 60px; */
    }
    .about_info{
        text-align: center;
        margin-top: 100px;
    }
    .about_info span{
        display: block;
        color: #333;
        font-size: 18px;
        margin-top: 10px;
    }
    .about_contact{
        text-align: center;
        position: absolute;
        bottom:50px;
        left:50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
    }
    .about_contact span{
        display: block;
    }
    .a_con_email{
        color:#212121;
    }
    .a_con_agreement{
        color:#436183;
    }
</style>

