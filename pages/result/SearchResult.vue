<template>
    
</template>

<script>
    import Category from '../../util/category'
    export default {
        name: 'SearchResult',
        data () {
            return {
                params: null
            }
        },
        onLoad (option) {
            this.params = JSON.parse(option.params);
            uni.setNavigationBarTitle({
                title: Category[this.params.sex][this.params.category]
            })
        }
    }
</script>

<style scoped>

</style>