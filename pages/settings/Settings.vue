<template>
    <view class="settings">
        <view class="cu-list menu text-left">
            <view class="cu-item" v-for="(item,index) in settings" :key="index" @tap="settingBtn(item.type)"
                  :class="{'arrow': item.icon === 'arrow'}">
                <view class="content">
                    <view>{{item.title}}</view>
                </view>
                <view class="action" v-if="item.icon === 'switch'">
                    <switch @change='nightModeBtn' :checked="isDark" :class="{'checked': isDark}"
                            class="red"></switch>
                </view>
                <view class="action" v-if="item.icon === 'text'">
                    <text class="text-gray">{{sortType}}</text>
                </view>
            </view>
        </view>
        <view class="cu-modal bottom-modal" :class="{'show': sortModal}" @tap="hideSortModal">
            <view class="cu-dialog" @tap.stop="">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">请选择排序方式</view>
                </view>
                <view class="cu-list menu">
                    <view class="cu-item no-bg-color" v-for="(item, index) in sorts" :key="index" @tap="sortBtn"
                          :data-sort="item.title">
                        <view class="content">
                            <text :class="[item.icon, sortType === item.title ? 'text-red' : 'text-grey']"></text>
                            <text :class="sortType === item.title ? 'text-red' : 'text-grey'">{{item.title}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        name: 'Settings',
        data () {
            return {
                sortModal: false,
                sorts: [
                    {
                        icon: 'cuIcon-read',
                        title: '最近阅读'
                    },
                    {
                        icon: 'cuIcon-time',
                        title: '更新时间'
                    },
                ]
            };
        },
        computed: {
            sortType () {
                return this.$store.state.sortType;
            },
            isDark () {
                return this.$store.state.isDark;
            },
            settings () {
                let icons = [{
                    icon: 'arrow',
                    title: '退出登录',
                    type: 'exit'
                }, {
                    icon: 'text',
                    title: '书架排序',
                    type: 'sort'
                }];
                let result = [
                    {
                        icon: 'arrow',
                        title: '书籍缓存',
                        type: 'storage'
                    },
                    {
                        icon: 'switch',
                        title: '夜间模式',
                        type: 'nightMode'
                    }
                ];
                if (this.$store.state.userInfo) {
                    result.unshift(...icons);
                }
                return result;
            }
        },
        methods: {
            settingBtn (type) {
                switch (type) {
                    case 'exit':
                        try {
                            this.$store.commit('SET_USERINFO', null);
                            this.$store.commit('SET_SORTTYPE', '最近阅读');
                            uni.showToast({ title: '注销成功', duration: 1000 });
                        } catch (e) {
                            uni.showToast({ image: '/static/image/error.png', title: '注销失败', duration: 1000 });
                        }
                        break;
                    case 'sort':
                        this.sortModal = true;
                        break;
                    case 'nightMode':
                        break;
                    case 'storage':
                        uni.navigateTo({ url: '/pages/bookcache/BookCache'});
                        break;
                }
            },
            sortBtn (e) {
                this.$store.commit('SET_SORTTYPE', e.currentTarget.dataset.sort);
                this.sortModal = false;
            },
            nightModeBtn (e) {
                this.$store.commit('SET_ISDARK', e.detail.value);
                let value = uni.getStorageSync('screenBrightness') || 0.5;
                if (this.isDark) {
                    value = value - 0.3;
                    if (value < 0) {
                        value = 0;
                    }
                }
                uni.setScreenBrightness({ value: value });
            },
            hideSortModal () {
                this.sortModal = false;
            },
        }
    };
</script>

<style lang="scss" scoped>
    .settings {
        width: 100%;
        height: 100%;

        switch::after, switch::before {
            content: unset;
        }

        .clear-modal {
            transform: unset;
            transition: unset;
        }
    }
</style>
