<template>
    <view class="search-result">
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
        name: 'SearchResult',
        data () {
            return {
                params: null,
                pageSize: 20,
                pageResult: [],
                result: []
            }
        },
        onLoad (option) {
            if (option.classify) {
                this.params = JSON.parse(option.classify)
                uni.setNavigationBarTitle({
                    title: Category[this.params.sex][this.params.category]
                })
            }
            uni.startPullDownRefresh()
        },
        onReachBottom () {
            this.queryClassifyResult('more')
        },
        onPullDownRefresh () {
            this.queryClassifyResult('first')
        },
        methods: {
            queryClassifyResult (type) {
                let params = {
                    pageRecordNum: this.pageSize,
                    condition: {
                        sex: this.params.sex,
                        category: this.params.category
                    }
                }
                if (type === 'first') {
                    params.recordStartNo = 0
                } else {
                    if (this.pageResult.length > 0) {
                        params.condition.createTime = this.pageResult[this.pageResult.length - 1].createTime
                    } else {
                        return
                    }
                }
                request.post('/novels/classifyResult', params).then(data => {
                    if (data.status === 200) {
                        this.pageResult = data.data
                        if (type === 'first') {
                            this.result = data.data
                        } else {
                            this.result = this.result.concat(data.data)
                        }
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
    .search-result {
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