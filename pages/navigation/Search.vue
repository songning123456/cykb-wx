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
        <scroll-view scroll-x class="nav" v-if="!fastResult.length">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="{'text-red cur': item.key===tabCur}"
                      v-for="(item,index) in webTabs" :key="index" @tap="tabSelect" :data-web="item.key">
                    {{ item.value}}
                </view>
            </view>
        </scroll-view>
        <view class="cu-card case tip-card" v-if="!fastResult.length">
            <view class="cu-item shadow tip-item">
                <view class="cu-tag tips text-bold">Tips</view>
                <view class="text-grey search-item">
                    <text class="cuIcon-info text-red padding-right-xs"></text>
                    {{tipInfo[tabCur]}}
                    <text class="text-red setting-source padding-right-sm" v-if="tabCur === 'ecdemic'"
                          @tap="openSourceModal">设置
                    </text>
                </view>
            </view>
        </view>
        <view class="cu-modal bottom-modal" :class="{'show': sourceModal}" @tap="hideSourceModal"
              v-if="!fastResult.length">
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
        <view class="cu-card case no-card history-card" v-if="!fastResult.length">
            <view class="cu-bar solid-bottom">
                <view class="action">
                    <text class="cuIcon-time text-red"></text>
                    搜索历史
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
        <view class="cu-list menu text-left solid-top fast-result" v-if="fastResult.length">
            <view class="cu-item" v-for="(item, index) in fastResult" :key="index" @tap="fastSearchBtn(item)">
                <view class="content">
                    <text class="text-grey">{{item.title}}</text>
                    <text class="padding-left-xl text-gray">{{item.author}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'Search',
        data() {
            return {
                searchText: '',
                tabCur: 'native',
                searchHistory: [],
                fastResult: [],
                debounceTimeout: null,
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
                        checked: true,
                        hot: false
                    },
                    {
                        value: 'qidian',
                        name: '起点',
                        checked: false,
                        hot: false
                    },
                    {
                        value: 'chuangshi',
                        name: '创世',
                        checked: false,
                        hot: false
                    },
                    {
                        value: 'meiwen',
                        name: '美文',
                        checked: false,
                        hot: true
                    }
                ]
            };
        },
        onLoad() {
            let result = uni.getStorageSync('searchHistory');
            if (result > 0) {
                this.searchHistory = result.filter(item => item.searchType === this.tabCur);
            }
        },
        methods: {
            tabSelect(e) {
                this.tabCur = e.currentTarget.dataset.web;
                let result = uni.getStorageSync('searchHistory');
                if (result > 0) {
                    this.searchHistory = result.filter(item => item.searchType === this.tabCur);
                }
            },
            inputBtn(e) {
                if (this.tabCur === 'native') {
                    if (this.debounceTimeout) {
                        clearTimeout(this.debounceTimeout);
                        this.debounceTimeout = null;
                    }
                    this.debounceTimeout = setTimeout(() => {
                        this.fastQueryBooks(e.detail.value);
                    }, 1000);
                }
            },
            confirmBtn(e) {
               if (e.detail.value) {
                   let obj = {
                       searchType: this.tabCur,
                       authorOrTitle: e.detail.value
                   };
                   this.searchHistory.push(obj);
                   uni.setStorageSync('searchHistory', this.searchHistory);
                   if (this.tabCur === 'native') {
                       uni.$emit('SearchResult',{type: 'nativeSearch', authorOrTitle: e.detail.value});
                       uni.navigateTo({url: '/pages/result/SearchResult'});
                   } else if (this.tabCur === 'ecdemic') {
                       uni.$emit('SearchResult',{type: 'ecdemicSearch', authorOrTitle: e.detail.value, source: []});
                       uni.navigateTo({url: '/pages/result/SearchResult'});
                   }
               }
            },
            fastSearchBtn(novels) {
                let obj = {
                    searchType: 'native',
                    authorOrTitle: novels.title + '    ' + novels.author,
                    novels: novels
                };
                this.searchHistory.push(obj);
                uni.setStorageSync('searchHistory', this.searchHistory);
                uni.navigateTo({
                    url: '/pages/bookdetail/BookDetail?novels=' + novels
                })
            },
            fastQueryBooks(authorOrTitle) {
                if (authorOrTitle) {
                    let params = {
                        authorOrTitle: authorOrTitle
                    };
                    request.get('/novels/fastSearch', params).then(data => {
                        if (data.status === 200 && data.data.length > 0) {
                            this.fastResult = data.data;
                        }
                    });
                }
            },
            clearBtn() {
                this.searchText = '';
                this.fastResult = [];
            },
            hideSourceModal() {
                this.sourceModal = false;
            },
            openSourceModal() {
                this.sourceModal = true;
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
                        break;
                    }
                }
            },
            deleteSearchHistoryBtn() {
                this.searchHistory = [];
                uni.removeStorageSync('searchHistory');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search {
        .tip-card {
            .tip-item {
                background-color: unset;
                border: 1px solid #a6a6a6;

                .tips {
                    left: 48%;
                    right: unset;
                    color: #e54d42;
                    top: 15rpx;
                    background-color: unset;
                }

                .search-item {
                    justify-content: center;
                    text-align: center;
                    padding: 30rpx 0;

                    .setting-source {
                        position: absolute;
                        right: 36rpx;
                    }
                }
            }
        }

        .history-card {

            .solid-top::after {
                border-top: unset;
            }

            .cu-list {
                height: 300px;
                overflow-y: auto;

                .cu-item {
                    background-color: unset;
                    min-height: 70rpx;

                    &:after {
                        border-bottom: unset;
                    }
                }
            }
        }

        .fast-result {
            width: 100%;

            .cu-item {
                background-color: unset;
            }
        }
    }
</style>
