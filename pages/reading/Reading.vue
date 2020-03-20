<template>
    <view class="reading full-screen" :style="{background: style.background}">
        <read-book :bookText="contentText" :scrollDirection="style.scrollDirection"
                   :bookStyle="{ background:style.background,'font-size':style.fontSize+'px','line-height':style.lineHeight+'px','color':style.fontColor}"
                   @clickCenter="clickCenter" @scrollEnd="scrollEnd" @scrollStart="scrollStart"
                   @changePage="changePage">
        </read-book>

        <!-- 遮罩层下部分 -->
        <view class="mask-bottom" :style="{bottom:mask.showMask?0:-300+'rpx','background':mask.background}">
            <view class="v1">
                <view class="slider-warp">
                    字体：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="style.fontSize" @change="sliderChange($event,'fontSize')"
                            min="18" max="30"></slider>
                </view>
                <view class="slider-warp">
                    间距：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="style.lineHeight" @change="sliderChange($event,'padding')"
                            min="26" max="50"></slider>
                </view>
            </view>
            <view class="v1">
                滚动方向：
                <uni-tag text="左右" :inverted="style.scrollDirection==='topBottom'" type="primary"
                         @click="changeScrollDirection('leftRight')" size="small"/>
                <uni-tag text="上下" :inverted="style.scrollDirection==='leftRight'" type="primary"
                         @click="changeScrollDirection('topBottom')" size="small"
                         style="color: #333333; margin-left: 10px;"/>
            </view>
            <view class="v2">
                <view v-for="(item, index) in colorArr" :key="index" class="v2-circle"
                      :style="'background-color:' + item.background" @click="changeBackground(index)">
                    <text class="cuIcon-check text-red" v-show="mask.backgroundIndex===index"></text>
                </view>
            </view>
            <view class="v3 v-page">
                <view class="v3-item" :style="'color:' + style.fontColor">
                    <text class="cuIcon-sort"></text>
                    目录
                </view>
                <view class="v3-item v-page-item" :style="'color:' + style.fontColor">
                    {{currentPage}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import ReadBook from '../../components/ReadBook'
    import UniIcon from '../../components/UniIcon'
    import UniTag from '../../components/UniTag'
    import request from '../../util/request'

    export default {
        name: 'Reading',
        components: { UniTag, UniIcon, ReadBook },
        data () {
            return {
                mask: {//遮罩层
                    showMask: false,
                    background: '#fff',
                    backgroundIndex: 0,
                },
                style: {
                    background: '#f0f0f0',//页面背景颜色
                    fontSize: 18,//字体大小
                    lineHeight: 28,//字体间距
                    fontColor: '#000',//字体颜色
                    scrollDirection: 'leftRight',//滚动方向leftRight左右，上下topBottom
                },
                colorArr: [
                    {
                        background: '#f0f0f0',//背景色
                        maskBg: '#fff',//遮罩层色
                        fontColor: '#524d51',//字体颜色
                        color: '#f5f5f5',//选择圆圈颜色
                    },
                    {
                        background: '#d8c9aa',//背景色
                        maskBg: '#f3e4c3',//遮罩层色
                        fontColor: '#3c2506',//字体颜色
                        color: '#e0d1aa',//选择圆圈颜色
                    },
                    {
                        background: '#daba94',//背景色
                        maskBg: '#f8dcb4',//遮罩层色
                        fontColor: '#3c2506',//字体颜色
                        color: '#d8b784',//选择圆圈颜色
                    },
                    {
                        background: '#cfb793',//背景色
                        maskBg: '#f8dcb4',//遮罩层色
                        fontColor: '#674923',//字体颜色
                        color: '#d6b781',//选择圆圈颜色
                    },
                    {
                        background: '#aac9aa',//背景色
                        maskBg: '#cdeccd',//遮罩层色
                        fontColor: '#2c1e1e',//字体颜色
                        color: '#abcaab',//选择圆圈颜色
                    },
                    {
                        background: '#333b3d',//背景色
                        maskBg: '#313439',//遮罩层色
                        fontColor: '#7e8894',//字体颜色
                        color: '#626a75',//选择圆圈颜色
                    }
                ],
                novels: null,
                currentPage: '',
                //正文
                contentText: '',
                // 目录
                directory: ''
            }
        },
        onLoad (options) {
            this.novels = JSON.parse(options.novels)
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            let params = {
                condition: {
                    novelsId: this.novels.novelsId,
                    uniqueId: this.$store.state.userInfo.uniqueId,
                    directory: true
                }
            }
            request.post('/relation/beginReading', params).then(data => {
                if (data.status === 200) {
                    if (data.data.length) {
                        this.contentText = data.data[0].content
                    }
                    if (data.dataExt && data.dataExt.directory) {
                        this.directory = data.dataExt.directory
                    }
                }
            }).finally(() => {
                uni.hideLoading()
            })
            uni.setNavigationBarTitle({
                title: this.novels.title
            })
            uni.setNavigationBarColor({
                // 字体颜色 仅支持 #ffffff 和 #000000
                frontColor: '#000000',
                backgroundColor: '#f0f0f0',
            })
        },
        methods: {

            changePage (arg0) {
                this.currentPage = arg0
            },
            //点击中间
            clickCenter () {
                this.mask.showMask = !this.mask.showMask
            },
            //滚动到最后一页
            scrollEnd () {
                uni.showToast({
                    title: '最后一页了'
                })
            },
            //滚动到第一页
            scrollStart () {
                uni.showToast({
                    title: '第一页'
                })
            },
            //滑块设置字体间距或大小
            sliderChange (e, type) {
                if (type === 'fontSize') {
                    console.log('value 发生变化：' + e.detail.value)
                    this.style.fontSize = e.detail.value
                } else {
                    this.style.lineHeight = e.detail.value
                }
                //重新计算页面页数
                uni.$emit('lz-red-book-change')
            },
            //修改滚动方向
            changeScrollDirection (text) {
                this.style.scrollDirection = text
                //重新计算页面页数
                uni.$emit('lz-red-book-change', 'changeScrollDirection')
            },
            //修改背景颜色
            changeBackground (index) {
                this.mask.backgroundIndex = index
                this.style.background = this.colorArr[index].background//背景颜色
                this.style.fontColor = this.colorArr[index].fontColor//字体颜色
                this.mask.background = this.colorArr[index].maskBg//遮罩背景色
                let titleFontColor = '#000000'
                if (index === this.colorArr.length - 1) {
                    titleFontColor = '#ffffff'
                }
                uni.setNavigationBarColor({
                    // 字体颜色 仅支持 #ffffff 和 #000000
                    frontColor: titleFontColor,
                    backgroundColor: this.colorArr[index].background,
                })
                uni.setBackgroundColor({
                    backgroundColor: this.colorArr[index].background
                })
            },

        }
    }
</script>

<style scoped lang="scss">
    .reading {
        .mask-bottom {
            position: fixed;
            height: 300rpx;
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
                    height: 30px;
                    padding: 0 30rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                &.v-page {
                    display: flex;
                    position: relative;

                    .v-page-item {
                        position: absolute;
                        right: 0;
                        background-color: unset;
                    }
                }
            }
        }
    }
</style>
