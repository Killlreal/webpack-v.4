<template>
    <section id="main">
        <div class="block-vue">
            <h1>hiiiiiiiiiiiiii {{message}}</h1>
        </div>
    </section>
</template>

<script>
export default {
    data(){
        return{
            message: null
        }
    },
    created(){
        this.message = 'hellow vue'
    }
}
</script>

<style lang="scss" scoped>
    p{
        color: red;
    }
</style>