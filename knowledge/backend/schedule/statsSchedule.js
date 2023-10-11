const schedule = require('node-schedule')//Nos permite agendar tarefas
//O código atualiza estatísticas e armazena essas estastísticas em um banco de dados MongoDB
module.exports = app =>{
    //realizar de 1 em 1 minuto
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat
        //Recupera o último registro de estatística no banco de dados MongoDB, ordenado por data de criação em ordem decrescente
        const lastStat = await Stat.findOne({}, {},
            { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles
        
        if(changeUsers || changeCategories || changeArticles) {//Se houve alguma alteração no objeto stat
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'))//Vai persistir no mongodb
        }
    })
}