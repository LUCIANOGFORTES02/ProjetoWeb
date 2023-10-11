module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })
 
    const get = (req, res) => {//Obter a estatistica do aplicativo
        //Consulta no mongodb //{filtrar},{selecionar os atributos}, {ordem em que vai pegar as estatisticas}
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })
            .then(stat => {
            const defaultStat = {
                users: 0,
                categories: 0,
                articles: 0
            }
            res.json(stat || defaultStat) 
        })
        //Acessar o Stat e fazer para ele buscar la no mongodb as informações das   estatisticas
            // é usado para classificar os documentos em ordem decrescente com base no campo createAt, para que a estatística mais recente seja retornada primeiro.
        //Pegar de forma decrescente a ultima estatistica
        //Pega a estatistica e manda em formato json
 
    }

    return { Stat, get }
}