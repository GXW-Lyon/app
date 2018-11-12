<template>
    <div>
        <div class="detail-top clearfloat" @click="goBack">
            <div class="ret-btn">
                <img src="../assets/img/fanhui1.png" alt="">
            </div>
            <span>返回</span>
        </div>
        <!--<div class="ifram-box">-->
            <iframe id="tuia" src="https://apneo.cn/index/activity?srckey=srcWcFXGU86" frameborder="0" style="width:100%;height:90vh"></iframe>
            <!--<div id="ifm" :data-src="src"></div>-->
        <!--</div>-->
        <!-- <div class="detail-bottom"></div> -->
    </div>
</template>
<script>
    export default {
        name: 'tuia',
        data() {
            return {
                src: '',
            };
        },
        created() {

        },
        methods: {
            goBack() {
                this.$router.go(-1);
            }
        }
    };
</script>
<style>
    * {
        margin: 0;
        padding: 0;
    }

    #ifm {
        display: none;
    }
    #tuia{
        position: absolute;
        top: 10vh;
        left: 0;
    }
    .detail-top {
        position: fixed;
        width: 100%;
        height: 10vh;
        line-height: 10vh;
        background: #fff;
        border-bottom: 2px solid #e0e0e0;
        font-size: 18px;
        z-index: 999;
    }

    .detail-top .ret-btn {
        width: 10%;
        height: 100%;
        text-align: center;
        padding-left: 2%;
        float: left;
    }

    .detail-top .ret-btn img {
        width: 38%;
        vertical-align: middle;
    }

    .detail-top span {
        float: left;
        font-size: 20px;
        vertical-align: middle;
        padding-left: 1%;
        padding-top: 2px;
    }

    .detail-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 8vh;
        background: red;
    }
</style>

