 <template>
  <div>
      <div :class="[classFlag ? 'hindeNone' : '']" class="splash" v-if="downImg" id="splash">
          <div class="loading-circle" id="loadingCircle">
              <canvas class="mask" id="loadingProgress" width="72" height="72"></canvas>
              <canvas class="bg" width="72" height="72"></canvas>
              <img  src="../assets/img/IdMG_2990.png" style="width: 48px; height: 48px;z-index:4;position:absolute;left:12px;bottom:12px">
              <div class="big_circle"></div>
              <div class="center_circle"></div>
          </div>
      </div>
      <div :class="{getGold:isTrue}" v-if="isTrue">
          <img src="../assets/img/IMG_2981.png" alt="">
          <div class="gold-nums"><p class="gold_number">{{goldNum?goldNum:'0'}}</p><p>金币</p></div>
      </div>
      <img :class="[classFlag ? 'hindeNone' : '']"  @click="plsLogin" v-if="!downImg" src="../assets/img/IMG_2982.png" style="position:fixed;z-index:2;left:0;bottom:0;width:72px;left:20px;bottom:20px;">
  </div>
</template>

 <script>
  export default{
    name:'scirle',
    data(){
      return{
          isTrue:false,
          goldNum:'',
          downImg:false,
          hasLoaded:0,
          Types:'',
          classFlag:false,
          videoAttr:'',
          tNum:'',
          scrollHeight:''
      }
    },
    props:['Type'],
    watch:{
      hasLoaded(one,two){
            if(one==102){
                this.pageInfo();
            }else{
                this.isTrue = false;
            }
        }
    },
    created () {
        console.log(this.Type)
        this.Types = this.Type.type;
        this.videoAttr = this.Type.videoAttr;
        if(this.videoAttr!=undefined){
          this.tNum = 17;
        }else{
          this.tNum = 16;
          if(this.Types!='beauty_kd'){
                this.judgeScroll();
          }
        }
        if(this.Types=='beauty_kd'||this.Types=='sv_dy'){
          this.classFlag = true;
        }
        if (JSON.parse(localStorage.getItem('kdtt')) != null){
            // if(this.$store.state.videoState==false){
              this.dataInfo();
            // }
        }
    },
    methods: {
        /*判断计时领取任务是否完成*/
        dataInfo () {
            this.creatSiagn(this.apiUrl.taskVisit);
            this.$http({
                method:'post',
                url:this.apiUrl.taskVisit,
                params:{uuid: this.uuid, times: this.times, sign: this.saign,type:this.tNum,flag:0}
            }).then(res => {
                console.log(res);
                if(res.status==200){
                    if(res.data.status==1){
                        this.downImg=true;
                        this.fn();
                    }else if(res.data.status==2){
                        this.downImg=false;
                    }
                }
            }).catch();
        },
        /*计时阅读领取*/
        pageInfo () {
            this.taskUpload(3, 'T16');
            this.creatSiagn(this.apiUrl.taskVisit);
            this.$http({
                method:'post',
                url:this.apiUrl.taskVisit,
                params:{uuid: this.uuid, times: this.times, sign: this.saign,type:this.tNum,flag:1}
            }).then(res => {
                if(res.status==200){
                    console.log(res);
                    if(res.data.status==1){
                        this.isTrue = true;
                        this.downImg=true;
                        this.goldNum = res.data.message;
                        clearTimeout(this.$store.state.timeOut);
                        this.$store.state.timeOut = setTimeout(()=>{
                            this.fn();
                        },2000);
                    }else if(res.data.status==2){
                        this.downImg=false;
                    }
                }
            }).catch();
        },
        /*画图渲染函数*/
        ulp (percent) {
            this.loading = true;
            var i = 0;
            if (this.hasLoaded > 100) {
                clearInterval(this.$store.state.draw);
            }
            if (i<percent) {
                this.d();
                i++;
                this.hasLoaded += 1;
                this.$store.state.hasLoaded = this.hasLoaded;
                // console.log(this.$store.state.hasLoaded);
            }
        },
        /*记时执行*/
        fn () {
            if(localStorage.getItem('hasLoaded')==null){
                this.hasLoaded = 0;
            }else if(this.hasLoaded>100){
                this.hasLoaded = 0;
            }else{
                const number =parseInt(localStorage.getItem('hasLoaded'));
                if(number>100){
                  this.hasLoaded = 0;
                }else{
                  this.hasLoaded = number;
                }
            }
            clearInterval(this.$store.state.draw);
            this.$store.state.draw=null;
            this.$store.state.draw=setInterval(()=>{this.ulp(99)},200);
        },
        /*canvas画图*/
        d () {
            var c=document.getElementById('loadingProgress');
            if(!c){
                clearInterval(this.$store.state.draw);
                clearTimeout(this.$store.state.timeOut);
                return false;
            }
            var ctx=c.getContext('2d');
            var loaded = this.hasLoaded * 2 / 100 * Math.PI, cw = 72, hcw = 36;
            ctx.clearRect (0,0,cw,cw);
            ctx.beginPath();
            ctx.arc(hcw,hcw,hcw-4, 0, loaded, false);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        },
        plsLogin () {
          if (this.isLogin() == false) {
              return false;
          }else {
              Toast({
                  message: '今日已完成',
                  position: 'bottom'
              });
          }
        },
        /*判断滚动条位置*/
        judgeScroll(){ 
        }
    }
  }
</script>


<style>
    .splash .loading-circle {position: fixed; width: 72px; height: 72px; margin: auto; left: 20px;bottom: 20px;z-index: 2002!important;}
    .splash .loading-circle>* {display: block; position: absolute; box-sizing: border-box; border-radius: 72px;}
    .splash .loading-circle>canvas.bg {z-index: 2; width: 100%; height: 100%; border: 16px solid #bd1f20;}
    .splash .loading-circle>canvas.mask {z-index: 3; transform: rotate(-90deg); -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg);}
    .box{width: 100px;height: 100px;background: red;}
    .big_circle{
         width: 74px;
         height: 74px;
         border: 5px solid #d7332a;
         position: fixed;
         left: -1px;
         bottom: -1px;
         z-index: 3;
         border-radius: 50%;
     }
    .center_circle{
         width: 56px;
         height: 56px;
         border: 5px solid #d7332a;
         position: fixed;
         left: 8px;
         bottom: 8px;
         z-index: 3;
         border-radius: 50%;
    }
    .getGold{
      animation:mymove 2s;
      animation-fill-mode:forwards;
      position:fixed;
      bottom: 0;
      left: 0;
      width: 200px;
      height:200px;
      z-index: 2002!important;
    }
    .getGold img{
        width: 100%;
        vertical-align: middle;
    }
    .getGold .gold-nums{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 20%;
        text-align: center;
        font-size: 18px;
        color: #d7332a;
    }
    .getGold .gold-nums .gold_number{
        font-size: 40px;
        margin-bottom: 6px;
    }
    @keyframes mymove {
      0%{left:0px;bottom:0;opacity: 0;}
     50%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 1;}
     90%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 1;}
     95%{left:50%;bottom:50%;transform:translate(-50%,50%);opacity: 0;}
     100%{opacity:0; left: 0;bottom: 0}
    }
    .hindeNone{
        display: none;
    }
</style>
