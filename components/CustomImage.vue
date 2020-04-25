<template>
    <image @load="imageLoad" @error="imageErr" :src="imageSrc" :mode="mode" :lazy-load="true"></image>
</template>

<script>
    export default {
        name: 'UniImage',
        props: {
            mode: {
                type: String,
                default: 'scaleToFill'
            },
            defaultImage: {
                type: String,
                default: '../static/image/avatar.jpg'
            },
            url: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                imageSrc: ''
            };
        },
        watch: {
            url: {
                handler (newVal, oldVal) {
                    if (newVal === '/css/nocover.jpg') {
                        // 处理147小说图片特殊情况
                        this.imageSrc = this.defaultImage;
                    } else if (newVal === 'http://www.xbiquge.la/files/article/image/7/7004/7004s.jpg') {
                        // 处理笔趣阁小说图片特殊情况
                        this.imageSrc = this.defaultImage;
                    } else {
                        this.imageSrc = newVal;
                    }
                },
                immediate: true
            }
        },
        methods: {
            imageLoad () {},
            imageErr () {
                this.url && (this.imageSrc = this.defaultImage);
                this.$forceUpdate();
            }
        }
    };
</script>

<style scoped>
    image {
        width: 100%;
        height: 100%;
        background-color: white;
    }

</style>