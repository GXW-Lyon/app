<template>
  <div class="novel">
    <div class="novel-top"><img src="../assets/img/mynovel.png" alt=""></div>
    <div class="novel-wrapper" ref="novelH" :style="{height:novelHeight+'px'}">
      <div v-for="items in novelLists">
        <div v-if="items.style==1">
          <div class="novel-title">{{items.name}}</div>
          <div class="novel-content" @click="goDetail(item.id,items.type,item.title)" v-for="item in items.fictionItemList">
            <div class="recommend-title">{{item.summary}}</div>
            <div class="recommend-img">
              <img v-lazy="item.cover" alt="">
            </div>
          </div>
        </div>
        <div v-else-if="items.style==2">
          <div class="novel-title">{{items.name}}</div>
          <div class="novel-content">
            <div class="swordsman  clearfloat" v-for="item in items.fictionItemList" @click="goDetail(item.id,items.type,item.title)">
              <div class="swordsman-img">
                <img v-lazy="item.cover" alt="">
              </div>
              <div class="swordsman-text">
                <div class="swordsman-text-title">{{item.title}}</div>
                <div class="swordsman-text-depict">{{item.summary}}</div>
                <div class="author">{{item.author}}<span class="zhu">著</span></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="items.style==3">
          <div class="novel-title">{{items.name}}</div>
          <div class="novel-content clearfloat">
            <div class="man" @click="goDetail(item.id,items.type,item.title)" v-for="item in items.fictionItemList">
              <div class="man-img">
                <img v-lazy="item.cover" alt="">
              </div>
              <div class="man-text">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <float></float>
    <bottom-nav></bottom-nav>
  </div>
</template>
<script>
  import bottomNav from 'components/bottomNav';
  import float from 'components/float';
  export default{
    name:'novel',
    data () {
      return {
        novelHeight:0,
        novelLists:[],
        isFirstEnter: false, // 是否第一次进入，默认false
      }
    },
    components: {
        bottomNav,
        float,
    },
    created(){
      this.isFirstEnter = true;
    },
    activated() {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
          // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
          this.novelList();
      } else {
          //重置scrollTop
          let scrollTop = sessionStorage.getItem('novelScroll');
          $('.novel-wrapper').scrollTop(parseInt(scrollTop));
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
      this.isFirstEnter = false;
    },
    mounted () {
      this.novelHeight = document.documentElement.clientHeight - 54;
    },
    methods:{
      goDetail(id,type,title){
        this.novelClickUpload(type,title,JSON.parse(localStorage.getItem('novelInfo'))[id]||1);
        this.$router.push({path:'noveldetail',query:{id:id,type:type,title,title}});
      },
      /*小说列表*/
      novelList () {
        this.$http({
          method:'get',
          url:this.apiUrl.fictionPull,
          params:{imei: this.$store.state.deviceuuid},
          headers:{'gender':localStorage.getItem('chooseSex')||''}
        }).then(res=>{
          if(res.status==200){
            console.log(res);
            this.novelLists = res.data.fictionTable;
          }
        }).catch();
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
.novel .novel-top{
  width: 100%;
  height: 44px;
  background: #e53625;
  margin-bottom: 10px;
  position: relative;
}
.novel .novel-top img{
  height: 24px;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.novel .novel-wrapper{
  padding: 0 15px;
  overflow-y: auto;
  padding-bottom: 60px;
}
.novel .novel-wrapper .novel-title{
  padding-left: 15px;
  position: relative;
  background:url('../assets/img/jxbg.png') no-repeat;
  background-size: 3px;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
}
.novel .novel-wrapper .novel-title::after{
  content: '';
  position: absolute;
  height: 1px;
  width: 100%;
  left: 0;
  top:28px;
  background: #eeeeee;
}
.novel .novel-wrapper .novel-content{
  padding-top: 18px;
  font-size: 14px;
  line-height: 20px;
}
.novel .novel-wrapper .novel-content .recommend-img{
  width: 100%;
  padding-top: 10px;
  padding-bottom: 14px;
}
.novel .novel-wrapper .novel-content .recommend-img img{
  width: 100%;
  height: 112px;
  vertical-align: middle;
}
.novel .novel-wrapper .novel-content .swordsman{
  padding-bottom: 14px;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-img{
  width: 34%;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-img img{
  width: 100%;
  height: auto;
  height: 150px;
  vertical-align: middle;
  float: left;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-text{
  width: 66%;
  float: left;
  padding-left: 15px;
  padding-top: 4px;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-text .author{
  padding-top: 10px;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-text .zhu{
  padding-left: 5px;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-text .swordsman-text-title{
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
}
.novel .novel-wrapper .novel-content .swordsman .swordsman-text .swordsman-text-depict{
  overflow: hidden;
  height: 82px;
  line-height: 20px;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.novel .novel-wrapper .novel-content .man{
  width: 31%;
  float: left;
  margin-right: 3.5%;
  padding-bottom: 14px;
}
.novel .novel-wrapper .novel-content .man:nth-child(3n){
  margin-right: 0px;
}
.novel .novel-wrapper .novel-content .man:last-child{
  margin-right: 0px;
}
.novel .novel-wrapper .novel-content .man-img{
  width: 100%;
  height: 140px;
  overflow: hidden;
}
.novel .novel-wrapper .novel-content .man-img img{
  width: 100%;
  min-height: 140px;
  vertical-align: middle;
}
.novel .novel-wrapper .novel-content .man-text{
  font-size: 14px;
  padding-top: 4px;
  text-align: center;
}
</style>

