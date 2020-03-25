<template>
    <view class="search">
        <view class="cu-bar bg-white search">
            <view class="search-form radius">
                <text class="cuIcon-search"></text>
                <input @input="inputBtn" @confirm="confirmBtn" v-model='searchText' :adjust-position="false" type="text"
                       placeholder="搜索作者、小说"
                       confirm-type="search"/>
            </view>
            <view class="action" v-if="searchText.length" @tap="clearBtn">
                <text class="cuIcon-close"></text>
                <text>取消</text>
            </view>
        </view>
        <scroll-view scroll-x class="nav">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="{'text-red cur': item.key===tabCur}"
                      v-for="(item,index) in webTabs" :key="index" @tap="tabSelect" :data-web="item.key">
                    {{ item.value}}
                </view>
            </view>
        </scroll-view>
        <view class="cu-card case tip-card">
            <view class="cu-item shadow">
                <view class="image">
                    <image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
                           mode="widthFix"></image>
                    <view class="cu-tag bg-red tips">Tips</view>
                </view>
                <view class="cu-list menu-avatar">
                    <view class="cu-item text-grey search-item">
                        <text class="cuIcon-info text-red padding-right-xs"></text>
                        {{tipInfo[tabCur]}}
                        <text class="text-red setting-source" v-if="tabCur === 'ecdemic'" @tap="openSourceModal">设置
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <view class="cu-modal bottom-modal" :class="{'show': sourceModal}" @tap="hideSourceModal">
            <view class="cu-dialog" @tap.stop="">
                <view class="grid col-3 padding-sm">
                    <view v-for="(item,index) in sourceBox" class="padding-xs" :key="index">
                        <button class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'"
                                @tap="ChooseCheckbox"
                                :data-value="item.value"> {{item.name}}
                            <view class="cu-tag sm round" :class="item.checked?'bg-white text-orange':'bg-orange'"
                                  v-if="item.hot">HOT
                            </view>
                        </button>
                    </view>
                </view>
            </view>
        </view>
        <view class="cu-card case no-card history-card">
            <view class="cu-bar solid-bottom">
                <view class="action">
                    <text class="cuIcon-time text-red"></text> 搜索历史
                </view>
                <view class="action">
                    <text class="cuIcon-delete" @tap="deleteSearchHistoryBtn"></text>
                </view>
            </view>
            <view class="cu-list menu text-left solid-top">
                <view class="cu-item" v-for="(item, index) in searchHistory" :key="index">
                    <view class="content">
                        <text class="text-grey">{{item}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'Search',
        data () {
            return {
                searchText: '',
                tabCur: 'native',
                searchHistory: [],
                webTabs: [
                    {
                        key: 'native',
                        value: '本站搜索'
                    },
                    {
                        key: 'ecdemic',
                        value: '全网搜索'
                    }
                ],
                tipInfo: {
                    'native': '搜索已录入在本站的书籍，搜索更快',
                    'ecdemic': '海量全网搜索(自定义资源路径)'
                },
                sourceModal: false,
                sourceBox: [
                    {
                        value: 'biquge',
                        name: '笔趣阁',
                        checked: false,
                        hot: false,
                    },
                    {
                        value: 'qidian',
                        name: '起点',
                        checked: false,
                        hot: false,
                    },
                    {
                        value: 'chuangshi',
                        name: '创世',
                        checked: false,
                        hot: false,
                    },
                    {
                        value: 'meiwen',
                        name: '美文',
                        checked: false,
                        hot: true,
                    }
                ]
            }
        },
        onLoad() {
            this.searchHistory = uni.getStorageSync('searchHistory') || [];
        },
        methods: {
            tabSelect (e) {
                this.tabCur = e.currentTarget.dataset.web
            },
            inputBtn (e) {
                console.error(1, e.detail.value)
            },
            confirmBtn (e) {
                this.searchHistory.push(e.detail.value);
                uni.setStorageSync('searchHistory', this.searchHistory);
                console.error(2, e.detail.value)
            },
            clearBtn () {
                this.searchText = ''
            },
            hideSourceModal () {
                this.sourceModal = false
            },
            openSourceModal () {
                this.sourceModal = true
            },
            ChooseCheckbox(e) {
                let items = this.sourceBox;
                let current = e.currentTarget.dataset.value;
                for (let i = 0, lenI = items.length; i < lenI; ++i) {
                    if (items[i].value === current) {
                        if (items[i].checked && this.sourceBox.filter(item => item.checked).length === 1) {
                            return;
                        }
                        items[i].checked = !items[i].checked;
                        break
                    }
                }
            },
            deleteSearchHistoryBtn() {
                this.searchHistory = [];
                uni.removeStorageSync('searchHistory');
            },
        }
    }
</script>

<style lang="scss" scoped>
    .search {
        .tip-card {
            .tips {
                left: 0;
                right: unset;
            }
            .search-item {
                justify-content: center;
                padding-right: unset;

                .setting-source {
                    position: absolute;
                    right: 36rpx;
                }
            }
        }

        .history-card {
            .cu-item {
                background-color: unset;
                min-height: 70rpx;
                &:after {
                    border-bottom: unset;
                }
            }
        }
    }
</style>