<template>
    <view class="directory">
        <view class="cu-list menu">
            <view class="cu-item arrow" :class="{'chosen-item': item.chaptersId === currentChapterId}"
                  v-for="(item, index) in directoryList" :key="index" @tap="jumpChapterBtn(item.chaptersId)">
                <view class="content text-cut">
                    <text :class="item.chaptersId === currentChapterId ? 'cuIcon-locationfill text-red' : 'cuIcon-location text-grey'"></text>
                    <text class="text-grey">{{item.chapter}}</text>
                </view>
            </view>
        </view>
        <back-top :direction="direction" @backTop="backTopBtn"></back-top>
    </view>
</template>

<script>
    import BackTop from '../../components/BackTop';
    export default {
        name: 'Directory',
        components: { BackTop },
        data () {
            return {
                directoryList: [],
                currentChapterId: '',
                tabCur: 'positive',
                halfHeight: 400,
                sortTabs: [
                    { key: 'positive', value: '正序' },
                    { key: 'reverse', value: '倒序' }
                ],
                direction: false
            };
        },
        onLoad () {
            let response = uni.getStorageSync('navigateParams');
            this.directoryList = response.directory;
            this.currentChapterId = response.currentChapterId;
            if (this.directoryList && this.directoryList.length && this.currentChapterId) {
                if (uni.getStorageSync('systemInfo') && uni.getStorageSync('systemInfo').windowHeight) {
                    this.halfHeight = uni.getStorageSync('systemInfo').windowHeight / 2;
                } else {
                    this.halfHeight = 400;
                    uni.getSystemInfo({
                        success: function (e) {
                            uni.setStorageSync('systemInfo', e);
                        }
                    });
                }
                this.scrollCenter();
            }
        },
        onPageScroll(object) {
            let allHeight = this.directoryList.length * 50;
            this.direction = object.scrollTop > allHeight / 2;
        },
        methods: {
            jumpChapterBtn (chaptersId) {
                if (this.currentChapterId !== chaptersId) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.$vm.queryNewChapter(chaptersId, 'insert');
                }
                uni.navigateBack({delta: 1});
            },
            backTopBtn(type) {
                if (type === 'top') {
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 1000
                    });
                } else {
                    uni.pageScrollTo({
                        scrollTop: this.directoryList.length * 50,
                        duration: 1000
                    });
                }
            },
            scrollCenter () {
                uni.createSelectorQuery().select('.directory').boundingClientRect(data => {
                    uni.createSelectorQuery().select('.chosen-item').boundingClientRect((res) => {
                        uni.pageScrollTo({
                            duration: 0,
                            scrollTop: res.top - data.top - this.halfHeight
                        });
                    }).exec();
                }).exec();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .directory {

        .cu-item {
            background: unset;
        }
    }
</style>
