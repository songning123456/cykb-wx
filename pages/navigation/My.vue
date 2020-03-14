<template>
    <view class="my full-screen">
        <view class="cu-card case no-card">
            <view class="cu-item shadow">
                <view class="image text-center">
                    <view class="cu-avatar round xl" :style='avatarClazz'>
                        <view v-if='userInfo.gender' class="cu-tag badge" :class="sexClazz"></view>
                        <button v-if="!userInfo" class="cu-btn round line-gray sm" open-type="getUserInfo"
                                @getuserinfo="wxBtn" withCredentials="true">
                            点击登陆
                        </button>
                    </view>
                    <view class="margin-top-xs text-gray">{{userInfo.nickName ? userInfo.nickName : '未知'}}</view>
                </view>
            </view>
        </view>
        <view class="cu-list menu">
            <view class="cu-item arrow"
                  v-for="(item, index) in displayInfo" :key="index" @tap="tapBtn(item.icon)">
                <view class="content">
                    <text class="text-black" :class="'cuIcon-' + item.icon"></text>
                    <text class="text-black">{{item.title}}</text>
                </view>
            </view>
        </view>
        <view class="cu-modal" :class="shareModal?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                </view>
                <view class="padding-xl">
                    (温馨提示：链接复制成功，请分享给您的好友)发送给好友的复制内容是: {{clipboard}}
                </view>
                <view class="cu-bar bg-white">
                    <view class="action margin-0 flex-sub text-blue solid-left" @tap="hideShareModal">取消</view>
                    <view class="action margin-0 flex-sub  text-red solid-left" @tap="hideShareModal(false)">复制链接</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: "My",
        data() {
            return {
                userInfo: this.$store.state.userInfo,
                shareModal: false,
                clipboard: '我正在用畅游看吧读免费百万小说。下载地址：http://www.xxx.com',
                displayInfo: [
                    {
                        icon: 'appreciate',
                        title: '请给我好评'
                    },
                    {
                        icon: 'share',
                        title: '分享给朋友'
                    },
                    {
                        icon: 'comment',
                        title: '意见反馈'
                    },
                    {
                        icon: 'settings',
                        title: '设置'
                    }
                ]
            }
        },
        computed: {
            sexClazz() {
                let clazz = '';
                if (this.userInfo.gender) {
                    if (this.userInfo.gender === 1) {
                        clazz = 'cuIcon-male bg-blue';
                    } else if (this.userInfo.gender === 2) {
                        clazz = 'cuIcon-female bg-pink';
                    }
                }
                return clazz;
            },
            avatarClazz() {
                let clazz = 'background-image:url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTgzODk0NzEwNDc0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4MjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMC45MTkzODkgNjMuOTUwNDk4YzI0Ny4zNDUzODggMCA0NDcuODYwMTkxIDIwMC41MTQ4MDMgNDQ3Ljg2MDE5IDQ0Ny44NjEyMTQgMCAyNDcuMzQ4NDU4LTIwMC41MTQ4MDMgNDQ3Ljg2MTIxNC00NDcuODYwMTkgNDQ3Ljg2MTIxNC0yNDcuMzQ4NDU4IDAtNDQ3Ljg2MzI2MS0yMDAuNTEzNzgtNDQ3Ljg2MzI2MS00NDcuODYxMjE0IDAtMjQ3LjM0NTM4OCAyMDAuNTE0ODAzLTQ0Ny44NjEyMTQgNDQ3Ljg2MzI2MS00NDcuODYxMjE0eiIgZmlsbD0iI0VFRUVFRSIgcC1pZD0iMjgyMSI+PC9wYXRoPjxwYXRoIGQ9Ik01MTAuOTE5Mzg5IDUxNS45NjUzMTJjNzkuMTUwNjg4IDAgMTQzLjMxNDAzMy02NC40MjUzMTIgMTQzLjMxNDAzMy0xNDMuODk5MzY1IDAtNzkuNDczMDI5LTY0LjE2MzM0NS0xNDMuODk4MzQxLTE0My4zMTQwMzMtMTQzLjg5ODM0MS03OS4xNTE3MTEgMC0xNDMuMzE3MTAzIDY0LjQyNTMxMi0xNDMuMzE3MTAzIDE0My44OTgzNDEtMC4wMDEwMjMgNzkuNDc1MDc2IDY0LjE2NDM2OSAxNDMuODk5MzY0IDE0My4zMTcxMDMgMTQzLjg5OTM2NXogbTIyMS4wNjA3NDQgMTc1Ljg2NzQ0OWwxLjA2ODMzMi0wLjQwMjE1OWMtMzUuMDMyODg4LTg4LjY4Mjc4NS0xMjEuMjgwMjA0LTE1MS4zOTkxNzUtMjIyLjEyOTA3Ni0xNTEuMzk5MTc1LTk5LjU5NzM2OSAwLTE4NC45NDQxNzYgNjEuMTczMjQ1LTIyMC43OTM2NjIgMTQ4LjExMjMxNmwwLjQ5NDI1NyAwLjIwMDU2OGEzNS4xMjE5MTUgMzUuMTIxOTE1IDAgMCAwLTIuNTY1NDI5IDEzLjIwMDY1YzAgMTkuNDc1NTY0IDE1Ljc5ODgyNCAzNS4yNjYyMDIgMzUuMjkxNzg0IDM1LjI2NjIwMSAxNC43NTgxMjIgMCAyNy4zOTI4ODQtOS4wNTYyNiAzMi42NjE4ODctMjEuOTA2OTM5bDAuNTc1MDk5IDAuMjMzMzE0YzI1LjIyNDQ5OC02MC41MDcwNzIgODQuODIyODc0LTEwMy4wMjg1MTUgMTU0LjMzNjA2NC0xMDMuMDI4NTE1IDcwLjEwOTc3OCAwIDEzMC4xMjk3NTYgNDMuMjU5MjQ2IDE1NC45NzI1NiAxMDQuNTk2MjJsMC4yNTI3NTctMC4wOTUxNjhjNS42NTQ3OSAxMS45Mzk5MzcgMTcuODE1NzYxIDIwLjIwMTA4OCAzMS45MTI4MjcgMjAuMjAxMDg4IDE5LjQ4OTg5IDAgMzUuMjg5NzM4LTE1Ljc4OTYxNSAzNS4yODk3MzgtMzUuMjY2MjAxYTM1LjI4MTU1MSAzNS4yODE1NTEgMCAwIDAtMS4zNjcxMzgtOS43MTIyeiIgZmlsbD0iI0NDQ0NDQyIgcC1pZD0iMjgyMiI+PC9wYXRoPjwvc3ZnPg==\');';
                if (this.userInfo.avatar) {
                    clazz = `background-image:url(${this.userInfo.avatar})`;
                }
                return clazz;
            }
        },
        methods: {
            tapBtn(type) {
                switch (type) {
                    case 'appreciate':
                        break;
                    case 'share':
                        this.shareModal = true;
                        break;
                    case 'comment':
                        uni.navigateTo({
                            url: '/pages/comment/Comment'
                        });
                        break;
                    case 'settings':
                        break;
                }
            },
            hideShareModal(type) {
                this.shareModal = false;
                if (!type) {
                    // 复制到剪切板
                    uni.setClipboardData({
                        data: this.clipboard,
                        success: function () {
                            console.log('success');
                        }
                    });
                }
            },
            wxBtn() {
                uni.login({
                    success: response2 => {
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: response3 => {
                                debugger;
                                uni.showLoading({
                                    title: '登陆中'
                                });
                                let params = {
                                    condition: {
                                        code: response2.code,
                                        avatar: response3.userInfo.avatarUrl,
                                        nickName: response3.userInfo.nickName,
                                        gender: response3.userInfo.gender
                                    }
                                };
                                request.post('/users/weixin/getUsersInfo', params).then(data => {
                                    uni.hideLoading();
                                    if (data.status === 200) {
                                        let result = JSON.stringify(data.data[0]);
                                        uni.setStorage({
                                            key: 'userInfo',
                                            data: result
                                        });
                                        this.$store.commit('SET_USERINFO', data.data[0]);
                                        this.userInfo = data.data[0];
                                    } else {
                                        uni.showToast({
                                            title: '获取用户信息失败',
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                    }
                                }).catch(e => {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '获取用户信息失败',
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                })
                            },
                            fail: reject3 => {
                                debugger;
                                // doNothing...
                            }
                        });
                    },
                    fail: response2 => {
                        debugger;
                        uni.showToast({
                            title: '登录失败',
                            duration: 1000,
                            icon: 'none'
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my {
        .cu-modal {
            transform: scale(1);
        }
    }
</style>