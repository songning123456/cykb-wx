<template>
    <view class="comment full-screen">
        <form>
            <view class="cu-bar">
                <view class="action">
                    <text class="cuIcon-title text-red"></text>
                    请描述您的问题
                </view>
            </view>
            <view class="cu-form-group global-bg-color">
                    <textarea maxlength="-1" v-model="form.advice"
                              placeholder="您遇到了什么问题? 或有什么建议? 欢迎您反馈给我们? 谢谢您宝贵的意见!"></textarea>
            </view>
            <view class="cu-bar">
                <view class="action">
                    <text class="cuIcon-title text-red"></text>
                    您的联系方式
                </view>
            </view>
            <view class="cu-form-group global-bg-color">
                <input v-model="form.concat" placeholder="手机号/微信/QQ"/>
            </view>
        </form>
        <view class="bottom-bar cu-bar tabbar text-red text-xl text-shadow">
            <button class="cu-btn round bg-red" @tap="submitBtn">提交反馈</button>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Comment",
        data() {
            return {
                CustomBar: this.CustomBar,
                form: {
                    advice: '',
                    concat: ''
                }
            }
        },
        methods: {
            submitBtn() {
                if (!this.form.advice) {
                    uni.showToast({
                        title: '请提供建议',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                if (!this.form.concat) {
                    uni.showToast({
                        title: '请提供联系方式',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                // todo 发送请求
            }
        }
    }
</script>

<style lang="scss" scoped>
    .comment {
        .cu-form-group {
            margin: 1upx 30upx;
            background: unset;
            border: 0.08px solid #cccccc;
        }
        .bottom-bar {
            bottom: 0;
            position: fixed;
            width: 100%;
            border-top: 1px solid grey;
            justify-content: center;
        }
    }

</style>