<template>
    <view class="inset-login login-image full-size">
        <button class="cu-btn block bg-red margin-tb-sm lg" open-type="getUserInfo" @getuserinfo="loginWx"
                withCredentials="true">
            一键登录
        </button>
    </view>
</template>

<script>
    import request from '../util/request';

    export default {
        name: "InsetLogin",
        methods: {
            loginWx() {
                uni.login({
                    success: response2 => {
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: response3 => {
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
                                        this.$emit('userInfo', data.data[0]);
                                    } else {
                                        console.error('获取用户信息失败1');
                                        uni.showToast({
                                            title: '获取用户信息失败',
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                    }
                                }).catch(e => {
                                    uni.hideLoading();
                                    console.error('获取用户信息失败2');
                                    uni.showToast({
                                        title: '获取用户信息失败',
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                })
                            },
                            fail: reject3 => {
                                // doNothing...
                            }
                        });
                    },
                    fail: response2 => {
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
    .inset-login {
        width: 100%;
        height: 100%;
        .cu-btn {
            width: 400upx;
            position: absolute;
            top: 85%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);
        }
    }

</style>
