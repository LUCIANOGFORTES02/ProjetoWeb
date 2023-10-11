<template>
    <aside class="menu" v-show="isMenuVisible">
        <div class="menu-filter">
            <i class="fa fa-search fa-lg"></i>
            <input type="text" placeholder="Digite para filtrar..."
            v-model="treeFilter" class="filter-field">


        </div>
        <Tree :data="treeData" :options="treeOptions"
            :filter="treeFilter" ref="tree" /> 
    </aside>
</template>

<script>
import { mapState } from 'vuex'//Mapear um atributo da store dentro do componente
import Tree from 'liquor-tree'
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name:'Menu',
    components: {Tree},
    computed: mapState(['isMenuVisible']),
    data: function(){
        return{
            treeFilter:'',
            treeData: this.getTreeData(),
            treeOptions:{
                propertyNames:{'text':'name'},
                filter: { emptyText: 'Categoria não encontrada' }
            }
        }

    },
    methods: {
        getTreeData(){
            const url = `${baseApiUrl}/categories/tree`
            return axios.get(url).then(res => res.data)//retornando a promise
        },
        //Forma de fazer uma navegação programática
       onNodeSelect(node) {
            this.$router.push({//Adicionar uma nova rota no router
                name: 'articlesByCategory',//nome da rota
                params: { id : node.id}//id da categoria
            })

            if(this.$mq === 'xs' || this.$mq === 'sm') {
                this.$store.commit('toggleMenu', false)
            }

        }
    },
    mounted(){
        //refs é a forma que tem de acessar algum elemento que está dentro do meu template.
        this.$refs.tree.$on('node:selected', this.onNodeSelect)//Para cada nó da arvóre será selecionado o evento node:selected, ou seja seleção de um nó e altomaticamente será chamada a função onNodeSelected

    }

}
</script>

<style>
.menu{
    grid-area: menu;
    background: linear-gradient(to right,#232526,#414345);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}
.menu a, 
.menu a:hover{
    color: #FFF;
    text-decoration: none;
}
.menu .tree-node.selected > .tree-content, .menu .tree-node .tree-content:hover{
    background-color: rgba(255, 255, 255, 0.2);
}
.tree-arrow.has-child {
    filter: brightness(2)
}

.menu .menu-filter{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
}

.menu .menu-filter i{
    color: #AAA;
    margin-right: 10px;
}

.menu input{
    color: #CCC;
    font-size: 1.3rem;
    border: 0;
    outline: 0;
    width: 100%;
    background: transparent;
}
.tree-filter-empty{
    color: #CCC;
    font-size: 1.3rem;
    margin-left: 10px;



}

</style>