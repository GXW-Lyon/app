export default [
    {
        meta: {
            title: 'home',
            keepAlive: false,
            isBack:false,
        },
        path: '/',
        name: 'home',
        redirect: '/index'
    },
    {
        meta: {
            title: 'login',
            category: 'login',
            action: '18',
            keepAlive: false,
            isBack:false,
        },
        path: '/login',
        name: 'login',
        component: resolve => require(['views/login'], resolve)
    },
    {
        meta: {
            title: 'index',
            keepAlive: true,
            isBack:false,
        },
        path: '/index',
        name: 'index',
        component: resolve => require(['views/index'], resolve)
    },
    {
        meta: {
            title: 'videos',
            keepAlive: true,
            isBack:false,
        },
        path: '/videos',
        name: 'videos',
        component: resolve => require(['views/videos'], resolve)
    },
    {
        meta: {
            title: 'personal',
            keepAlive: false,
            isBack:false,
        },
        path: '/personal',
        name: 'personal',
        component: resolve => require(['views/personal'], resolve)
    },
    {
        meta: {
            title: 'novels',
            keepAlive: true,
            isBack:false,
        },
        path: '/novels',
        name: 'novels',
        component: resolve => require(['views/novel'], resolve)
    },
    {
        meta: {
            title: 'setup',
            category: 'sys_setting',
            channel: '4',
            action: '3',
            keepAlive: false,
            isBack:false,
        },
        path: '/setup',
        name: 'setup',
        component: resolve => require(['views/setup'], resolve)
    },
    {
        meta: {
            title: 'detail',
            keepAlive: false,
            isBack:false,
        },
        path: '/detail',
        name: 'detail',
        component: resolve => require(['views/detail'], resolve)
    },
    {
        meta: {
            title: 'pushdetail',
            keepAlive: false,
            isBack:false,
        },
        path: '/pushdetail',
        name: 'pushdetail',
        component: resolve => require(['views/pushdetail'], resolve)
    },
    {
        meta: {
            title: 'tuia',
            keepAlive: false,
            isBack:false,
        },
        path: '/tuia',
        name: 'tuia',
        component: resolve => require(['views/tuia'], resolve)
    },
    {
        meta: {
            title: 'myname',
            keepAlive: false,
            isBack:false,
        },
        path: '/myname',
        name: 'myname',
        component: resolve => require(['views/myname'], resolve)
    },
    {
        meta: {
            title: 'myphone',
            category: 'sys_setting_bind_phone',
            channel: '4',
            action: '3',
            keepAlive: false,
            isBack:false,
        },
        path: '/myphone',
        name: 'myphone',
        component: resolve => require(['views/myphone'], resolve)
    },
    {
        meta: {
            title: 'request',
            category: 'master_invite',
            channel:'4',
            action:'3',
            keepAlive: false,
            isBack:false,
        },
        path: '/request',
        name: 'request',
        component: resolve => require(['views/request'], resolve)
    },
    {
        meta: {
            title: 'income',
            keepAlive: false,
            isBack:false,
        },
        path: '/income',
        name: 'income',
        component: resolve => require(['views/income'], resolve)
    },
    {
        meta: {
            title: 'disciple',
            keepAlive: false,
            isBack:false,
        },
        path: '/disciple',
        name: 'disciple',
        component: resolve => require(['views/disciple'], resolve)
    },
    {
        meta: {
            title: 'disincome',
            keepAlive: false,
            isBack:false,
        },
        path: '/disincome',
        name: 'disincome',
        component: resolve => require(['views/disincome'], resolve)
    },
    {
        meta: {
            title: 'thetask',
            keepAlive: false,
            isBack:false,
        },
        path: '/thetask',
        name: 'thetask',
        component: resolve => require(['views/thetask'], resolve)
    },
    {
        meta: {
            title: 'exchange',
            category: 'withdraw',
            channel: '4',
            action: '3',
            keepAlive: false,
            isBack:false,
        },
        path: '/exchange',
        name: 'exchange',
        component: resolve => require(['views/exchange'], resolve)
    },
    {
        meta: {
            title: 'mynews',
            category: 'message',
            channel: '4',
            action: '3',
            keepAlive: false,
            isBack:false,
        },
        path: '/mynews',
        name: 'mynews',
        component: resolve => require(['views/mynews'], resolve)
    },
    {
        meta: {
            title: 'about',
            keepAlive: false,
            isBack:false,
        },
        path: '/about',
        name: 'about',
        component: resolve => require(['views/about'], resolve)
    },
    {
        meta: {
            title: 'feedback',
            keepAlive: false,
            isBack:false,
        },
        path: '/feedback',
        name: 'feedback',
        component: resolve => require(['views/feedback'], resolve)
    },
    {
        meta: {
            title: 'agreement',
            keepAlive: false,
            isBack:false,
        },
        path: '/agreement',
        name: 'agreement',
        component: resolve => require(['views/agreement'], resolve)
    },
    {
        meta: {
            title: 'alipayInfo',
            keepAlive: false,
            isBack: false,
        },
        path: '/alipayInfo',
        name: 'alipayInfo',
        component: resolve => require(['views/alipayInfo'], resolve)
    },
    {
        meta: {
            title: 'videodetail',
            keepAlive: false,
            isBack:false,
        },
        path: '/videodetail',
        name: 'videodetail',
        component: resolve => require(['views/videodetail'], resolve)
    },
    {
        meta: {
            title: 'orderlist',
            keepAlive: false,
            isBack:false,
        },
        path: '/orderlist',
        name: 'orderlist',
        component: resolve => require(['views/orderlist'], resolve)
    },
    {
        meta: {
            title: 'noveldetail',
            keepAlive: false,
            isBack:false,
        },
        path: '/noveldetail',
        name: 'noveldetail',
        component: resolve => require(['views/noveldetail'], resolve)
    },
    {
        meta: {
            title: 'activity',
            keepAlive: false,
            isBack:false,
        },
        path: '/activity',
        name: 'activity',
        component: resolve => require(['views/activity'], resolve)
    },
];
