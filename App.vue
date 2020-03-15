<script>
    export default {
        onLaunch: function () {
            uni.getStorage({
                key: 'userInfo',
                success: data => {
                    this.$store.commit('SET_USERINFO', JSON.parse(data.data))
                }
            })
            uni.getStorage({
                key: 'sortType',
                success: data => {
                    this.$store.commit('SET_SORTTYPE', data.data)
                }
            })
        },
        onShow: function () {
            console.log('App Show')
        },
        onHide: function () {
            console.log('App Hide')
        }
    }
</script>

<style>
    @import "colorui/main.css";
    @import "colorui/icon.css";
    @import "style/global.css";
    @import "style/base64.css";
</style>
