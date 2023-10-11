//Criar uma area de armazenamento que vai conseguir compartilhar entre os componentes
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({//Objeto state que contém as propriedades de estado do seu aplicativo
    state:{
        isMenuVisible: false,
        user: null
    },
    mutations:{
        toggleMenu(state, isVisible) {
            if(!state.user){
                state.isMenuVisible = false
                return

            }

            if(isVisible === undefined){
                state.isMenuVisible = !state.isMenuVisible
            }
            else{
                state.isMenuVisible = isVisible
            }

        },
        setUser(state, user){
            state.user = user
            if (user){
               axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
               state.isMenuVisible = true
            }else {
             delete axios.defaults.headers.common['Authorization'] 
               state.isMenuVisible = false
            }

        }
    }


})