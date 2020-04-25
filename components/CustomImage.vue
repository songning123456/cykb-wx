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
                imageSrc: '',
                errorImgList: [
                    '/css/nocover.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7004/7004s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3758/3758s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6818/6818s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6971/6971s.jpg',
                    'http://www.xbiquge.la/files/article/image/2/2699/2699s.jpg',
                    'http://www.xbiquge.la/files/article/image/2/2208/2208s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10512/10512s.jpg'
                ]
            };
        },
        watch: {
            url: {
                handler (newVal, oldVal) {
                    if (this.errorImgList.includes(newVal)) {
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