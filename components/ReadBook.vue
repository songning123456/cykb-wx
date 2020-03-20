<template>
    <view class="read-book" @touchstart="overall_start" @touchmove="overall_move">
        <!-- 遮罩层部分 -->
        <view class="mask">
            <view class="row">
                <view class="column"></view>
                <view class="column"></view>
                <view class="column" v-if="scrollDirection === 'topBottom'" @click="bottomSlip()"></view>
                <view class="column" v-if="scrollDirection === 'leftRight'"></view>
            </view>
            <view class="row">
                <view class="column" @click="rightSlip"></view>
                <view class="column" @click="clickCenter"></view>
                <view class="column" @click="leftSlip"></view>
            </view>
            <view class="row">
                <view class="column" @click="rightSlip"></view>
                <view class="column"></view>
                <view class="column" v-if="scrollDirection === 'leftRight'" @click="leftSlip"></view>
                <view class="column" v-if="scrollDirection === 'topBottom'" @click="topSlip('click')"></view>
            </view>
        </view>
        <!-- 小说文字内容部分 -->
        <view :class="scrollDirection === 'leftRight' ? 'leftRight' : 'topBottom'"
              :style="[{ transform: 'translate(' + set.translateX + 'rpx, ' + set.translateY + 'rpx)' },bookStyle]">
            <view class="pageText">{{ bookText }}</view>
        </view>
    </view>
</template>

