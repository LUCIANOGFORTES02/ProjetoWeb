 <template>
  <header class="header">
    <!-- v-if renderizar ou não renderizar um elemento com base em uma condição -->
    <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
        <i class="fa fa-lg" :class="icon"></i>
     </a>
     <h1 class="title">
    <router-link to="/">{{ title }}</router-link>
    </h1>
    <UserDropdown v-if="!hideUserDropdown" />

  </header>
</template>

<script>
import UserDropdown from './UserDropdown'

export default {
    name: 'Header',
    components: { UserDropdown },
    props: {
        title: String,
        hideToggle: Boolean,
        hideUserDropdown: Boolean
    },
    //Por exemplo, você pode usar this.$store.state.isMenuVisible para acessar o valor de isMenuVisible ou this.$store.commit('toggleMenu', true) para chamar a mutação toggleMenu com o valor true para tornar o menu visível.
    computed: {
        icon() {
            return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down"
        }
    },
    methods: {
        toggleMenu() {
           this.$store.commit('toggleMenu')//Função que quer que seja chamada
        }
     }

}
</script>

<style>
    .header {
    grid-area: header;
    background: linear-gradient(to right, #1e469a, #49a7c1);
    
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 100;
    flex-grow: 1;
    text-align: center;
}

.title a {
    color: #FFF;
    text-decoration: none;
}

.title a:hover {
    color: #FFF;
    text-decoration: none;
}
header.header > a.toggle {/*  a regra header.header > a.toggle está selecionando elementos a com a classe toggle que são filhos diretos de elementos header com a classe header. */
    width: 60px;
    height: 100%;
    color: #fff;
    justify-self: flex-start;
    text-decoration: none;
 
    display: flex;

    justify-content: center;
    align-items: center;
}

header.header > a.toggle:hover {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
