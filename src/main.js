import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import routes from '@/router';
import axios from 'axios';
import Mixin from './mixins';
import store from './store';
import Mint from 'mint-ui';
import $ from 'jquery';
import 'mint-ui/lib/style.css'
import 'babel-polyfill';
import VueLazyLoad from 'vue-lazyload'
import VueVideoPlayer from 'vue-video-player';
import VueCookies from 'vue-cookies';
import '@/js/plus.js';

Vue.use(VueCookies);
Vue.use(VueVideoPlayer);
Vue.use(VueLazyLoad,{
    // error:'./static/error.png',
});
Vue.use(VueRouter);
Vue.mixin(Mixin);
Vue.use(Mint);
Vue.config.productionTip = false;
Vue.config.debug = true;
const router = new VueRouter({
    // mode: 'history',
    routes
});

//系统错误捕获
const errorHandler = (err, vm, info)=>{
    // let obj={
    //     message, // 异常信息
    //     name, // 异常名称
    //     script,  // 异常脚本url
    //     line,  // 异常行号
    //     column,  // 异常列号
    //     stack  // 异常堆栈信息
    // } = err;
    console.log(err.message);
    let params={
        action:'21',
        msg:err.message,
    };
    if(localStorage.getItem('version')!=null&&localStorage.getItem('imei')!=null){
        Mixin.methods.pointUpload(Vue,params);
    }else{
        document.addEventListener('plusready', function () {
            plus.runtime.getProperty(plus.runtime.appid, function (inf) {
                localStorage.setItem('version', inf.version);
                localStorage.setItem('imei', plus.device.uuid.split(',')[0]);
                Mixin.methods.pointUpload(Vue,params);
            });
        }, false);
    }
};
Vue.config.errorHandler = errorHandler;

// ajax
Vue.$http = Vue.prototype.$http = axios.create({
    baseURL: 'http://api.55duanzi.com',
    // baseURL: 'http://tt.i6bktq.cn:83',
    withCredentials: true,// `withCredentials` 表示跨域请求时是否需要使用凭证
    timeout: 50000
});
//拦截器（ajax请求前）
Vue.prototype.$http.interceptors.request.use((config) => {
    let uuid = JSON.parse(localStorage.getItem('kdtt')) != null ? JSON.parse(localStorage.getItem('kdtt')).uuid : '';
    config.headers.ve=localStorage.getItem('version')||'1.0.0.0';
    config.headers.uuid=uuid;
    return config;
}, (error) => {
    return Promise.reject(error);
});
//拦截器（ajax响应前）
Vue.prototype.$http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response);
    return response;
}, function (error) {
    console.log(error);
    if (error.response) {
        console.log(error.response);
        if (error.response.status == 403) {
            console.log(403)
            localStorage.removeItem('kdtt');
            Mint.Toast({
                message: '登陆信息失效，请重新登陆',
                position: 'bottom',
                duration: 1000,
            })
            router.push({path: 'login'});
        }
    }
    return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    if (to.meta.keepAlive) {
        to.meta.isBack = true;
    }
    try{
        Mixin.methods.routeBefore(to,from,Vue);
    }catch(e){
        console.info(e);
    }

    next();

});
router.afterEach((to, from) => {
    try{
        Mixin.methods.routeAfter(to,from);
    }catch(e){
        console.info(e);
    }
});

// const infoUpload=function () {
//     let params={
//         version:localStorage.getItem('version'),
//         imei:localStorage.getItem('imei'),
//         page:to.meta.title,
//     };
//     Mixin.methods.pointUpload(Vue,params);
// };

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
