<template>
    <view class="classify">
        <view class="cu-list grid col-3">
            <view class="cu-item" v-for="(item,index) in result" :key="index" @tap="searchBtn(item.category)">
                <view class="cu-avatar lg radius" :class='"classify-" + convertName(item.category)'></view>
                <view class="classify-margin text-black text-df">{{item.category}}</view>
                <view class="text-gray text-sm">{{convertTotal(item.total)}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'Classify',
        data () {
            return {
                result: [],
                firstEnter: true
            };
        },
        onLoad () {
            this.queryClassifyCount();
        },
        onTabItemTap () {
            if (!this.firstEnter) {
                this.queryClassifyCount();
            }
        },
        methods: {
            convertTotal (arg0) {
                let result = arg0;
                (result || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                result = '共' + result + '部';
                return result;
            },
            convertName (category) {
                let result = '';
                if (category === '青春') {
                    result = 'qingchun';
                } else if (category === '古代') {
                    result = 'gudai';
                } else if (category === '幻想') {
                    result = 'huanxiang';
                } else if (category === '次元') {
                    result = 'ciyuan';
                } else if (category === '言情') {
                    result = 'yanqing';
                } else if (category === '修真') {
                    result = 'xiuzhen';
                } else if (category === '玄幻') {
                    result = 'xuanhuan';
                } else if (category === '穿越') {
                    result = 'chuanyue';
                } else if (category === '都市') {
                    result = 'dushi';
                } else if (category === '现代') {
                    result = 'xiandai';
                } else if (category === '科幻') {
                    result = 'kehuan';
                }else if (category === '网游') {
                    result = 'wangyou';
                }
                return result;
            },
            queryClassifyCount () {
                request.get('/novels/countByCategory', {}).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data;
                    }
                }).finally(() => {
                    if (this.firstEnter) {
                        this.firstEnter = false;
                    }
                });
            },
            searchBtn (category) {
                uni.setStorageSync('navigateParams', {
                    params: {
                        type: 'classify',
                        category: category
                    }
                });
                uni.navigateTo({ url: '/pages/result/SearchResult' });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .classify {
        background: unset;

        .cu-list {
            background: unset;

            .cu-avatar {
                margin: auto;
                width: 78rpx;
            }

            .classify-margin {
                margin: 3px 0;
            }
        }
    }

</style>
