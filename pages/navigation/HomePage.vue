<template>
    <view class="home-page">
        <view class="cu-list full-size">
            <view class="cu-card article no-card" v-for="(item, index) in result" :key="index">
                <view class="cu-item shadow">
                    <view class="content">
                        <uni-image class="image-size" :url="item.coverUrl"></uni-image>
                        <view class="desc">
                            <view class="title text-cut text-shadow">{{item.title}}</view>
                            <view class="text-content">{{convertIntroduction(item.introduction)}}</view>
                            <view>
                                <view class="cu-tag bg-red light sm round">{{item.author}}</view>
                                <view class="cu-tag bg-green light sm round">{{convertCategory(item.sex,
                                    item.category)}}
                                </view>
                                <view class="cu-tag bg-yellow light sm round">{{convertSex(item.sex)}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request'
    import common from '../../util/common'
    import Category from '../../util/category'

    export default {
        name: 'HomePage',
        data () {
            return {
                page: {
                    index: 0,
                    size: 20,
                    total: 0
                },
                result: []
            }
        },
        onLoad () {
            uni.startPullDownRefresh()
        },
        onReachBottom () {
            if (this.page.index < Math.ceil(this.page.total / this.page.size)) {
                this.queryHomePage('more')
            }
        },
        onPullDownRefresh () {
            this.queryHomePage('first')
        },
        methods: {
            queryHomePage (type) {
                if (type === 'first') {
                    this.page.index = 0
                }
                let params = {
                    recordStartNo: this.page.index,
                    pageRecordNum: this.page.size
                }
                request.post('/novels/homePage', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.page.total = data.total;
                        if (type === 'first') {
                            this.result = data.data
                        } else {
                            this.result = this.result.concat(data.data)
                        }
                        ++this.page.index
                    }
                }).finally(() => {
                    if (type === 'first') {
                        uni.stopPullDownRefresh()//得到数据后停止下拉刷新
                    }
                })
            },
            convertSex (sex) {
                return common.getSex(sex)
            },
            convertCategory (sex, category) {
                return Category[sex][category]
            },
            convertIntroduction (introduction) {
                return common.getIntroduction(introduction)
            }
        }

    }
</script>

<style lang="scss" scoped>
    .home-page {
        .cu-list {
            overflow: auto;

            .cu-card {
                padding-bottom: 10upx;

                .cu-item {
                    padding: unset;
                    background: unset;

                    .content {
                        padding: 0 15upx;

                        .image-size {
                            width: 180upx;
                            margin-top: 18upx;
                            height: 8em;
                            margin-right: 20upx;
                            border-radius: 6upx;
                        }

                        .title {
                            padding: unset;
                            height: 60upx;
                            line-height: 72upx;
                        }
                    }
                }
            }
        }
    }
</style>