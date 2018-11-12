<template>
    <div class="novel-detail">
        <div class="novel-detail-top">
            <div class="title">{{novelTitle}}</div>
            <img class="return" @click="goBack" src="../assets/img/requestFH.png" alt="">
            <img class="menu" src="../assets/img/menulist.png" alt="" @click="menuList">
        </div>
        <div class="content" id="novelContent" :style="{height:novelDetailHeight+'px'}">
            <div v-html="novelStr" v-if="isRead">
            </div>
            <div class="gowx" v-else>
                <p>继续阅读下一章，点击关注"大蜜小说"公众号，更多免费章节随意看</p>
                <div class="gowxBth" @click="gowx">去关注</div>
            </div>
            <div class="chapter" v-if="btnFlag">
                <div v-bind:class="['novelbtn',PrenoPage ? 'novelActive' : 'novelActive1']"
                     @click="novelContent(novelId,novelPrePage)">上一章
                </div>
                <div v-bind:class="['novelbtn',NextnoPage ? 'novelActive' : 'novelActive1']"
                     @click="novelContent(novelId,novelNextPage)">下一章
                </div>
            </div>
            <mt-popup v-model="popupShow" position="left" class="popupShow" :modal="true">
                <div class="page-wrapper" style="height:100%">
                    <ul class="page-list" v-infinite-scroll="loadMoreList" infinite-scroll-disabled="Mloading"
                        infinite-scroll-distance="50">
                        <li v-for="item in novelMenulist" class="page-infinite"
                            @click="novelContent(novelId,item.chapter,item.chapterTitle)">{{ item.chapterTitle }}
                        </li>
                    </ul>
                    <p v-show="Mloading" class="page-loading">
                        <mt-spinner type="fading-circle"></mt-spinner>
                        加载中...
                    </p>
                </div>
            </mt-popup>
        </div>
        <img v-if="$store.state.noNetPic" class="novelNonet" src="../assets/img/nonet.png" alt="">
    </div>
</template>
<script>
    export default {
        name: 'noveldetail',
        data() {
            return {
                novelDetailHeight: 0,
                popupShow: false,
                novelMenulist: [],
                Mloading: false,
                allLoaded: false,
                novelId: '',
                novelType: '',
                novelName: '',
                novelStr: '',
                novelTitle: '',
                flag: false,
                menuBegin: 0,
                novelPage: 1,
                novelNextPage: '',
                novelPrePage: '',
                nowPage: '',
                PrenoPage: false,
                NextnoPage: false,
                novelInfo: [],
                obj: {},
                storagePage: 1,
                menuFlag: true,
                btnFlag: false,
                isRead: true,
            }
        },
        mounted() {
            this.novelDetailHeight = document.documentElement.clientHeight - 44;
        },
        watch: {
            novelPrePage(one, two) {
                if (one == 0) {
                    this.PrenoPage = true;
                } else {
                    this.PrenoPage = false;
                }
            },
            novelNextPage(one, two) {
                if (one == 0) {
                    this.NextnoPage = true;
                } else {
                    this.NextnoPage = false;
                }
            }
        },
        created() {
            this.novelId = this.$route.query.id;
            this.novelType = this.$route.query.type;
            this.novelName = this.$route.query.title;
            this.nowPage = JSON.parse(localStorage.getItem('novelInfo'))[this.novelId] || 1;
            if (localStorage.getItem('novelInfo') != null) {
                if (JSON.parse(localStorage.getItem('novelInfo'))[this.$route.query.id] != undefined) {
                    this.novelContent(this.$route.query.id, JSON.parse(localStorage.getItem('novelInfo'))[this.$route.query.id]);
                } else {
                    this.novelContent(this.$route.query.id, 1);
                }
            } else {
                this.novelContent(this.$route.query.id, 1);
            }
        },
        beforeRouteLeave(to, from, next) {
            if (localStorage.getItem('novelInfo') != null) {
                this.obj = JSON.parse(localStorage.getItem('novelInfo'));
            }
            this.obj[this.novelId] = this.nowPage;
            localStorage.setItem('novelInfo', JSON.stringify(this.obj));
            next();
        },
        methods: {
            goBack() {
                this.$router.push({path: 'novels'})
            },
            /* 点击获取目录列表 */
            menuList() {
                if (this.popupShow == false) {
                    this.popupShow = true;
                    if (this.menuFlag == true) {
                        this.catalog();
                    }
                } else {
                    this.popupShow = false;
                }
            },
            /* 加载更多 */
            loadMoreList() {
                if (this.flag == false) {
                    return false;
                }
                this.Mloading = true;
                this.catalog();
            },
            /*目录列表*/
            catalog() {
                this.$http({
                    method: 'get',
                    url: this.apiUrl.fictionCatalog,
                    params: {
                        imei: this.$store.state.deviceuuid,
                        id: this.novelId,
                        begin: this.menuBegin,
                    }
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        if (res.data.status == 1) {
                            var data = res.data.catalogList;
                            for (var i = 0; i < data.length; i++) {
                                this.novelMenulist.push(data[i]);
                                this.Mloading = false;
                            }
                            this.menuBegin = this.novelMenulist[this.novelMenulist.length - 1].chapter;
                            this.flag = res.data.hasmore;
                            this.menuFlag = res.data.hasmore;
                        } else {
                        }
                    }
                }).catch();
            },
            /*详情内容*/
            novelContent(id, page, title) {
                this.novelContentUpload(this.novelType, this.novelName, this.nowPage, page);
                if (!this.networkStatus()) {
                    return false;
                }
                this.popupShow = false;
                if (page == 0 || page > 20) {
                    this.isRead = false;
                    this.btnFlag = false;
                    this.novelTitle = title;
                    return false;
                } else {
                    this.isRead = true;
                }
                this.$http({
                    method: 'get',
                    url: this.apiUrl.fictionContent,
                    params: {
                        imei: this.$store.state.deviceuuid,
                        id: id,
                        page: page
                    }
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        $('#novelContent').scrollTop(0);
                        var data = res.data.content;
                        this.novelStr = res.data.content;
                        this.novelTitle = res.data.title;
                        this.novelNextPage = res.data.nextpage;
                        this.novelPrePage = res.data.prepage;
                        this.nowPage = res.data.currentpage;
                        this.btnFlag = true;
                    }
                }).catch();
            },
        }
    }
