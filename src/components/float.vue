<template>
    <div>
        <div class="flaot-box" @click="gosavemoneypay"><img src="../assets/img/hongbao1.gif" alt=""></div>
    </div>
</template>
<script>
    export default {
        name: 'float',
        data () {
            return {
            };
        },
        created (){
        },
        methods:{
        }
    };
</script>
<style>
    .flaot-box {
        position: fixed;
        bottom: 60px;
        right: 10px;
        z-index: 3;
        width: 95px;
    }

    .flaot-box img {
        width: 100%;
        vertical-align: middle;
    }
</style>

