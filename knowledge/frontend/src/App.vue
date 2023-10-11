<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Cod3r - Base de Conhecimento" 
		:hideToggle="!user"
		:hideUserDropdown="!user" >  </Header>
		<Menu v-if="user"></Menu>
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer></Footer>
	</div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"
import Header from "@/components/template/Header"
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading },
	computed: mapState(['isMenuVisible', 'user']),
	data: function() {
		return {
			validatingToken: true
		}	
	},
	methods: {
		async validateToken() {//Processo de validação do token
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })
				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if (res.data) {
				this.$store.commit('setUser', userData)

				if(this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}
		
			this.validatingToken = false
		}
	},
		created() {
			this.validateToken()
		}
	}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}
	/*Define os estilos para o elemento com a id app  */
	#app { 
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	
		height: 100vh;
		/*Define o uso do sistema de layout de grade CSS para o elemento "#app". Isso permite que você organize o conteúdo em linhas e colunas, criando um layout flexível.*/
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		/*Define a área do grid para cada parte do seu aplicativo, como "header", "menu", "content" e "footer". Isso é usado para organizar os componentes na estrutura de grid que você definiu. */
		grid-template-areas: 
		"header header"
		"menu content"
		"menu footer";
	}

	#app.hide-menu {
		grid-template-areas: 
		"header header"
		"content content"
		"footer footer";
	}
</style>