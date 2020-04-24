<template>
    <view class="book-manage full-size">
        <view class="cu-list full-size menu-avatar" v-if="relationList.length">
            <scroll-view scroll-y="true" style="height: 100%;">
                <view class="cu-item" v-for="(item,index) in relationList" :key="index">
                    <custom-image :url="item.coverUrl || 'http://'" class="image-size cu-avatar radius xl"></custom-image>
                    <view class="content">
                        <view class="text-black text-df">{{item.title || '未知书名'}}</view>
                        <view class="text-grey text-sm">{{item.author || '未知作者'}}</view>
                        <view class="text-gray text-xs text-cut">
                            <text class="margin-right-xs">{{convertDate(item.updateTime)}} ·</text>
                            <text>{{item.latestChapter || '未知章节'}}</text>
                        </view>
                    </view>
                    <view class="action delete-icon">
                        <radio class="round" :class="{'checked': deleteList.includes(item.novelsId)}" :checked="deleteList.includes(item.novelsId)"
                               :value="item.novelsId" @tap.stop="addDelBtn(item.novelsId)"></radio>
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="bottom-bar" v-if="relationList.length">
            <view class="btn-group cu-bar tabbar">
                <button class="cu-btn text-red line-red shadow" @tap="allOrZeroBtn">{{relationList.length === deleteList.length ? '取消全选' : '全选'}}</button>
                <button class="cu-btn bg-red shadow-blur" @tap="sureDeleteBtn">删除</button>
            </view>
        </view>
        <custom-empty v-if="!relationList.length"></custom-empty>
    </view>
</template>

<script>
    import CustomEmpty from '../../components/CustomEmpty';
    import request from '../../util/request';
    import convertDate from '../../util/convertDate';

    let currentDate = new Date();

    export default {
        name: 'BookManage',
        components: { CustomEmpty },
        data() {
            return {
                relationList: [],
                deleteList: []
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo;
            }
        },
        onLoad() {
            this.relationList = uni.getStorageSync('navigateParams').novelsList;
        },
        methods: {
            convertDate (updateTime) {
                return convertDate.convertZh(currentDate, updateTime);
            },
            addDelBtn(novelsId) {
                if (this.deleteList.includes(novelsId)) {
                    let index = this.deleteList.indexOf(novelsId);
                    this.deleteList.splice(index, 1);
                } else {
                    this.deleteList.push(novelsId);
                }
            },
            allOrZeroBtn() {
                if (this.deleteList.length === this.relationList.length) {
                    this.deleteList = [];
                } else {
                    this.relationList.forEach(item => {
                        if (!this.deleteList.includes(item.novelsId)) {
                            this.deleteList.push(item.novelsId);
                        }
                    })
                }
            },
            sureDeleteBtn() {
                if (this.deleteList.length) {
                    uni.showModal({
                        title: '提示',
                        content: '确定从书架中移除?',
                        success: res => {
                            if (res.confirm) {
                                let params = {
                                    condition: {
                                        usersId: this.userInfo.usersId,
                                        novelsIdList: this.deleteList
                                    }
                                };
                                uni.showLoading({ title: 'loading...', mask: true });
                                let tempList = this.deleteList;
                                request.post('/relation/deleteBookcase', params).then(data => {
                                    if (data.status === 200) {
                                        this.relationList = this.relationList.filter(item => !tempList.includes(item.novelsId));
                                    }
                                }).finally(() => {
                                    uni.hideLoading();
                                });
                            } else if (res.cancel) {
                                this.deleteList = [];
                            }
                        }});
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-manage {
        .cu-list {
            height: calc(100% - calc(100upx + env(safe-area-inset-bottom) / 2) - 1px);

            .cu-item {
                justify-content: unset;
                padding-right: unset;
                background: unset;
                position: relative;
                display: flex;
                height: 140rpx;
                align-items: center;
                transition: all .6s ease-in-out 0s;
                transform: translateX(0rpx);


                .image-size {
                    width: 105rpx;
                    position: absolute;

                }

                .cu-avatar {
                    float: left;
                    left: 15rpx;
                }

                .content {
                    float: left;
                    left: 135rpx;
                    width: calc(100% - 140rpx - 20rpx);
                    position: absolute;
                    line-height: 1.6em;

                    view:first-child {
                        font-size: 30rpx;
                        display: flex;
                        align-items: center;
                    }
                }

                .delete-icon {
                    position: absolute;
                    right: 2%;
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
