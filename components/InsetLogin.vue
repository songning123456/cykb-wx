<template>
    <view class="inset-login login-image full-size">
        <button class="cu-btn block bg-red margin-tb-sm lg" open-type="getUserInfo" @getuserinfo="loginWxBtn" withCredentials="true">
            一键登录
        </button>
    </view>
</template>

<script>
    import request from '../util/request';

    export default {
        name: 'InsetLogin',
        methods: {
            loginWxBtn () {
                uni.login({
                    success: response2 => {
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: response3 => {
                                uni.showLoading({
                                    title: '登陆中',
                                    mask: true
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
                                        this.$store.commit('SET_USERINFO', data.data[0]);
                                    } else {
                                        uni.showToast({
                                            title: '获取用户信息失败',
                                            duration: 1000,
                                            image: '/static/image/error.png'
                                        });
                                    }
                                }).catch(e => {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '获取用户信息失败',
                                        duration: 1000,
                                        image: '/static/image/error.png'
                                    });
                                });
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
                            image: '/static/image/error.png'
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .inset-login {
        width: 100%;
        height: 100%;

        .cu-btn {
            width: 400rpx;
            position: absolute;
            top: 85%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);
        }
    }

</style>
