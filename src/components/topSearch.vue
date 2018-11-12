<template>
    <div>
        <!-- <div class="topPhone"></div> -->
        <div class="topNav">
            <img @click="countDown(1)" class="count-down" v-if="goldDraw" src="../assets/img/shouyejinbi-1.png" alt="">
            <img v-if="!goldDraw" class="count-down1" src="../assets/img/shouyejinbi-2.png" alt="">
            <span ref="time" v-if="!goldDraw" class="goldTimesDown">{{count}}</span>
            <img class="navImg" src="../assets/img/koudaitoutaio1.png" alt="">
            <!-- <img class="navSearch" src="../assets/search.png" alt=""> -->
        </div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    export default {
        name: 'topsearch',
        data () {
            return {
                dataList:{},
                goldDraw:false,
                leftSeconds:'',
                timerrr:null,
                count:''
            };
        },
        created (){
            this.countDown(0);
        },
        methods:{
            countDown (type){
                if(type==1){
                    if(this.isLogin()==false){
                        return false;
                    }
                    this.goldDraw=false;
                    this.taskUpload(3,'T18');
                }
                if(type==0){
                    if(JSON.parse(localStorage.getItem('kdtt'))==null){
                        this.goldDraw=true;
                        return false;
                    }
                }
                this.creatSiagn(this.apiUrl.taskHour);
                this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign,type:type};
                var _this = this;
                this.$http({
                    method:'post',
                    url:this.apiUrl.taskHour,
                    params:this.dataList
                }).then(res =>{
                    if(res.status==200){
                        console.log(res);
                        if(type==0){
                            // console.log(res);
                            if(!res.data.completed){
                                this.goldDraw=true;
                            }else if(res.data.completed){
                                // console.log(res);
                                this.goldDraw=false;
                                this.leftSeconds = res.data.leftSeconds;
                                this.CDown(this.leftSeconds);
                            }
                        }else if(type==1){
                            // console.log(res);
                            if(!res.data.completed){
                                this.$emit('goldCoin');
                                this.goldDraw=false;
                                this.leftSeconds = res.data.leftSeconds;
                                this.CDown(this.leftSeconds);
                            }else if(res.data.completed){
                                // this.$emit('goldCoin'); 
                                Toast({
                                    message:'本小时已经完成',
                                    position:'bottom',
                                    duration:2000
                                })
                                this.goldDraw=false;
                                this.leftSeconds = res.data.leftSeconds;
                                // this.CDown(this.leftSeconds);
                            }
                        }
                    }
                }).catch();
            },
            CDown (maxtime) {
                var minutes = Math.floor(maxtime / 60);
                var seconds = Math.floor(maxtime % 60);
                var msg =  minutes + ":" + seconds;
                this.count = msg;
                if (!this.timerrr){
                    this.timerrr = setInterval(()=>{
                        if(maxtime>0){
                            var minutes = Math.floor(maxtime / 60);
                            var seconds = Math.floor(maxtime % 60);
                            if(minutes<10){
                                minutes = '0'+minutes;
                            }
                            if(seconds<10){
                                seconds = '0'+seconds;
                            }
                            var msg =  minutes + ":" + seconds;
                            this.count = msg;
                            maxtime --;
                        }else{
                            this.countDown(0);
                            clearInterval(this.timerrr);
                            this.timerrr = null;
                        }
                    },1000)
                }
            }
        }
    };
</script>
<style>
    * {
        margin: 0;
        padding: 0;
    }
    .topPhone {
        width: 100%;
        height: 20px;
        background: #e53625;
    }

    .topNav {
        width: 100%;
        height: 44px;
        position: relative;
        top: 0;
        left: 0;
        background: #e53625;
    }
    .topNav .count-down{
        width: 60px;
        vertical-align: middle;
        position: absolute;
        margin: auto;
        left: 20px;
        top: 0;
        bottom: -1px;
    /* left: 0px; right: 0; top: 0; bottom: 0; */
        /* top: 50%;
        left: 20px; */
        /* transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%); */
    }
    .topNav .count-down1{
        width: 25px;
        vertical-align: middle;
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }
    .topNav .goldTimesDown{
        position: absolute;
        top: 50%;
        left: 50px;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        vertical-align: middle;
        color: #fff;
        font-size: 14px;
    }
    .topNav .navImg {
        height: 24px;
        position: absolute;
        top: 0;
        left: 0;
        bottom:0;
        right: 0;
        margin: auto;
    }

    .navSearch {
        height: 22px;
        position: absolute;
        right: 0;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>

