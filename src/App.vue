<script>
//    import '@/js/vconsole.min.js';
    export default {
        name: 'App',
        created() {
        },
    };
</script>

<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
                <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
            </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    a, input {
        -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
    }

    input {
        border: none;
        outline: none;
        font-size: 16px;
    }

    input::-webkit-input-placeholder {
        font-size: 14px;
        color: #9a9a9a;
    }

    input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #9a9a9a;
        font-size: 14px;
    }

    input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #9a9a9a;
        font-size: 14px;
    }

    input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #9a9a9a;
        font-size: 14px;
    }

    #app {
        font-family: "noto", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        height: 100vh;
    }
</style>
