<template>
    <view class="book-detail full-screen">
        <view class="cu-card case no-card margin-bottom-sm">
            <view class="cu-item shadow">
                <view class="image text-center">
                    <uni-image class="cu-avatar image-size" :url="novels.coverUrl"></uni-image>
                    <view class="margin-top-xs text-gray text-df">{{novels.title}}</view>
                    <view class="margin-top-xs">
                        <view class="cu-tag bg-red light sm round">{{novels.author}}</view>
                        <view class="cu-tag bg-green light sm round">{{convertCategory(novels.sex, novels.category)}}
                        </view>
                        <view class="cu-tag bg-yellow light sm round">{{convertSex(novels.sex)}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="cu-card article no-card margin-bottom-sm bg-white">
            <view class="title text-center text-bold padding-top-xs">
                <text>简介</text>
            </view>
            <view class="content padding introduction">
                {{novels.introduction}}
            </view>
        </view>
        <view class="cu-list menu">
            <view class="cu-item">
                <view class="content">
                    <text class="text-black">最新章节</text>
                </view>
                <view class="action text-cut">
                    {{novels.latestChapter}}
                </view>
            </view>
            <view class="cu-item">
                <view class="content">作者还写过</view>
                <view class="action text-gray">更多</view>
            </view>
            <scroll-view scroll-x="true" class="author-books margin-bottom-sm">
                <block v-for="(item, index) in authorBooks" :key="index">
                    <view class="author-book" @tap="">
                        <view class="avatar-img">
                            <uni-image :url="item.coverUrl" class="uni-image"></uni-image>
                        </view>
                        <view class="text-cut text-center">{{item.title}}</view>
                    </view>
                </block>
            </scroll-view>
        </view>
        <view class="bottom-bar bg-white">
            <view class="btn-group cu-bar tabbar">
                <button class="cu-btn text-red line-red shadow">加入书架</button>
                <button class="cu-btn bg-red shadow-blur">开始阅读</button>
            </view>
        </view>
    </view>
</template>

<script>
    import common from '../../util/common'
    import Category from '../../util/category'
    import request from '../../util/request'

    export default {
        name: 'BookDetail',
        data () {
            return {
                novels: {
                    coverUrl: '',
                    title: '',
                    author: '',
                    sex: 'male',
                    category: ''
                },
                authorBooks: []
            }
        },
        onLoad (option) {
            this.novels = JSON.parse(option.novels)
            this.querySameAuthor()
        },
        methods: {
            convertSex (sex) {
                return common.getSex(sex)
            },
            convertCategory (sex, category) {
                return Category[sex][category]
            },
            querySameAuthor () {
                let params = {
                    condition: {
                        author: this.novels.author
                    }
                }
                request.post('/novels/sameAuthor', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        // this.authorBooks = data.data.filter(item => item.title === this.novels.title)
                        this.authorBooks = [data.data[0], data.data[0], data.data[0], data.data[0],data.data[0],data.data[0],data.data[0],data.data[0],];
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .book-detail {
        .cu-card {
            width: 100%;

            .introduction {
                max-height: 380upx;
                overflow: auto;
            }

            .cu-item {
                width: 100%;
                height: 100%;

                .image {
                    width: 100%;
                    height: 100%;
                    padding: 30upx;
                    box-sizing: border-box;
                    margin: unset;

                    .image-size {
                        width: 165upx;
                        height: 220upx;
                        border-radius: 6upx;
                    }

                    .cu-tag {
                        position: unset;
                    }
                }
            }
        }

        .author-books {
            white-space: nowrap; // 滚动必须加的属性
            width: 100%;
            padding: 20upx;
            margin: 0 auto;

            .author-book {
                width: 24%;
                margin-right: 20upx;
                display: inline-block;
                vertical-align: top;

                .avatar-img {
                    display: inline-block;
                    height: 220upx;
                    width: 165upx;
                    border-radius: 6upx;
                    position: relative;

                    .uni-image {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .bottom-bar {
            bottom: 0;
            position: fixed;
            width: 100%;
            border-top: 1px solid grey;
        }
    }

</style>
