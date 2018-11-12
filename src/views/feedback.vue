<template>
    <div class="mynews feedback">
        <div class="top-banner clearfloat">
            <div class="ret-btn" @click="goBack">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span @click="goBack">意见反馈</span>
        </div>
        <div class="mynews-wrapper">
            <div class="mynews-content" style="padding: 10px 20px 20px 20px;">
                <div class="memo">
                    <mt-field label="" placeholder="请描述您的问题" type="textarea" rows="6" v-model="memo"></mt-field>
                </div>
                <div class="contact">
                    <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="contactInfo.email"></mt-field>
                    <mt-field label="手机号" placeholder="请输入手机号" type="number" v-model="contactInfo.tel"></mt-field>
                </div>
            </div>
            <mt-button class="btn-text" type="danger" @click.native="submit">提交</mt-button>
            <mt-popup class="proving-box"
                      v-model="popupVisible"
                      position="bottom"
                      :modal=false
                      popup-transition="popup-fade"
                      @click.native="hideText">
                <div class="proving-text">提交成功</div>
            </mt-popup>
        </div>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui';
    export default {
        name:'mynews',
        data() {
            return {
                popupVisible: false,
                memo: '',
                contactInfo:{
                    email:'',
                    tel:''
                }
            }
        },
        mounted () {
//            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        methods:{
            goBack () {
                this.$router.go(-1);
            },
            agreement(){
                console.log(4);
                location.href='http://s.55duanzi.com/newsapp/agreement.html';
            },
            submit(){
                if(this.memo==''){
                    Toast({
                        message:'问题描述不能为空',
                        position: 'bottom'
                    });
                    return false;
                }else if(this.contactInfo.email==''&&this.contactInfo.tel==''){
                    Toast({
                        message:'请填写任一联系方式',
                        position: 'bottom'
                    });
                    return false;
                }else if(this.contactInfo.tel!=''&&!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.contactInfo.tel))){
                    Toast({
                        message:'请输入正确的手机号',
                        position: 'bottom'
                    });
                    return false;
                }
                let headerObj={};
                if(JSON.parse(localStorage.getItem('kdtt'))!=null){
                    this.creatSiagn(this.apiUrl.questionSubmit);
                    headerObj={
                        'uuid': this.uuid,'times':this.times,'sign':this.saign
                    }
                }
                this.$http({
                    method:'post',
                    url:this.apiUrl.questionSubmit,
                    data:{
                        content:this.memo,
                        phone :[this.contactInfo.email,this.contactInfo.tel].join(';'),
                    },
                    headers: headerObj,
                }).then(res=>{
                    if(res.status == 200){
                        if(res.data.status==1){
                            Toast({
                                message:'提交成功',
                                position: 'bottom'
                            });
                            this.$router.go(-1);
                        }else{
                            Toast({
                                message: res.data.message,
                                position: 'bottom'
                            });
                        }
                    }
                }).catch(err=>{
                    Toast({
                        message: '服务器繁忙，请您稍后再试',
                        position: 'bottom'
                    });
                });
            },
            hideText() {
                this.popupVisible = false;
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
        padding: 10px 20px 20px 20px;
        position: relative;
        /* padding-bottom: 60px; */
    }
    .mint-field-core{
        font-size: 14px!important;
    }
    .feedback .btn-text {
        font-size: 20px !important;
        width: 88% !important;
        height: 45px !important;
        border-radius: 8px !important;
        margin: 20px auto !important;
        text-align: center;
        display: block !important;
        outline: 0;
        overflow: hidden;
        position: relative;
        -webkit-appearance: none;
        border: 0;
        padding: 0 12px;
    }
    .mint-field{
        margin:20px 0!important;
    }
</style>