<script>

    export default {
        name: 'ReadBook',
        props: {
            scrollDirection: {
                //滚动方向leftRight左右，上下topBottom
                type: String,
                default: 'leftRight'
            },
            bookText: {
                //书的文本内容，如第一章的内容
                type: String,
                default: ''
            },
            bookStyle: {
                //书的样式
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            pageVal () {
                return (this.scrollDirection === 'leftRight' ? this.page.pageNum : this.topPage.pageNum) + '/' + (this.scrollDirection ===
                'leftRight' ? this.page.pageCount : this.topPage.pageCount);
            }
        },
        watch: {
            pageVal: {
                handler(newVal, oldVal) {
                    this.$emit('changePage', newVal);
                },
                immediate: true
            }
        },
        data () {
            return {
                set: {
                    screenHeight: '', //屏幕宽度
                    translateX: '0', //距离左边位置
                    translateY: '0' //距离上边
                },
                system: {
                    quantity: 0, //系统电量
                    time: '' //系统时间
                },
                touch: {
                    startX: 0,
                    startY: 0,
                    huadong_onoff: false //滑动是否开始
                },
                page: {
                    //左右滑动的
                    pageCount: 0, //当前章节总页数
                    pageNum: 1 //当前页数
                },
                topPage: {
                    //上下滑动的
                    pageCount: 0, //当前章节总页数
                    pageNum: 1 //当前页数
                }
            }
        },
        mounted () {
            let that = this
            this.getSystemInfo()

            //监听字体改变时初始化页数
            uni.$off('lz-red-book-change')
            uni.$on('lz-red-book-change', (res) => {
                setTimeout(() => {
                    if (res === 'changeScrollDirection') {//修改了滚动方向
                        that.set = {
                            translateX: '0', //距离左边位置
                            translateY: '0' //距离上边
                        }
                    }
                    // 获取元素信息
                    that.getSystemInfo()
                }, 1000)
            })
        },
        methods: {
            //获取系统信息
            getSystemInfo () {
                let that = this
                uni.getSystemInfo({
                    success: function (res) {
                        that.set.screenHeight = res.screenHeight
                        // 获取元素信息
                        that.selectorQuery()
                    }
                })
            },
            // 获取元素信息
            selectorQuery () {
                let that = this
                let query = uni.createSelectorQuery().in(this)
                query.select('.pageText').boundingClientRect(data => {
                    console.log(data)
                    console.log('左右滑动总页数', Math.ceil(data.width / 375))
                    that.page.pageCount = Math.ceil(data.width / 375)
                    console.log('上下滑动总页数', Math.ceil(data.height / that.set.screenHeight))
                    that.topPage.pageCount = Math.ceil(data.height / that.set.screenHeight)
                }).exec()
            },
            //滑动开始
            overall_start (e) {
                (this.touch.startX = e.pageX || e.touches[0].pageX), (this.touch.startY = e.pageY || e.touches[0].pageY)
                this.touch.huadong_onoff = true
            },
            //滑动中整个页面
            overall_move (e) {
                let that = this
                if (this.touch.huadong_onoff) {
                    //获取滑动屏幕时的X,Y
                    let endX = e.pageX || e.touches[0].pageX
                    let endY = e.pageY || e.touches[0].pageY
                    //获取滑动距离
                    let distanceX = endX - this.touch.startX
                    let distanceY = endY - this.touch.startY
                    //判断滑动方向
                    if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
                        console.log('往右滑动')
                        that.rightSlip()
                    } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
                        console.log('往左滑动')
                        that.leftSlip()
                    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) {
                        console.log('往上滑动')
                        if (that.scrollDirection === 'topBottom') {
                            that.topSlip()
                        }
                    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
                        console.log('往下滑动')
                        if (that.scrollDirection === 'topBottom') {
                            that.bottomSlip()
                        }
                    } else {
                        console.log('点击未滑动')
                    }
                    this.touch.huadong_onoff = false
                }
            },
            //右滑
            rightSlip () {
                let that = this
                if (that.scrollDirection === 'leftRight') {
                    that.computedPercentageRight((page) => {
                        console.log(page)
                       if (page > 0) {
                           that.page.pageNum = page
                       }
                        if (page < 0) {
                            that.$emit('scrollStart')
                            that.page.pageNum = 1
                            return
                        }
                        that.set.translateX += 750
                    })
                }
            },
            // 左滑
            leftSlip () {
                let that = this
                if (that.scrollDirection === 'leftRight') {
                    that.computedPercentageLeft((page) => {
                        console.log(page)
                        that.page.pageNum = page
                        if (page > that.page.pageCount) {
                            that.$emit('scrollEnd')
                            that.page.pageNum = that.page.pageCount
                            return
                        }
                        that.set.translateX -= 750
                    })
                }
            },
            //上滑
            topSlip (type) {
                let that = this
                if (type === 'click') {
                    let query = uni.createSelectorQuery().in(this)
                    query.select('.topBottom').boundingClientRect(data => {
                        console.log(-data.top)
                        uni.pageScrollTo({
                            scrollTop: that.set.screenHeight - data.top,
                            duration: 200
                        })
                    }).exec()
                }
                if (that.scrollDirection === 'topBottom') {
                    //计算滚动百分比
                    that.computedPercentage(function (page) {
                        console.log(that.set.translateY)
                        that.topPage.pageNum = page
                        if (page > that.topPage.pageCount || page === that.topPage.pageCount) {
                            that.topPage.pageNum = that.topPage.pageCount
                            that.$emit('scrollEnd')
                        }
                        // that.set.translateY -= that.set.screenHeight;
                    })
                }

            },
            //下滑
            bottomSlip (type) {
                let that = this
                if (that.scrollDirection === 'topBottom') {
                    //计算滚动百分比
                    that.computedPercentage((page) => {
                        console.log(that.set.translateY)
                        that.topPage.pageNum = page
                        if (page < 1 || page === 1) {
                            that.topPage.pageNum = 1
                            if (that.set.translateY === 0) {
                                that.$emit('scrollStart')
                            }
                            that.set.translateY = 0
                        }
                        // that.set.translateY += that.set.screenHeight;
                    })
                }
            },
            //计算上滑下滑滚动百分比
            computedPercentage (callback) {
                let that = this
                let query = uni.createSelectorQuery().in(this)
                query.select('.topBottom').boundingClientRect(data => {
                    let num = (that.set.screenHeight - data.top) / data.height
                    let page = Math.floor(num * that.topPage.pageCount)
                    console.log('百分比', num)
                    console.log('当前页数', page)
                    callback(page)
                }).exec()
            },
            //计算左滑滚动百分比
            computedPercentageLeft (callback) {
                let that = this
                let query = uni.createSelectorQuery().in(this)
                query.select('.pageText').boundingClientRect(data => {
                    console.log(data)
                    let num = -((data.left - 375) / data.width)
                    let page = Math.ceil(num * that.page.pageCount)
                    // console.log('百分比', num);
                    // console.log('当前页数', page);
                    callback(page)
                }).exec()
            },
            //计算右滑滚动百分比
            computedPercentageRight (callback) {
                let that = this
                let query = uni.createSelectorQuery().in(this)
                query.select('.pageText').boundingClientRect(data => {
                    console.log(data)
                    let num = -((data.left + 375) / data.width)
                    let page = Math.ceil(num * that.page.pageCount)
                    // console.log('百分比', num);
                    // console.log('当前页数', page);
                    callback(page)
                }).exec()
            },
            //点击中间位置
            clickCenter () {
                this.$emit('clickCenter')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .read-book {
        width: 750rpx;
        height: 100%;

        .leftRight {
            column-width: 750rpx;
            column-count: 1;
            width: auto;
            height: 100%;
            transition: transform 0.2s;
            column-gap: 40rpx;
            padding: 20rpx;
            box-sizing: border-box;
            word-wrap: break-word;
            margin-bottom: 10px;

        }

        .topBottom {
            height: auto;
            column-gap: 40rpx;
            padding: 20rpx;
            box-sizing: border-box;
            word-wrap: break-word;
            margin-bottom: 10px;
        }

        .mask {
            // background: #888;
            opacity: 0.5;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;

            .row {
                display: flex;
                width: 100%;
                flex: 1;

                .column {
                    // border: 1px solid #1aad19;
                    flex: 1;
                }
            }
        }
    }
</style>
