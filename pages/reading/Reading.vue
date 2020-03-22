<template>
    <view class="reading full-screen" :style="{background: skin.pageBgColor}" @click="clickCenter">
        <scroll-view scroll-y="true" @scrolltoupper="scrollToUpper" @scrolltolower="scrollBottom" @scroll="scrollOn"
                     :scroll-top="scrollTop" class="scroll-content">
            <rich-text :nodes="nodes"
                       :style="[{background:skin.pageBgColor,'font-size':skin.fontSize+'px','line-height':skin.lineHeight+'px','color':skin.fontColor}]">
            </rich-text>
        </scroll-view>

        <!-- 遮罩层下部分 -->
        <view class="mask-bottom" :style="{bottom:isShowMask?0:-300+'rpx','background':skin.maskBgColor}">
            <view class="v1">
                <view class="slider-warp">
                    字体：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="skin.fontSize" @change="sliderChange($event,'fontSize')"
                            min="18" max="30"></slider>
                </view>
                <view class="slider-warp">
                    间距：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="skin.lineHeight" @change="sliderChange($event,'padding')"
                            min="26" max="50"></slider>
                </view>
            </view>
            <view class="v2">
                <view v-for="(item, index) in colorArr" :key="index" class="v2-circle"
                      :style="'background-color:' + item.pageBgColor" @click="changeBackground(index)">
                    <text class="cuIcon-check text-red" v-show="skin.currentSkinIndex===index"></text>
                </view>
            </view>
            <view class="v3 v-page">
                <view class="v3-item" :style="'color:' + skin.fontColor">
                    <button class="cu-btn block line-red" @tap="directoryBtn">
                        <text class="cuIcon-sort"></text>
                        目录
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import UniIcon from '../../components/UniIcon'
    import UniTag from '../../components/UniTag'
    import request from '../../util/request'
    import common from '../../util/common'

    export default {
        name: 'Reading',
        components: { UniTag, UniIcon },
        data () {
            return {
                isShowMask: false,
                skin: {
                    pageBgColor: '#f0f0f0',//页面背景颜色
                    maskBgColor: '#fff', // 遮罩层背景颜色
                    fontSize: 18,//字体大小
                    lineHeight: 28,//字体间距
                    fontColor: '#000',//字体颜色
                    currentSkinIndex: 0
                },
                colorArr: [
                    {
                        pageBgColor: '#f0f0f0',//背景色
                        maskBgColor: '#fff',//遮罩层色
                        fontColor: '#000'//字体颜色
                    },
                    {
                        pageBgColor: '#d8c9aa',//背景色
                        maskBgColor: '#f3e4c3',//遮罩层色
                        fontColor: '#3c2506',//字体颜色
                        color: '#e0d1aa',//选择圆圈颜色
                    },
                    {
                        pageBgColor: '#daba94',//背景色
                        maskBgColor: '#f8dcb4',//遮罩层色
                        fontColor: '#3c2506'//字体颜色
                    },
                    {
                        pageBgColor: '#cfb793',//背景色
                        maskBgColor: '#f8dcb4',//遮罩层色
                        fontColor: '#674923'//字体颜色
                    },
                    {
                        pageBgColor: '#aac9aa',//背景色
                        maskBgColor: '#cdeccd',//遮罩层色
                        fontColor: '#2c1e1e'//字体颜色
                    },
                    {
                        pageBgColor: '#333b3d',//背景色
                        maskBgColor: '#313439',//遮罩层色
                        fontColor: '#7e8894'//字体颜色
                    }
                ],
                novels: null,
                //正文
                chapterInfo: {},
                topChapterId: null,
                bottomChapterId: null,
                directory: [],
                scrollTop: 0,
                oldScrollTop: 0,
                oldHeight: 0,
                newHeight: 0,
                nodes: []
            }
        },
        onLoad (options) {
            this.novels = JSON.parse(options.novels)
            uni.setNavigationBarTitle({ title: this.novels.title })
            uni.showLoading({ title: 'loading...', mask: true })
            if (uni.getStorageSync('skin')) {
                this.skin = JSON.parse(uni.getStorageSync('skin'))
            }
            this.setSkin()
            if (!this.$store.state.userInfo) {
                this.noExistLoadBtn()
            } else {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId,
                        uniqueId: this.$store.state.userInfo.uniqueId
                    }
                }
                request.post('/relation/isExist', params).then(data => {
                    if (data.status === 200) {
                        this.existLoadBtn()
                    } else {
                        this.noExistLoadBtn()
                    }
                }).catch(() => {
                    uni.hideLoading()
                })
            }
        },
        methods: {
            existLoadBtn () {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId,
                        uniqueId: this.$store.state.userInfo.uniqueId
                    }
                }
                request.post('/relation/beginReading', params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.chapterInfo = data.data[0]
                        this.directory = data.listExt
                        this.topChapterId = this.bottomChapterId = this.chapterInfo.currentChapterId
                        this.convertNodes('begin')
                    }
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            noExistLoadBtn () {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId
                    }
                }
                request.post('/chapters/unknownTop', params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.chapterInfo = data.data[0]
                        this.directory = data.listExt
                        this.topChapterId = this.bottomChapterId = this.chapterInfo.currentChapterId
                        this.convertNodes('begin')
                    }
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            convertChapterIndex (chaptersId) {
                let result = 0
                for (let i = 0, len = this.directory.length; i < len; i++) {
                    if (this.directory[i].chapterId === chaptersId) {
                        result = i
                        break
                    }
                }
                return result
            },
            queryNewChapter (chaptersId, nodeType) {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId,
                        chaptersId: chaptersId
                    }
                }
                if (this.$store.state.userInfo) {
                    params.condition.uniqueId = this.$store.state.userInfo.uniqueId
                }
                uni.showLoading({ title: 'loading...', mask: true })
                request.post('/relation/readNewChapter', params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.chapterInfo = data.data[0]
                        if (nodeType === 'insert') {
                            this.topChapterId = this.bottomChapterId = this.chapterInfo.currentChapterId
                        }
                        this.convertNodes(nodeType)
                    }
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            // nodeType: begin => 点击开始阅读时; top => 顶部下拉; bottom=> 底部上拉;insert => 目录页跳转;
            convertNodes (nodeType) {
                let node = `<div class="node-title">${this.chapterInfo.chapter}</div><div class="node-content">${this.chapterInfo.content}</div>`
                if (nodeType === 'top') {
                    this.nodes = node + this.nodes
                    this.scrollTop = this.oldScrollTop
                    this.$nextTick(() => {
                        this.scrollTop = this.oldHeight
                    })
                } else if (nodeType === 'bottom') {
                    this.nodes = this.nodes + node
                } else {
                    this.nodes = node
                    this.$nextTick(() => {
                        this.scrollTop = 0
                        this.oldScrollTop = 0
                        this.oldHeight = 0
                        this.newHeight = 0
                    })
                }
            },
            //点击中间
            clickCenter () {
                this.isShowMask = !this.isShowMask
            },
            scrollToUpper (e) {
                common.throttle(this, () => {
                    let index = this.convertChapterIndex(this.topChapterId)
                    if (index > 0) {
                        this.topChapterId = this.directory[--index].chapterId
                        this.queryNewChapter(this.topChapterId, 'top')
                    }
                }, 5000)()
            },
            scrollBottom (e) {
                common.throttle(this, () => {
                    let index = this.convertChapterIndex(this.bottomChapterId)
                    if (index < this.directory.length - 1) {
                        this.bottomChapterId = this.directory[++index].chapterId
                        this.queryNewChapter(this.bottomChapterId, 'bottom')
                    }
                }, 5000)()
            },
            scrollOn (e) {
                // this.setScrollTop(e.target.scrollTop)
                let scrollHeight = e.detail.scrollHeight
                if (this.newHeight === 0) {
                    this.newHeight = scrollHeight
                } else if (this.newHeight !== scrollHeight) {
                    this.oldHeight = scrollHeight - this.newHeight
                    this.newHeight = scrollHeight
                }
                this.oldScrollTop = e.detail.scrollTop
            },
            setScrollTop (scrollTop) {
                try {
                    uni.setStorageSync(this.novels.novelsId + ':scrollTop', scrollTop)
                } catch (e) {
                    // error
                }
            },
            directoryBtn () {
                uni.navigateTo({
                    url: '/pages/reading/Directory?directory=' + JSON.stringify(this.directory) + '&currentChapterId=' + this.chapterInfo.currentChapterId
                })
            },
            //滑块设置字体间距或大小
            sliderChange (e, type) {
                if (type === 'fontSize') {
                    this.skin.fontSize = e.detail.value
                } else {
                    this.skin.lineHeight = e.detail.value
                }
                uni.setStorage({
                    key: 'skin',
                    data: JSON.stringify(this.skin)
                })
            },
            setSkin () {
                let titleFontColor = '#000000'
                if (this.skin.pageBgColor === '#333b3d') {
                    titleFontColor = '#ffffff'
                }
                uni.setNavigationBarColor({
                    // 字体颜色 仅支持 #ffffff 和 #000000
                    frontColor: titleFontColor,
                    backgroundColor: this.skin.pageBgColor,
                })
                uni.setBackgroundColor({
                    backgroundColor: this.skin.pageBgColor
                })
            },
            //修改背景颜色
            changeBackground (index) {
                this.skin.currentSkinIndex = index
                this.skin.pageBgColor = this.colorArr[index].pageBgColor//背景颜色
                this.skin.fontColor = this.colorArr[index].fontColor//字体颜色
                this.skin.maskBgColor = this.colorArr[index].maskBgColor//遮罩背景色
                this.setSkin()
                uni.setStorage({
                    key: 'skin',
                    data: JSON.stringify(this.skin)
                })
            },

        }
    }
</script>

<style scoped lang="scss">
    .reading {

        .scroll-content {
            height: 100%;
            padding: 0 16rpx;
        }

        .mask-bottom {
            position: fixed;
            height: 270rpx;
            transition: all 0.2s;
            width: 100%;
            z-index: 1000;
            margin: auto;
            border-radius: 10px 10px 0 0;
            padding: 10px;
            box-sizing: border-box;

            .v1 {
                width: 100%;
                display: flex;
                align-items: center;

                .slider-warp {
                    display: flex;
                    flex: 1;
                    align-items: center;

                    .slider {
                        flex: 1;
                    }
                }
            }

            .v2 {
                display: flex;
                width: 100%;
                justify-content: space-around;
                margin-top: 10px;

                .v2-circle {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .v3 {
                margin-top: 10px;

                .v3-item {
                    height: 42px;
                    padding: 0 30rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .cu-btn {
                        width: 300rpx;
                    }
                }
            }
        }

        /deep/ .node-title {
            font-weight: bold;
            margin-bottom: 100rpx;
        }

        /deep/ .node-content {
            margin-bottom: 100rpx;
        }
    }

</style>
