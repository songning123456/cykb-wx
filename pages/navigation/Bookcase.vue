<template>
    <view class="book-case" :class="{'full-size': !userInfo}">
        <view v-if="userInfo" class="cu-list full-size menu-avatar">
            <view class="cu-item"
                  v-for="(item,index) in result" :key="index" @tap="startReading(item)">
                <custom-image :url="item.coverUrl || 'http://'" class="image-size cu-avatar radius xl"></custom-image>
                <view class="content">
                    <view class="text-black text-df">{{item.title || '未知书名'}}</view>
                    <view class="text-grey text-sm">{{item.author || '未知作者'}}</view>
                    <view class="text-gray text-xs text-cut">
                        <text class="margin-right-xs">{{convertDate(item.updateTime)}} ·</text>
                        <text>{{item.latestChapter || '未知章节'}}</text>
                    </view>
                </view>
            </view>
            <view class="cu-item">
                <view class="cu-avatar radius lg add-image"></view>
                <view class="content">
                    <view class="text-black text-bold" @tap="navChange">书架管理</view>
                </view>
            </view>
        </view>
        <inset-login v-else></inset-login>
    </view>
</template>

<script>
    import InsetLogin from '../../components/InsetLogin';
    import request from '../../util/request';
    import convertDate from '../../util/convertDate';

    let currentDate = new Date();

    export default {
        name: 'Bookcase',
        components: { InsetLogin },
        data () {
            return {
                result: []
            };
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo;
            },
            sortType () {
                return this.$store.state.sortType;
            }
        },
        onShow() {
            if (this.userInfo) {
                uni.startPullDownRefresh();
            }
        },
        watch: {
            // 主要用于 一开始未登录，后来登录；重新加载数据
            userInfo (newVal, oldVal) {
                if (newVal && !oldVal) {
                    uni.startPullDownRefresh();
                }
            },
            sortType (newVal, oldVal) {
                this.queryBookcase();
            }
        },
        onPullDownRefresh () {
            if (!!this.userInfo) {
                this.queryBookcase();
            } else {
                uni.stopPullDownRefresh();//得到数据后停止下拉刷新
            }
        },
        methods: {
            startReading (item) {
                uni.setStorageSync('navigateParams', {novels: item});
                uni.navigateTo({ url: '/pages/reading/SimpleRead' });
            },
            navChange () {
                if (this.result.length) {
                    uni.setStorageSync('navigateParams', {novelsList: this.result});
                    uni.navigateTo({ url: '/pages/bookmanage/BookManage'});
                }
            },
            convertDate (updateTime) {
                return convertDate.convertZh(currentDate, updateTime);
            },
            queryBookcase () {
                if (!(this.userInfo && this.userInfo.usersId)) {
                    return;
                }
                let params = {
                    condition: {
                        usersId: this.userInfo.usersId,
                        sortType: this.sortType
                    }
                };
                request.post('/relation/bookcase', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data;
                    } else if (data.status === 202 && data.message === '书架暂无您的书籍'){
                        this.result = [];
                    }
                }).finally(() => {
                    uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-case {

        .cu-list {
            overflow-y: auto;

            .cu-item {
                justify-content: unset;
                padding-right: unset;
                background: unset;

                .image-size {
                    width: 105rpx;
                }

                .cu-avatar {
                    float: left;
                    left: 15rpx;
                }

                .content {
                    float: left;
                    left: 135rpx;
                    width: calc(100% - 140rpx - 20rpx);
                }
            }
        }
    }
</style>
