<template>
  <div class="income">
    <div class="income-top">
      <img class="logo" src="../assets/img/0504-a2.png" alt="">
      <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
      <img @click="popupVisible=true" class="menu" src="../assets/img/menucsn.png" alt="">
    </div>
    <mt-popup v-model="popupVisible" position="top" class="mint-popup-2">
      <div class="wrapper">
        <div @click="checkoutIncome(index)" v-for="(list,index) in menuList" :class="{'active':ind === index}">{{list}}</div>
      </div>
    </mt-popup>
    <div class="wrapper">
      <div class="main" ref="main" :style="{height:wrapperHeight+'px'}">
        <p class="day" v-if="todayList.length>0?true:false">今天</p>
        <div class="today clearfloat" v-for="item in todayList">
          <div class="wrapper clearfloat">
            <img class="title" src="../assets/img/shouru.png" alt="">
            <div class="income_info">
              <div class="in-top">
                <span><span>{{item.bouns}}</span>金币</span>
                <span class="time">{{item.time}}</span>
              </div>
              <div class="income-bottom">{{item.name}}</div>
            </div>
          </div>
        </div>
        <p class="day" v-if="yesterdayList.length>0?true:false">昨天</p>
        <div class="today clearfloat" v-for="items in yesterdayList">
          <div class="wrapper clearfloat">
            <img class="title" src="../assets/img/shouru.png" alt="">
            <div class="income_info">
              <div class="in-top">
                <span><span>{{items.bouns}}</span>金币</span>
                <span class="time">{{items.time}}</span>
              </div>
              <div class="income-bottom">{{items.name}}</div>
            </div>
          </div>
        </div>
        <p class="day" v-if="beforeYesterdayList.length>0?true:false">前天</p>
        <div class="today clearfloat" v-for="itemss in beforeYesterdayList">
          <div class="wrapper clearfloat">
            <img class="title" src="../assets/img/shouru.png" alt="">
            <div class="income_info">
              <div class="in-top">
                <span><span>{{itemss.bouns}}</span>金币</span>
                <span class="time">{{itemss.time}}</span>
              </div>
              <div class="income-bottom">{{itemss.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img v-if="noDataPic" class="noDataPic" src="../assets/img/nonet.png" alt="">
  </div>
</template>
<script>
  export default{
    name:'income',
    data () {
      return {
        popupVisible: false,
        dataList:[],
        beforeYesterdayList:[],
        todayList:[],
        yesterdayList:[],
        wrapperHeight:0,
        menuList:['全部收益','阅读收益','任务收益','邀请收益'],
        ind: 0,
        noDataPic:false,
      }
    },
    created () {
      this.incomeHistory(0);
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.main.getBoundingClientRect().top;
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      incomeHistory (type) {
        this.creatSiagn(this.apiUrl.taskDepsiHistory);
        this.dataList = {uuid: this.uuid, times: this.times, sign: this.saign, type:type};
        this.$http({
          method: 'post',
          url: this.apiUrl.taskDepsiHistory,
          params:this.dataList
        }).then(res=>{
          console.log(res);
          if(res.status == 200){
            console.log(res);
            if(res.data.status == 1){
              this.todayList = res.data.todayList;
              this.yesterdayList = res.data.yesterdayList;
              this.beforeYesterdayList = res.data.beforeYesterdayList;
              if(this.beforeYesterdayList==''&&this.yesterdayList==''&&this.todayList==''){
                this.noDataPic = true;
              }else{
                this.noDataPic = false;
              }
            }
          }
        }).catch()
      },
      checkoutIncome (index) {
        this.ind = index;
        this.incomeHistory(index);
        this.popupVisible =false;
      }
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
.income .income-top{
  height: 44px;
  width: 100%;
  background: #e53526;
  position: relative;
  top: 0;
  left: 0;
  z-index: 9999;
}
.income .income-top .logo{
    height: 24px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
}
.income .income-top .return{
    /*width: 14px;*/
    text-align: center;
    /*margin-left: 24px;*/
    /*margin-top: 8px;*/
    float: left;
    height: 100%;
    padding: 10px 15px;
}
.income .income-top .return img{
  width: 32%;
  vertical-align: middle;
}
.income .income-top .menu{
    /*width: 25px;*/
    text-align: center;
    /*margin-right: 20px;*/
    /*margin-top: 8px;*/
    float: right;
    height: 100%;
    padding: 8px;
}
.income .wrapper .main{
  overflow-y:auto;
}
.income .today{
  background: #fff;
  border-bottom: 1px solid #eee;
}
.income .day{
  font-size: 18px;
  background: #f2f4f1;
  line-height: 32px;
  padding-left: 30px;
  font-weight: 700;
}
.income .today .title{
  padding: 15px 0;
  margin-left: 22px;
  width: 40px;
  vertical-align: middle;
  float: left;
}
.income .today .income_info{
  width: 80%;
  float: left;
  padding-left: 15px;
  font-size: 14px;
}
.income .today .income_info .in-top{

  position: relative;
  padding-top: 12px;
  padding-bottom: 12px;
}
.income .today .income_info .in-top .time{
  position: absolute;
  right: 20px;
  top: 10px;
}
.income .mint-popup-2{
  font-size: 16px;
  width: 100%;
  height: 132px;
  margin-top: 44px;
}
.income .mint-popup-2 .wrapper{
  padding: 10px;
  display: flex;
  flex-wrap:wrap;
  text-align: center;
}
.income .mint-popup-2 .wrapper div{
  width: 31.33%;
  height: 50px;
  border: 1px solid #fff;
  margin-bottom: 10px;
  margin-right: 10px;
  line-height: 50px;
  border: 1px solid #e0e0e0;
}
.income .mint-popup-2 .wrapper div:nth-child(3n){
  margin-right: 0px;
}
.income .mint-popup-2 .wrapper .active{
  border-color: #e53526;
}
.income .noDataPic{
    width: 60%;
    position: absolute;
    margin: auto;
    left: 0; right: 0; top: 0; bottom: 54px;
}
</style>
