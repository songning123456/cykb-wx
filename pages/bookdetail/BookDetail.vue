<template>
    <view class="book-detail full-screen">
        <view class="book-frame">
            <view class="cu-card case no-card margin-bottom-sm">
                <view class="cu-item shadow">
                    <view class="image text-center">
                        <custom-image class="cu-avatar image-size" :url="novels.coverUrl || 'http://'"></custom-image>
                        <view class="margin-top-xs text-gray text-df">{{novels.title || '未知书名'}}</view>
                        <view class="margin-top-xs">
                            <view class="cu-tag bg-red light sm round">{{novels.author || '未知作者'}}</view>
                            <view class="cu-tag bg-green light sm round">{{novels.category || '未知类别'}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="cu-card article no-card margin-bottom-sm bg-white">
                <view class="title text-center text-bold padding-top-xs">
                    <text>简介</text>
                </view>
                <view class="content padding introduction">
                    {{getIntro(novels.introduction)}}
                </view>
            </view>
            <view class="cu-list menu">
                <view class="cu-item text-cut">
                    <view class="content">
                        <text class="text-black">最新章节</text>
                    </view>
                    <view class="action text-cut" style="width: 75%">
                        {{novels.latestChapter || '未知章节'}}
                    </view>
                </view>
                <view class="cu-item" @click="changeShowMore">
                    <view class="content">作者还写过</view>
                    <view class="action text-gray" :class="{'rotate-90': showMore}">
                        <text class="lg text-gray cuIcon-right"></text>
                    </view>
                </view>
                <scroll-view scroll-x="true" scroll-y="true" class="author-books margin-bottom-sm" v-show="showMore">
                    <block v-for="(item, index) in authorBooks" :key="index">
                        <view class="author-book" @tap="SimilarBookBtn(item)">
                            <view class="avatar-img">
                                <custom-image :url="item.coverUrl" class="uni-image"></custom-image>
                            </view>
                            <view class="text-cut text-center">{{item.title || '未知书名'}}</view>
                        </view>
                    </block>
                </scroll-view>
            </view>
        </view>
        <view class="bottom-bar">
            <view class="btn-group cu-bar tabbar">
                <button class="cu-btn text-red line-red shadow" @tap="addBookcase">加入书架</button>
                <button class="cu-btn bg-red shadow-blur" @tap="startReading">开始阅读</button>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';
    import introDel from '../../util/introDel';

    export default {
        name: 'BookDetail',
        data () {
            return {
                novels: {
                    coverUrl: '',
                    title: '',
                    author: '',
                    category: ''
                },
                authorBooks: [],
                showMore: true
            };
        },
        onLoad () {
            this.novels = uni.getStorageSync('navigateParams').novels;
            this.querySameAuthor();
        },
        methods: {
            changeShowMore () {
                this.showMore = !this.showMore;
            },
            getIntro(val) {
                return introDel.getIntro(val);
            },
            querySameAuthor () {
                let params = {
                    condition: {
                        author: this.novels.author
                    }
                };
                request.post('/novels/sameAuthor', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.authorBooks = data.data.filter(item => item.title !== this.novels.title);
                    }
                });
            },
            SimilarBookBtn (novels) {
                uni.setStorageSync('navigateParams', {novels: novels});
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail'});
            },
            addBookcase () {
                if (!(this.novels && this.novels.novelsId)) {
                    uni.showToast({
                        title: '不可加入书架',
                        image: '/static/image/error.png',
                        duration: 2000
                    });
                    return;
                }
                if (this.$store.state.userInfo) {
                    let params = {
                        condition: {
                            novelsId: this.novels.novelsId,
                            usersId: this.$store.state.userInfo.usersId
                        }
                    };
                    uni.showLoading({ title: 'loading...', mask: true });
                    request.post('/relation/insertBookcase', params).then(data => {
                        uni.hideLoading();
                        if (data.status === 200) {
                            uni.showToast({ title: '已添加至书架', duration: 1000 });
                        } else if (data.status === 201) {
                            uni.showToast({ title: '书架已存在此书', duration: 1000, icon: 'none' });
                        }
                    }).catch(() => {
                        uni.hideLoading();
                    });
                } else {
                    uni.setStorageSync('navigateParams', {navigatePage: 'back'});
                    uni.navigateTo({ url: '/pages/login/Login'});
                }
            },
            startReading () {
                uni.setStorageSync('navigateParams', {novels: this.novels});
                uni.navigateTo({ url: '/pages/reading/SimpleRead'});
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-detail {

        .book-frame {
            width: 100%;
            height: calc(100% - (100rpx + env(safe-area-inset-bottom) / 2 + 1px));
            overflow-y: auto;

            .cu-card {
                width: 100%;

                .cu-item {
                    width: 100%;
                    height: 100%;

                    .image {
                        width: 100%;
                        height: 100%;
                        padding: 30rpx;
                        box-sizing: border-box;
                        margin: unset;

                        .image-size {
                            width: 165rpx;
                            height: 220rpx;
                            border-radius: 6rpx;
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
                padding: 20rpx;
                margin: 0 auto;

                .author-book {
                    width: 24%;
                    margin-right: 20rpx;
                    display: inline-block;
                    vertical-align: top;

                    .avatar-img {
                        display: inline-block;
                        height: 220rpx;
                        width: 165rpx;
                        border-radius: 6rpx;
                        position: relative;

                        .custom-image {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }

        .bottom-bar {
            bottom: 0;
            position: fixed;
            background-color: rgb(247, 246, 242);
            width: 100%;
            z-index: 10;
            border-top: 1px solid rgba(0, 0, 0, 0.33);
        }
    }

</style>
