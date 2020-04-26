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
                    'http://www.xbiquge.la/files/article/image/10/10512/10512s.jpg',
                    'http://img.qushuba.com/files/article/image/26/26457/26457s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8172/8172s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3764/3764s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7928/7928s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8194/8194s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8021/8021s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7053/7053s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6941/6941s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3717/3717s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8226/8226s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7020/7020s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8331/8331s.jpg',
                    'http://www.xbiquge.la/files/article/image/2/2145/2145s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3726/3726s.jpg',
                    'http://www.xbiquge.la/files/article/image/1/1852/1852s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10358/10358s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3592/3592s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6940/6940s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10353/10353s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6820/6820s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8212/8212s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8072/8072s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7054/7054s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8341/8341s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8241/8241s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10244/10244s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8232/8232s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10305/10305s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8102/8102s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3730/3730s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3730/3730s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6950/6950s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3580/3580s.jpg',
                    'http://www.xbiquge.la/files/article/image/9/9884/9884s.jpg',
                    'http://www.xbiquge.la/files/article/image/9/9491/9491s.jpg',
                    'http://www.xbiquge.la/files/article/image/5/5104/5104s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8197/8197s.jpg',
                    'http://www.xbiquge.la/files/article/image/2/2211/2211s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3591/3591s.jpg',
                    'http://www.xbiquge.la/files/article/image/8/8020/8020s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7891/7891s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6819/6819s.jpg',
                    'http://www.xbiquge.la/files/article/image/10/10421/10421s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6938/6938s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6970/6970s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6960/6960s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3738/3738s.jpg',
                    'http://www.xbiquge.la/files/article/image/3/3689/3689s.jpg',
                    'http://www.xbiquge.la/files/article/image/6/6951/6951s.jpg',
                    'http://www.xbiquge.la/files/article/image/7/7877/7877s.jpg'
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