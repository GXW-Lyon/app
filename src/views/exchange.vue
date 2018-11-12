<template>
  <div class="exchange">
    <div class="exchange-top">
      <img class="logo" src="../assets/img/exchangetop.png" alt="">
      <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
    </div>
    <div class="exchange-price">
      <div class="all-golds">
        <img src="../assets/img/exchange-gold.png" alt="">
        <span>当前资产：<span class="exchange-allgolds">{{amount}}</span>金币</span>
      </div>
      <div class="price-list clearfloat">
        <div class="price-box" v-for="(item,index) in goldDHnum" :class="{'actives':ind === index}" @click="checkoutIncome(index)">
          <p class="price-num">{{item.price}}</p>
          <p class="shoujia">售价{{item.dhNums}}金币</p>
        </div>
      </div>
    </div>
    <div class="exchange-app">
      <div class="mint-cell">
          <div class="mint-cell-wrapper">
              <div class="mint-cell-title" @click="aliBind">
                  <img class="pimg" src="../assets/img/zhifubaotx.png" alt="" style="width:30px">
                  <span class="mint-cell-text" style="color:#ed2d15;" v-if="aliInfo.status">未设置</span>
                  <span class="mint-cell-text" v-else>{{aliInfo.account+' '+aliInfo.userName}}</span>
              </div>
              <i class="mint-cell-allow-right"></i>
          </div>
      </div>
    </div>
    <div class="exchange-explain">
      <div class="explain-bg">
          <img src="../assets/img/ex-explain.png" alt="">
      </div>
      <div class="explain-text">提现申请提交后，三个工作日内到账</div>
    </div>
    <div class="exchange-bottom">
      <div class="compute">
        <span>合计：<span class="compute-price">{{totalSum}}</span>金币</span>
      </div>
      <div @click="gokoudai" v-if="showBtn" class="compute-btn">兑换</div>
      <div v-if="!showBtn" class="compute-btn1">兑换</div>
    </div>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui';
  export default{
    name:'exchange',
    data () {
      return {
        goldDHnum:[
          {
            price:'2.00元',
            dhNums:'20,000'
          },
          {
            price:'5.00元',
            dhNums:'47,500'
          },
          {
            price:'10.00元',
            dhNums:'95,000'
          },
          {
            price:'20.00元',
            dhNums:'190,000'
          },
          {
            price:'50.00元',
            dhNums:'475,000'
          },
          {
            price:'100.00元',
            dhNums:'980,000'
          },
        ],
        ind:0,
        totalSum:'20,000',
        amount:'',
        showBtn:true,
        infoList:[],
        zfnumber:'',
        aliInfo:{
          status:true,
          account:'',
          userName:''
        },
      }
    },
    created () {
      this.allGoldNums();
      // this.totalSum = this.goldDHnum[0].dhNums;
      // let numss = parseInt(this.totalSum.replace(/,/g,''));
      // console.log(numss);
      // console.log(this.amount)
      // if(this.amount>numss){
      //   this.showBtn = true;
      // }else{
      //   this.showBtn = false;
      // }
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      /*切换价格*/
      checkoutIncome (index) {
        // console.log(index);
        this.ind = index;
        this.totalSum = this.goldDHnum[index].dhNums;
        let nums = parseInt(this.totalSum.replace(/,/g,''));
        if(this.amount<nums){
          this.showBtn = false;
        }else{
          this.showBtn = true;
        }
      },
      /*总资产*/
      allGoldNums () {
        this.creatSiagn(this.apiUrl.cashGet);
        this.$http({
          method:'get',
          url:this.apiUrl.cashGet,
          headers: {'uuid': this.uuid,'times':this.times,'sign':this.saign},
        }).then(res=>{
          if(res.status==200){
            let arr = JSON.parse(this.decrypt(res.data.data, this.userKey));
            console.log(arr);
            this.amount = arr.amount;
            this.infoList = arr.list;
            for(var i=0;i<arr.list.length;i++){
              if(arr.list[i].type==='aliPay'){
                this.zfnumber = arr.list[i].account;
                this.aliInfo={
                    status:false,
                    account:arr.list[i].account,
                    userName:arr.list[i].realName,
                }
              }
            }
            let numss = parseInt(this.totalSum.replace(/,/g,''));
            console.log(numss);
            console.log(this.amount)
            if(this.amount>numss){
              this.showBtn = true;
            }else{
              this.showBtn = false;
            }
          }
        }).catch()
      },
      /*兑换*/
      cashGold () {
        let nums = parseInt(this.totalSum.replace(/,/g,''));
        this.myUpload('withdraw_start',{
          amount:nums,
          action:7
        });
        this.creatSiagn(this.apiUrl.cashApply);
        let userInfo=JSON.stringify({cashAmount:nums,bcr:{account:this.zfnumber,type:'1',realName:this.aliInfo.userName}});
        this.$http({
          method:'post',
          url:this.apiUrl.cashApply,
          data:{data:this.encrypt(userInfo,this.userKey)},
          headers: {'uuid': this.uuid,'times':this.times,'sign':this.saign},
        }).then(res=>{
          if(res.status == 200){
            console.log(res);
            if(res.data.status==1){
                Toast({
                    message: res.data.message,
                    position: 'center'
                });
                this.allGoldNums();
            }else if(res.data.status==2){
                Toast({
                    message: res.data.message,
                    position: 'center'
                });
                this.$router.push({path:'myphone'});
            }else{
                Toast({
                    message: res.data.message,
                    position: 'center'
                });
            }
          }
        }).catch();
      },
        /*绑定支付宝信息*/
        aliBind(){
            let params={};
            if(!this.aliInfo.status){
                params={
                    account:this.aliInfo.account,
                    userName:this.aliInfo.userName,
                }
            }
            this.$router.push({path:'alipayInfo',query:params});
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
.actives{
  border:1px solid #e53526;
}
.exchange {
    width: 100%;
    height: 100%;
    background-color: #f2f4f1;
}
.exchange .exchange-top{
    height: 44px;
    width: 100%;
    background: #e53526;
    position: relative;
    top: 0;
    left: 0;
    z-index: 9999;
}
.exchange .exchange-top .logo{
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.exchange .exchange-top .return{
    /*width: 14px;*/
    text-align: center;
    /*margin-left: 24px;*/
    /*margin-top: 8px;*/
    float: left;
    height: 100%;
    padding: 10px 15px;
}
.exchange .exchange-top .return img{
  width: 34%;
  vertical-align: middle;
}
.exchange .exchange-price{
    background: #fff;
}
.exchange .exchange-price .all-golds{
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 0 0 10px;
  font-size: 16px;
}
.exchange .exchange-price .all-golds img{
  width: 20px;
  vertical-align: middle;
  margin-right: 5px;
}
.exchange .exchange-price .all-golds span{
  align-items: center;
  vertical-align: middle;
  font-weight: 700;
}
.exchange .exchange-price .all-golds .exchange-allgolds{
  color: #e53625;
}
.exchange .exchange-price .price-list{
  padding: 0 10px 0 10px;
}
.exchange .exchange-price .price-list .price-box{
  width: 32%;
  height: 86px;
  background: #f2f4f1;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
  padding: 16px 0 10px 0;
  color: #e53526;
  float: left;
  margin-right: 2%;
  margin-bottom: 14px;
  box-sizing: border-box;
}
.exchange .exchange-price .price-list .price-box:nth-child(3n){
  margin-right: 0;
}
.exchange .exchange-price .price-list .price-box .price-num{
  padding-bottom: 10px;
  font-weight: 700;
}
.exchange .exchange-price .price-list .price-box  .shoujia{
  font-size: 12px;
}
.exchange .exchange-app{
  margin-top: 12px;
  background: #fff;
  font-size: 16px;
}

.exchange .exchange-app .mint-cell-wrapper{
  background-image: none !important;
  padding: 0 !important;
}
.exchange .exchange-app .mint-cell-wrapper img{
    vertical-align: middle;
    width: 35px;
    margin-left: 16px;
    margin-right: 25px;
}
/* .exchange .exchange-app .app-money{
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
}
.exchange .exchange-app .app-money .wechat{
  width: 28px;
}
.exchange .exchange-app .app-money .text{
  flex: 2;
  padding-left: 14px;
}
.exchange .exchange-app .app-money .ex-jt{
  width: 10px;
} */
.exchange .exchange-explain{
  margin-top: 12px;
}
.exchange .exchange-explain .explain-bg{
  width: 65%;
  margin: 0 auto;
}
.exchange .exchange-explain .explain-bg img{
  width: 100%;
  vertical-align: middle;
}
.exchange .exchange-explain .explain-text{
  margin-top: 26px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.exchange .exchange-bottom{
  width: 100%;
  height: 45px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 14px;
}
.exchange .exchange-bottom .compute{
  flex: 2;
}
.exchange .exchange-bottom .compute .compute-price{
  color: #e53526;
}
.exchange .exchange-bottom .compute-btn{
  background: #e53526;
  height: 100%;
  line-height: 45px;
  text-align: center;
  flex: 1;
  font-size: 16px;
  color: #fff;
}
.exchange .exchange-bottom .compute-btn1{
  background: #999;
  height: 100%;
  line-height: 45px;
  text-align: center;
  flex: 1;
  font-size: 16px;
  color: #fff;
}
</style>

