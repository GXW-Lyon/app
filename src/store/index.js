import Vue from 'vue';
import vuex from 'vuex';

Vue.use(vuex);

// import dingStatus from './dingStatus.js';

export default new vuex.Store({
    /*全局状态*/
    state: {
        deviceuuid:'864035034842337',//设备uuid
        devicemodel:'设备型号',
        version:'1.0.0.0',//版本号
        aboutVersion:'1.0.0.0',//版本号
        platForm:'',//平台（安卓、ios）
        network:'99',//网络类型（1 运营商；2 WIFI；99 其它）
        userName:'',
        phoneNumber:'',
        birthday:'',
        mySex:'',
        shares:[],//分享服务列表
        popupVisible:false,
        noNetPic:false,
        videoNetwork:true,//是否提示视频播放时的网络类型
        shareDomain:'http://iao55.top/newsapp',
        dyVideoList:[],
        signList:[],
        signCompleted:true,
        smallVideoHash:'',//记录小视频频道的hash值,
        defalutID:'',//首页默认id
        hasLoaded:0,
        draw:null,
        timeOut:null,
        videoState:true,
        TaskAdvertLists:[],
        advertLists:[],
        PadvertState:false,
        scrollTimer:null,
        firstLoadImg:false,
        loadArr:[],
        newAndDayTaskState:true,
        dayTaskList :[],
        newTaskList :[],
        cashLists:[],
        wallListItems:[],
        integralSate:true
    },
    /*局部状态*/
    modules:{
        // ding:dingStatus
    },
    getters:{

    },
    mutations:{
        popupChange(state,info){
            state.popupVisible=info.status;
        },
    },
    actions:{
        popupChange({commit},info){
            commit('popupChange',info);
        },
    }
});