</script>
<style>
    .novel-detail .novel-detail-top {
        height: 44px;
        width: 100%;
        background: #e53526;
        position: relative;
        top: 0;
        left: 0;
        z-index: 9999;
    }

    .novel-detail .novel-detail-top .title {
        position: absolute;
        width: 65%;
        text-align: center;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        line-height: 44px;
        font-size: 16px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .novel-detail .novel-detail-top .return {
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        padding: 10px 15px;
    }

    .novel-detail .novel-detail-top .return img {
        width: 32%;
        vertical-align: middle;
    }

    .novel-detail .novel-detail-top .menu {
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: 8px;
    }

    .novel-detail .content {
        overflow-y: auto;
        padding: 20px 15px 0px 15px;
        font-size: 16px;
        letter-spacing: 2px;
        line-height: 32px;
        font-family: "Microsoft YaHei" ! important;
    }

    .novel-detail .content .chapter {
        display: flex;
        justify-content: center;
        height: 60px;
        align-items: center;
        text-align: center;
    }

    .novel-detail .content .chapter .novelbtn {
        flex: 1;
        padding: 0 20px;
        border-radius: 5px;
        margin: 0 20px;
        color: #fff;
    }

    .novel-detail .popupShow {
        width: 80%;
        height: 100%;
        background: #fff;
        padding-top: 44px;
        overflow-y: auto;
        padding-left: 20px;
    }

    .novel-detail .page-infinite-desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px;
    }

    .novel-detail .page-infinite {
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .novel-detail .page-infinite:first-child {
        border-top: solid 1px #eee;
    }

    .novel-detail .page-wrapper {
        margin-top: -1px;
        overflow: scroll;
    }

    .novel-detail .page-loading {
        text-align: center;
        height: 40px;
        line-height: 40px;
    }

    .novel-detail .page-loading div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }

    .novelActive {
        background: #999;
    }

    .novelActive1 {
        background: #e53526;
    }

    .novelNonet {
        width: 80%;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }

    .gowx {
        padding: 10px 0;
    }

    .gowxBth {
        background: #e53526;
        text-align: center;
        padding: 0 20px;
        border-radius: 5px;
        margin: 20px;
        color: #fff;
    }
</style>

