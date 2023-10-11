const queries = require('./queries')//Importando uma consulta

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {//Tanto salvar quanto alterar
        const article = { ...req.body }
        if(req.params.id) article.id = req.params.id // Verifica se existe um parâmetro id na URL. Se existir significa que a função deve atualizar um artigo existente. 
        //Se tem algum id na url
        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }
        //Atualizar
        if(article.id) { 
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else {//Inserir
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {//Remover com base no id
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
            return res.status(400).send(msg)
            }

            res.status(204).send()//Operação bem sucedida
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10
    const get = async (req, res) => {//Obter uma lista paginada de artigos
        const page = req.query.page || 1 //Verifica se o parametro page está presente na consulta da url se não assume valor 1 por padrão.

        const result = await app.db('articles').count('id').first()//Descobrir quantos artigos exitem no total
        const count = parseInt(result.count)
    
        app.db('articles')//Consulta principal para obter os artigos da página atual
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)//limit - define o limite de artigos , offset - define o deslocamento dos resultados. Calcula com base no número da página
            .then(articles => res.json({ data: articles, count, limit }))//Vai retornar os artigos,count e limit para facilitar no fornt end
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()//Convertendo o artigo que está salvo em binário para string
                return res.json(article) 
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id//id da categoria
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)//Executa uma consulta SQL para obter todas as categorias filhas (subcategorias) da categoria especificada
        const ids = categories.rows.map(c => c.id)//extrair os ids das categorias obtidas na etapa anterior

        app.db({a: 'articles', u: 'users'})//Extraindo de duas tabelas e aplicando apelidos
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)//offset a partir de qual resultado começar a busca. 
            .whereRaw('?? = ??', ['u.id', 'a.userId'])//Quando os dois ids dos elementos forem iguais
            .whereIn('categoryId', ids)//Filtra os resultados para incluir apenas os artigos cuja categoria está na lista de IDs de categorias e subcategorias obtidos anteriormente.
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}