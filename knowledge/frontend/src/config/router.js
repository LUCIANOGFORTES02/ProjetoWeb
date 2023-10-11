import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticlesByCategory from '@/components/article/ArticlesByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'

Vue.use(VueRouter)
//Rota recebe um array de objetos cada rota representa um objeto
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
//Passar duas informações para criar o router uma são as proprias rotas e a outra o modo como o router deve ser configurado
const router = new VueRouter({
    mode: 'history',
    routes:routes
})
//Evento que será chamado sempre que for navegar de uma rota para outra
//Passa uma função callback e essa função recebe qual a tela que eu vou de qual tela que eu vou e o next se vai ou não continuar o processo de mudança de tela.

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router
