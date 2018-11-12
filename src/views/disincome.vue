<template>
  <div class="disincome">
    <div class="disincome-top">
      <img class="logo" src="../assets/img/alldisciple.png" alt="">
      <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
    </div>
    <div class="disincomeContet"  ref="content" :style="{height:wrapperHeight+'px'}">
      <div class="disincomeWrapper" v-for="item in dataInfoLists">
        <div class="disincomeLeft">
          <div>{{item.nickName}}</div>
          <div class="dis-incoInfo">{{item.taskName}}<span>{{item.goldNum}}</span><span>金币</span>收益</div>
        </div>
        <div class="disincomeRight">{{item.time}}</div>
      </div>
    </div>
    <img v-if="noDisincoPic" src="../assets/img/nonet.png" class="noDisincoPic" alt="">
  </div>
</template>
<script>
  export default{
    name:'income',
    data () {
      return {
        wrapperHeight:'',
        dataInfoLists:[],
        noDisincoPic:false,
      }
    },
    created () {
      this.discipleInfo();
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top;
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      discipleInfo () {
          this.creatSiagn(this.apiUrl.mentorList)
          this.$http({
            method: 'get',
            url:this.apiUrl.mentorList,
            headers: {'uuid': this.uuid,'times':this.times,'sign':this.saign},
          }).then(res=>{
            if(res.status==200){
              console.log(res);
              this.dataInfoLists = res.data.listRevenue;
              if(this.dataInfoLists==''){
                this.noDisincoPic = true;
              }
            }
          }).catch();
        },
    }
  }
</script>
<style>
.disincome {
  width: 100%;
  height: 100%;
  background: #f2f4f1;
}
.disincome .disincome-top{
  height: 44px;
  width: 100%;
  background: #e53526;
  position: relative;
  top: 0;
  left: 0;
}
.disincome .disincome-top .logo{
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.disincome .disincome-top .return{
    /*width: 14px;*/
    text-align: center;
    /*margin-left: 24px;*/
    /*margin-top: 8px;*/
    float: left;
    height: 100%;
    padding: 10px 15px;
}
.disincome .disincome-top .return img{
  width: 32%;
  vertical-align: middle;
}
.disincome .disincomeContet{
  margin-top: 10px;
  overflow-y: auto;
}
.disincome .disincomeContet .disincomeWrapper{
  display: flex;
  align-items: center;
  padding: 10px 30px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.disincome .disincomeContet .disincomeWrapper .disincomeLeft{
  font-size: 14px;
  line-height: 26px;
  flex: 1
}
.disincome .disincomeContet .disincomeWrapper .disincomeLeft .dis-incoInfo{
  font-size: 12px;
  color: #9a9a9a;
}
.disincome .disincomeContet .disincomeWrapper .disincomeLeft .dis-incoInfo span{
  color: #e53526;
}
.disincome .disincomeContet .disincomeWrapper .disincomeRight{
  flex: 1;
  text-align: right;
  font-size: 12px;
  color: #9a9a9a;
}
.disincome .noDisincoPic{
    width: 60%;
    position: absolute;
    margin: auto;
    left: 0; right: 0; top: 0; bottom: 54px;
}
</style>
