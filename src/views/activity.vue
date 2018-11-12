<template>
  <div class="activity">
    <div class="actTop">
      <img class="logo" src="../assets/img/koudaiddd.png" alt="">
      <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
      <!-- <img class="share-btn" @click="$store.state.popupVisible=true" src="../assets/img/sharePic.png" alt=""> -->
    </div>
    <div class="actContent" :style="{height:activityWrapperHeight+'px'}">
      <div class="activity-top">
        <img src="../assets/img/activity01.jpg" alt="">
        <div @click="shareAction" class="hideBox1"></div>
      </div>
      <div class="activity-center">
        <img src="../assets/img/activity02.jpg" alt="">
      </div>
      <div class="activity-bottom">
        <img src="../assets/img/activity03.jpg" alt="">
        <div @click="shareAction" class="hideBox2"></div>
    </div>
    </div>
    <share :shareInfo="{url:inviteUrl+invitateCode,title:shareTitle,content:shareContent,type:'weixinRequest',uploadInfo:uploadInfo}"></share>
  </div>
</template>
<script>
  import share from 'components/share';
  export default{
    name:'activity',
    data(){
      return {
        activityWrapperHeight:0,
        invitateCode:'',
        shareTitle:'',
        shareContent:'',
        inviteUrl: '/shareOne.html?code=',
        uploadInfo:{
            channel:4,
            action:8,
            category:'master_invite_now'
        },
      }
    },
    components: {
        share,
    },
    created(){
      this.inviteUrl=this.$store.state.shareDomain+this.inviteUrl;
      this.discipleInfo();
    },
    mounted(){
      this.activityWrapperHeight = document.documentElement.clientHeight - 44;
    },
    methods:{
      goBack(){
        this.$router.go(-1);
      },
      /*师徒信息列表*/
      discipleInfo() {
          this.creatSiagn(this.apiUrl.mentorList);
          this.$http({
              method: 'get',
              url: this.apiUrl.mentorList,
              headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
          }).then(res => {
              if (res.status == 200) {
                  console.log(res);
                  this.invitateCode = res.data.invitateCode;
              }
          }).catch();
      },
      shareAction(){
          this.creatSiagn(this.apiUrl.shareApprentice);
          this.$http({
              method: 'get',
              url: this.apiUrl.shareApprentice,
              params:{code:this.invitateCode},
              headers: {'uuid': this.uuid, 'times': this.times, 'sign': this.saign},
          }).then(res => {
              if (res.status == 200) {
                    this.shareTitle=res.data.title;
                    this.shareContent=res.data.content;
                    this.popupUpdate(true);
              }else{
                  Toast({
                          message: '获取分享内容失败，请稍后再试',
                          position: 'bottom',
                          className: 'toasted',
                          duration: 1000,
                  })
              }
          }).catch(res=>{
              Toast({
                  message: '获取分享内容失败，请稍后再试',
                  position: 'bottom',
                  className: 'toasted',
                  duration: 1000,
              })
          });
      },
    }
  }
</script>
<style>
.activity{
  width: 100%;
}
.activity .actTop{
  width: 100%;
  height: 44px;
  position: relative;
  top: 0;
  left: 0;
  z-index: 9999;
  background: #e53625;
}
.activity .actTop .logo{
    height: 24px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
}
.activity .actTop .return{
    text-align: center;
    float: left;
    height: 100%;
    padding: 10px 15px;
}
.activity .actTop .return img{
  width: 32%;
  vertical-align: middle;
}
 /* .activity .actTop .share-btn{
    text-align: center;
    float: right;
    height: 100%;
    padding: 10px 15px;
} */
.activity .actContent{
  width: 100%;
  overflow-y: auto;
}
.activity .actContent .activity-top,.activity .actContent .activity-center,.activity .actContent .activity-bottom{
  width: 100%;
  position: relative;
}
.activity .actContent .activity-center,.activity .actContent .activity-bottom{
  margin-top: -1px;
}
.activity .actContent .activity-top img,.activity .actContent .activity-center img,.activity .actContent .activity-bottom img{
  width: 100%;
  height: auto;
  vertical-align: middle;
}
.activity .actContent .activity-top .hideBox1{
  position:absolute;
  left:0;
  bottom:0;
  width: 100%;
  height: 12%;
  background: transparent;
}
.activity .actContent .activity-bottom .hideBox2{
  position:absolute;
  left:0;
  bottom:0;
  width: 100%;
  height: 10%;
  background: transparent;
}
</style>

