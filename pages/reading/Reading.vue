<template>
    <view class="reading full-screen" :style="{background: skin.pageBgColor}">
        <scroll-view scroll-y="true" @scrolltoupper="scrollTop" @scrolltolower="scrollBottom" @scroll="scrollOn"
                     :scroll-top="scrollPosition" class="scroll-content">
            <rich-text @click="clickCenter" :nodes="contentText"
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
                    <button class="cu-btn block line-red">
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
                contentText: '',
                // 目录
                directory: '',
                scrollPosition: -1,
                hasExist: false
            }
        },
        onLoad (options) {
            this.novels = JSON.parse(options.novels)
            uni.setNavigationBarTitle({ title: this.novels.title })
            uni.showLoading({ title: '加载中', mask: true })
            if (uni.getStorageSync('skin')) {
                this.skin = JSON.parse(uni.getStorageSync('skin'))
            }
            this.setSkin();
            if (!this.$store.state.userInfo) {
                this.noExistLoadBtn();
            } else {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId,
                        uniqueId: this.$store.state.userInfo.uniqueId
                    }
                }
                request.post('/relation/isExist', params).then(data => {
                    if (data.status === 200) {
                        this.hasExist = true;
                        this.existLoadBtn();
                    } else {
                        this.hasExist = false;
                        this.noExistLoadBtn();
                    }
                }).catch(() => {
                    uni.hideLoading();
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
                        this.contentText = data.data[0].content
                        this.$nextTick(() => {
                            this.scrollPosition = uni.getStorageSync(this.novels.novelsId + ':scrollTop') || -1
                        })
                    }
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            noExistLoadBtn() {
                let params = {
                    condition: {
                        novelsId: this.novels.novelsId
                    }
                }
                request.post('/chapters/unknownTop', params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.contentText = data.data[0].content
                    }
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            //点击中间
            clickCenter () {
                this.isShowMask = !this.isShowMask
            },
            scrollTop (e) {
                console.log('top:' + JSON.stringify(e))
            },
            scrollBottom (e) {
                console.log('bottom:' + JSON.stringify(e))
            },
            scrollOn (e) {
                uni.setStorage({
                    key: this.novels.novelsId + ':scrollTop',
                    data: e.target.scrollTop
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
            setSkin() {
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
    }

</style>
