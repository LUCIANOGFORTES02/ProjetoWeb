<template>
    <div class="loading">
        <img src="@/assets/loading.gif" alt="Loading">
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style>
    .loading {
        grid-area: content; /*Coloque-o na área "content" do layout de grid  */
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
