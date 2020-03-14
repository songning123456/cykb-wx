<template>
    <view class="classify cu-list grid col-3">
        <view class="cu-item" v-for="(item,index) in result" :key="index">
            <view class="cu-avatar lg radius" :class="'category-' +sex + '-' + item.category"></view>
            <view class="classify-margin text-black text-df">{{convertCategory(item.category)}}</view>
            <view class="text-gray text-sm">{{convertTotal(item.total)}}</view>
        </view>
    </view>
</template>

<script>
    import Category from "../../util/category";
    import request from '../../util/request';

    export default {
        name: "Classify",
        data() {
            return {
                sex: 'male',
                result: []
            }
        },
        onLoad() {
            uni.startPullDownRefresh();
        },
        onPullDownRefresh() {
            this.queryClassify();
        },
        methods: {
            convertCategory(arg0) {
                return Category[this.sex][arg0];
            },
            convertTotal(arg0) {
                let result = arg0;
                (result || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                result = '共' + result + '部';
                return result;
            },
            queryClassify() {
                let params = {
                    condition: {
                        sex: this.sex
                    }
                };
                request.post('/novels/classify', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data;
                    }
                }).finally(() => {
                    uni.hideNavigationBarLoading();
                    uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .classify {
        background: unset;
        .cu-avatar {
            margin: auto;
        }

        .classify-margin {
            margin: 3px 0;
        }
    }

</style>