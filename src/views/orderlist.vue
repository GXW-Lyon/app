<template>
    <div class="orderlist">
        <div class="orderlist-top">
            <img class="logo" src="../assets/img/myorderlist.png" alt="">
            <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
        </div>
        <div class="order-tab">
            <span @click="orderList(1)" :class="flagss==1?'active':''">全部订单</span>
            <span @click="exchangeOrderList(2)" :class="flagss==2?'active':''">处理中</span>
        </div>
        <div class="void"></div>
        <div class="wrapper">
            <div class="main" ref="main" :style="{height:wraHeight+'px'}">
                <div class="oExchange clearfloat" v-for="item in orderCashList">
                    <div class="otitle">
                        <img src="../assets/img/ordergold.png" alt="">
                        <span class="oexIng">兑换提现</span>
                        <span class="otitIng">{{item.statusMsg}}</span>
                    </div>
                    <div class="wrapper clearfloat">
                        <img class="orPic" src="../assets/img/ordermoney.png" alt="">
                        <div class="orderlist_info">
                            <div class="or-top">
                                <span>提现<span>{{item.rmbAmount}}</span>元到<span>{{item.channel}}</span></span>
                                <span class="time"><span>{{item.amount}}</span>金币</span>
                            </div>
                            <div class="or-bottom">
                                <span>{{item.date}}</span>
                                <span class="orpress" @click="popUpBox" v-if="item.status!=4&&item.status!=1">催一下</span>
                            </div>
                            <div class="or-status" v-if="item.status==4">失败原因：<span>{{item.remark}}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img v-if="noDataPicOrder" class="noDataPic" src="../assets/img/nonet.png" alt="">
    </div>
</template>
<script>
    import {Toast} from 'mint-ui';

    export default {
        name: 'income',
        data() {
            return {
                wraHeight: 0,
                noDataPic: false,
                noDataPicOrder: false,
                orderCashList: [],
                flagss:1
            };
        },
        created() {
            this.orderList();
            this.flagss=1;
        },
        mounted() {
            this.wraHeight = document.documentElement.clientHeight - this.$refs.main.getBoundingClientRect().top;
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            /*全部订单*/
            orderList(flag) {
                this.flagss = flag;
                this.creatSiagn(this.apiUrl.cashOrders);
                this.$http({
                    method: 'get',
                    url: this.apiUrl.cashOrders,
                    headers: {
                        'uuid': this.uuid,
                        'times': this.times,
                        'sign': this.saign,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        this.orderCashList = res.data;
                        if (this.orderCashList == '') {
                            this.noDataPicOrder = true;
                        }
                    }
                }).catch();
            },
            /*处理中*/
            exchangeOrderList(flag){
              this.flagss = flag;
              var arr=[]
              for(var i=0;i<this.orderCashList.length;i++){
                if(this.orderCashList[i].status==3||this.orderCashList[i].status==2||this.orderCashList[i].status==0){
                  arr.push(this.orderCashList[i]);
                }
              }
              this.orderCashList = arr;
            },
            popUpBox() {
                Toast({
                    message: '申请已提交，请耐心等候！',
                    position: 'bottom'
                });
            }
        }
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

    .orderlist .orderlist-top {
        height: 44px;
        width: 100%;
        background: #e53526;
        position: relative;
        top: 0;
        left: 0;
        z-index: 9999;
    }

    .orderlist .orderlist-top .logo {
        height: 24px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
    }

    .orderlist .orderlist-top .return {
        text-align: center;
        float: left;
        height: 100%;
        padding: 10px 15px;
    }

    .orderlist .orderlist-top .return img {
        width: 32%;
        vertical-align: middle;
    }

    .orderlist .void {
        width: 100%;
        height: 7px;
        background: #f2f4f1;
    }

    .orderlist .order-tab {
        display: flex;
        text-align: center;
        padding: 12px 0;
        font-size: 16px;
        font-weight: 700;
    }

    .orderlist .order-tab span {
        flex: 1;
    }

    .orderlist .order-tab .active{
        color: #e63726;
    }

    .orderlist .wrapper .main {
        overflow-y: auto;
    }

    .orderlist .oExchange {
        background: #fff;
        padding-bottom: 10px;
        position: relative;
    }

    .orderlist .oExchange .otitle {
        font-size: 12px;
        line-height: 26px;
        padding-left: 10px;
        padding-top: 5px;
        display: flex;
        align-items: center;
        margin-right: 14px;
        font-size: 14px;
    }

    .orderlist .oExchange .otitle .oexIng {
        font-weight: 700;
    }

    .orderlist .oExchange .otitle .otitIng {
        flex: 1;
        text-align: right;
        color: #e63726;
    }

    .orderlist .oExchange .otitle img {
        width: 20px;
        margin-right: 5px;
    }

    .orderlist .oExchange .orPic {
        position: absolute;
        padding: 5px 0;
        margin-left: 22px;
        width: 40px;
        vertical-align: middle;
    }

    .orderlist .oExchange .orderlist_info {
        margin-left: 76px;
        font-size: 14px;
        border-bottom: 1px solid #f2f4f1;
        padding-bottom: 6px;
    }

    .orderlist .oExchange .orderlist_info .or-top {
        padding-top: 4px;
        padding-bottom: 8px;
        font-weight: 700;
    }

    .orderlist .oExchange .orderlist_info .or-bottom {
        padding-bottom: 6px;
        font-size: 12px;
        color: darkgray;
        line-height: 20px;
    }

    .orderlist .oExchange .orderlist_info .or-status {
        color: #999;
        background: #f2f4f1;
        width: 60%;
        font-size: 12px;
    }

    .orderlist .oExchange .orderlist_info .or-top .time {
        position: absolute;
        right: 15px;
    }

    .orderlist .oExchange .orderlist_info .or-bottom .orpress {
        position: absolute;
        right: 15px;
        border: 1px solid #e63726;
        border-radius: 10px;
        width: 50px;
        text-align: center;
        color: #e63726;
        font-size: 12px;
        line-height: 18px;
    }

    .orderlist .noDataPic {
        width: 60%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 54px;
    }
</style>
