<template>
    <view class="directory">
        <view class="cu-list menu">
            <view class="cu-item arrow" v-for="(item, index) in directoryList" :key="index" hover-class='hover-class-style' hover-stay-time='600' @tap="jumpChapterBtn">
                <view class="content">
                    <text :class="index === currentChapterIndex ? 'cuIcon-locationfill text-red' : 'cuIcon-location text-grey'"></text>
                    <text class="text-grey">{{item.chapter}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'Directory',
        data() {
            return {
                directoryList: [],
                currentChapterIndex: 0
            }
        },
        onLoad(option) {
            this.directoryList = JSON.parse(option.directory);
            this.currentChapterIndex = option.currentChapterIndex;
            debugger
        },
        methods: {
            jumpChapterBtn() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .directory {

    }

    .hover-class-style {
        opacity: 0.9;
        background: #f7f7f7 !important;
    }
</style>