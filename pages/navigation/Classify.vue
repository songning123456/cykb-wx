<template>
    <view class="classify">
        <scroll-view scroll-x class="nav">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="{'text-red cur': item.sex===tabCur}"
                      v-for="(item,index) in sexTabs" :key="index" @tap="tabSelect" :data-sex="item.sex">
                    {{convertSex(item.sex)}}
                </view>
            </view>
        </scroll-view>
        <view class="cu-list grid col-3">
            <view class="cu-item" v-for="(item,index) in result" :key="index">
                <view class="cu-avatar lg radius" :class="'category-' +tabCur + '-' + item.category"></view>
                <view class="classify-margin text-black text-df">{{convertCategory(item.category)}}</view>
                <view class="text-gray text-sm">{{convertTotal(item.total)}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import Category from '../../util/category'
    import request from '../../util/request'
    import common from '../../util/common'

    export default {
        name: 'Classify',
        data () {
            return {
                tabCur: 'male',
                sexTabs: [
                    {
                        icon: 'cuIcon-male text-blue',
                        sex: 'male'
                    },
                    {
                        icon: 'cuIcon-female text-pink',
                        sex: 'female'
                    }
                ],
                result: []
            }
        },
        onTabItemTap() {
            this.queryClassify();
        },
        methods: {
            tabSelect (e) {
                this.tabCur = e.currentTarget.dataset.sex
                this.queryClassify()
            },
            convertCategory (arg0) {
                return Category[this.tabCur][arg0]
            },
            convertSex (sex) {
                return common.getSex(sex)
            },
            convertTotal (arg0) {
                let result = arg0;
                (result || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
                result = '共' + result + '部'
                return result
            },
            queryClassify () {
                let params = {
                    condition: {
                        sex: this.tabCur
                    }
                }
                request.post('/novels/classify', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .classify {
        background: unset;

        .cu-list {
            background: unset;

            .cu-avatar {
                margin: auto;
            }

            .classify-margin {
                margin: 3px 0;
            }
        }
    }

</style>