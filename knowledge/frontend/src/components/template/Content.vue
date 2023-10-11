<template>
    <div class="content">
        <router-view> </router-view><!--é um componente do Vue Router que é usado para renderizar os componentes correspondentes às rotas definidas em seu aplicativo-->
    </div>
 </template>

<script>
export default {
    name: 'Content'
}
</script>
    
<style>
    .content{
        grid-area: content;
        background-color: #efefef;
        padding: 20px;   
        }
</style>