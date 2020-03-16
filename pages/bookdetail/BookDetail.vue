<template>
    <view class="book-detail full-screen">
        <view class="cu-card case no-card">
            <view class="cu-item shadow">
                <view class="image text-center">
                    <uni-image class="cu-avatar image-size" :url="novels.coverUrl"></uni-image>
                    <view class="margin-top-xs text-gray text-df">{{novels.title}}</view>
                    <view class="margin-top-xs">
                        <view class="cu-tag bg-red light sm round">{{novels.author}}</view>
                        <view class="cu-tag bg-green light sm round">{{convertCategory(novels.sex, novels.category)}}</view>
                        <view class="cu-tag bg-yellow light sm round">{{convertSex(novels.sex)}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import common from '../../util/common'
    import Category from '../../util/category'

    export default {
        name: 'BookDetail',
        data () {
            return {
                novels: null
            }
        },
        onLoad (option) {
            this.novels = JSON.parse(option.novels)
        },
        methods: {
            convertSex (sex) {
                return common.getSex(sex)
            },
            convertCategory (sex, category) {
                return Category[sex][category]
            },
        }
    }
</script>

<style lang="scss" scoped>
    .book-detail {
        .cu-card {
            width: 100%;
            height: 360upx;

            .cu-item {
                width: 100%;
                height: 100%;

                .image {
                    width: 100%;
                    height: 100%;
                    padding: 30upx 30upx 0 30upx;
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
    }

</style>