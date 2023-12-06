<template>
    <div class="content">
        <router-view> </router-view><!--é um componente do Vue Router que é usado para renderizar os componentes correspondentes às rotas definidas em seu aplicativo Em outras palavras, quando você navega para diferentes rotas, o componente associado a essa rota será renderizado dentro desse elemento-->
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