<template>
    <view class="book-manage full-size">
        <view class="cu-list full-size menu-avatar">
            <view class="cu-item" v-for="(item,index) in result" :key="index">
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
        </view>
    </view>
</template>

<script>
    import convertDate from '../../util/convertDate';

    let currentDate = new Date();

    export default {
        name: 'BookManage',
        data() {
            return {
                result: []
            }
        },
        onLoad() {
            this.result = uni.getStorageSync('navigateParams').novelsList;
        },
        methods: {
            convertDate (updateTime) {
                return convertDate.convertZh(currentDate, updateTime);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-manage {
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
