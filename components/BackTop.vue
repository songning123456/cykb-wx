<template>
    <view>
        <view class="back-top icon" @tap.stop="tapIcon" :class="[{'direction': !direction}, showBtn ? 'show' : 'hidden']">
            <image :src="imageUrl" mode="aspectFill"></image>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'BackTop',
        data () {
            return {
                imageUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NTExNTM0MTM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM4NjUiIHdpZHRoPSIzNSIgaGVpZ2h0PSIzNSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkyNS43IDMzNy4yYy0yMi42LTUzLjUtNTUtMTAxLjUtOTYuMi0xNDIuNy00MS4yLTQxLjItODkuMi03My42LTE0Mi43LTk2LjJDNjMxLjQgNzQuOSA1NzIuNiA2MyA1MTIgNjNTMzkyLjYgNzQuOSAzMzcuMiA5OC4zYy01My41IDIyLjYtMTAxLjUgNTUtMTQyLjcgOTYuMi00MS4yIDQxLjItNzMuNiA4OS4yLTk2LjIgMTQyLjdDNzQuOSAzOTIuNiA2MyA0NTEuNCA2MyA1MTJzMTEuOSAxMTkuNCAzNS4zIDE3NC44YzIyLjYgNTMuNSA1NSAxMDEuNSA5Ni4yIDE0Mi43IDQxLjIgNDEuMiA4OS4yIDczLjYgMTQyLjcgOTYuMkMzOTIuNiA5NDkuMSA0NTEuNCA5NjEgNTEyIDk2MXMxMTkuNC0xMS45IDE3NC44LTM1LjNjNTMuNS0yMi42IDEwMS41LTU1IDE0Mi43LTk2LjJzNzMuNi04OS4yIDk2LjItMTQyLjdDOTQ5LjEgNjMxLjQgOTYxIDU3Mi42IDk2MSA1MTJzLTExLjktMTE5LjQtMzUuMy0xNzQuOHpNNjcyLjQgNTE0LjljLTQuOSA0LjktMTEuMyA3LjMtMTcuNyA3LjNzLTEyLjgtMi40LTE3LjctNy4zbC0xMDMtMTAzdjMzMS41YzAgMTMuOC0xMS4yIDI1LTI1IDI1cy0yNS0xMS4yLTI1LTI1di0zMjVMMzg2LjkgNTE1Yy05LjggOS43LTI1LjYgOS43LTM1LjQtMC4xLTkuNy05LjgtOS43LTI1LjYgMC4xLTM1LjRsMTQzLjMtMTQyLjJjOS44LTkuNyAyNS42LTkuNyAzNS4zIDAuMWwxNDIuMiAxNDIuMmM5LjggOS43IDkuOCAyNS41IDAgMzUuM3ogbS0wLjktMjA5LjNoLTMxOWMtMTMuOCAwLTI1LTExLjItMjUtMjVzMTEuMi0yNSAyNS0yNWgzMTljMTMuOCAwIDI1IDExLjIgMjUgMjVzLTExLjIgMjUtMjUgMjV6IiBmaWxsPSIjZTU0ZDQyIiBwLWlkPSIzODY2Ij48L3BhdGg+PC9zdmc+'
            };
        },
        props: {
            direction: {
                type: Boolean,
                default: true
            },
            showBtn: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            tapIcon (e) {
                this.$emit('backTop');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .back-top {
        position: fixed;
        z-index: 200;
        right: 6%;
        bottom: 6%;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
        border: none;

        image {
            width: unset;
            height: unset;
            display: unset;
        }

        &.direction {
            transform: rotate(180deg);
        }

        &.show {
            opacity: 1;
            pointer-events: auto;
            transition: opacity .5s;
        }

        &.hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity .5s;
        }
    }
</style>
