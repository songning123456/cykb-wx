<template>
    <view class="home-page">
        <view class="cu-list full-size">
            <view class="cu-card article no-card" v-for="(item, index) in result" :key="index"
                  @tap="bookDetailBtn(item)">
                <view class="cu-item shadow">
                    <view class="content">
                        <custom-image class="image-size" :url="item.coverUrl || 'http://'"></custom-image>
                        <view class="desc">
                            <view class="title text-cut text-shadow">{{item.title || '未知书名'}}</view>
                            <view class="text-content">{{item.introduction || '暂无简介...'}}</view>
                            <view>
                                <view class="cu-tag bg-red light sm round">{{item.author || '未知作者'}}</view>
                                <view class="cu-tag bg-green light sm round">{{item.category || '未知类别'}}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <back-top :show-btn="showBackTop" @backTop="backTopBtn"></back-top>
    </view>
</template>

<script>
    import request from '../../util/request';
    import BackTop from '../../components/BackTop';

    export default {
        name: 'HomePage',
        components: { BackTop },
        data () {
            return {
                pageSize: 100,
                pageResult: [],
                result: [],
                scrollBottomStatus: false,
                showBackTop: false
            };
        },
        onLoad () {
            uni.startPullDownRefresh();
        },
        onReachBottom () {
            if (this.scrollBottomStatus) {
                return;
            } else {
                this.scrollBottomStatus = true;
            }
            this.queryHomePage('more');
        },
        onPullDownRefresh () {
            this.queryHomePage('first');
        },
        onPageScroll(object) {
            if (object.scrollTop > 5000) {
                this.showBackTop = true;
            } else if (object.scrollTop < 5000) {
                this.showBackTop = false;
            }
        },
        methods: {
            backTopBtn() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 1000
                });
            },
            queryHomePage (type) {
                let params = Object.create(null);
                params.pageRecordNum = this.pageSize;
                if (type === 'first') {
                    params.recordStartNo = 0;
                } else {
                    if (this.pageResult.length > 0) {
                        params.condition = Object.create(null);
                        params.condition.createTime = this.pageResult[this.pageResult.length - 1].createTime;
                    } else {
                        return;
                    }
                }
                request.post('/novels/homePage', params).then(data => {
                    if (data.status === 200) {
                        this.pageResult = data.data;
                        if (type === 'first') {
                            this.result = data.data;
                        } else {
                            this.result = this.result.concat(data.data);
                        }
                    }
                }).finally(() => {
                    if (type === 'first') {
                        uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                    }
                    if (this.scrollBottomStatus) {
                        this.scrollBottomStatus = false;
                    }
                });
            },
            bookDetailBtn (novels) {
                uni.setStorageSync('navigateParams', {novels: novels});
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail'});
            }
        }

    };
</script>

<style lang="scss" scoped>
    .home-page {
        .cu-list {
            overflow: auto;

            .cu-card {
                padding-bottom: 10rpx;

                .cu-item {
                    padding: unset;
                    background: unset;

                    .content {
                        padding: 0 15rpx;

                        .image-size {
                            width: 180rpx;
                            margin-top: 18rpx;
                            height: 8em;
                            margin-right: 20rpx;
                            border-radius: 6rpx;
                        }

                        .title {
                            padding: unset;
                            height: 60rpx;
                            line-height: 72rpx;
                        }
                    }
                }
            }
        }
    }
</style>
