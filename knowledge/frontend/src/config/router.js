import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticlesByCategory from '@/components/article/ArticlesByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'

Vue.use(VueRouter)//Registra o Vue Router no objeto Vue para que possa ser usado na aplicação
//Routes é um array que define as diferentes rotas da aplicação.
//name: Nome da rota que pose ser usada para referenciar a rota em outros lugares da aplicação.
//path: É o caminho da URL que aciona essa rota
//component: É o componente vue que será renderizado quando essa rota for acessada
//meta: É um objeto opcional que pode conter metadados sobre a rota. Nesse caso ele é usado para marcar rotas que exigem privilégios de administrador.

const routes = [{
    name: 'home',
    path: '/',
    component: Home
},{
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true }
},{
    name: 'articlesByCategory',
    path: '/categories/:id/articles',
    component: ArticlesByCategory
}, {
    name: 'articleById',
    path: '/articles/:id',
    component: ArticleById
},{
    name: 'auth',
    path: '/auth',
    component: Auth
}]
//Criando uma nova instancia do Vue Router
//Configura o modo de roteamento o hisotry mode permite navegar entre as páginas sem a necessidade de hashtags
//Recebe o array de rotas
//Com essa configuração, o Vue Router saberá como mapear as URLs da sua aplicação para os componentes Vue correspondentes, permitindo a navegação entre páginas de forma eficaz 
const router = new VueRouter({
    mode: 'history',
    routes:routes
})
//Evento que será chamado sempre que for navegar de uma rota para outra
//Passa uma função callback e essa função recebe qual a tela que eu vou de qual tela que eu vou e o next se vai ou não continuar o processo de mudança de tela.
//Ele é chamado sempre que a navegação ocorre, antes de a nova rota ser efetivamente carregada. Isso permite realização de verificações ou lógica antes de permitir ou negar acesso a rota
//Permite que tome decisões com base na rota de destino(to) na rota de origem(from) e na função (next)
router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)//Recupera dados de usuário do armazenamento local do navegador com base na chave userkey
//Verifica se a rota de destino possui um metadado chamado requiresAdmin usando o matched.some que verifica as rotas
//Se rota de destino requer e a propriedade admin for verdadeira permite a navegação para a rota de destino
    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router
