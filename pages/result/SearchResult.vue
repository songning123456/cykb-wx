<template>
    <view class="search-result">
        <view class="cu-list full-size">
            <view class="cu-card article no-card" v-for="(item, index) in result" :key="index" @tap="bookDetailBtn(item)">
                <view class="cu-item shadow">
                    <view class="content">
                        <custom-image class="image-size" :url="item.coverUrl || 'http://'"></custom-image>
                        <view class="desc">
                            <view class="title text-cut text-shadow">{{item.title || '未知书名'}}</view>
                            <view class="text-content">{{getIntro(item.introduction)}}</view>
                            <view>
                                <view class="cu-tag bg-red light sm round">{{item.author || '未知作者'}}</view>
                                <view class="cu-tag bg-green light sm round">{{item.category || '未知类别'}}</view>
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
    import introDel from '../../util/introDel';

    export default {
        name: 'SearchResult',
        components: { BackTop },
        data () {
            return {
                loadParams: null,
                loadType: '',
                pageSize: 100,
                pageResult: [],
                result: [],
                scrollLeft: 0,
                scrollBottomStatus: false,
                showBackTop: false
            };
        },
        onLoad () {
            let response = uni.getStorageSync('navigateParams').params;
            this.loadType = response.type;
            if (response.type === 'classify') {
                this.loadParams = {
                    category: response.category
                };
                uni.setNavigationBarTitle({ title: response.category });
            } else if (response.type === 'searchResult') {
                this.loadParams = {
                    authorOrTitle: response.authorOrTitle
                };
                uni.setNavigationBarTitle({ title: '搜索结果' });
            }
            uni.startPullDownRefresh();
        },
        onReachBottom () {
            if (this.scrollBottomStatus) {
                return;
            } else {
                this.scrollBottomStatus = true;
            }
            if (this.loadType === 'classify') {
                this.queryConstantResult('more', '/novels/categoryResult');
            } else if (this.loadType === 'searchResult') {
                this.queryConstantResult('more', '/novels/searchResult');
            }
        },
        onPullDownRefresh () {
            if (this.loadType === 'classify') {
                this.queryConstantResult('first', '/novels/categoryResult');
            } else if (this.loadType === 'searchResult') {
                this.queryConstantResult('first', '/novels/searchResult');
            }
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
            getIntro(val) {
                return introDel.getIntro(val);
            },
            queryConstantResult (firstOrMore, url) {
                let params = {
                    pageRecordNum: this.pageSize,
                    condition: this.loadParams
                };
                if (firstOrMore === 'first') {
                    params.recordStartNo = 0;
                } else {
                    if (this.pageResult.length > 0) {
                        params.condition.createTime = this.pageResult[this.pageResult.length - 1].createTime;
                    } else {
                        return;
                    }
                }
                request.post(url, params).then(data => {
                    if (data.status === 200) {
                        this.pageResult = data.data;
                        if (firstOrMore === 'first') {
                            this.result = data.data;
                        } else {
                            this.result = this.result.concat(data.data);
                        }
                    }
                }).finally(() => {
                    if (firstOrMore === 'first') {
                        uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                        uni.hideLoading();
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
    .search-result {

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
