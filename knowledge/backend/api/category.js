module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {//Criar ou atualizar uma categoria
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }

        if(req.params.id) category.id = req.params.id//Verifica se há um parâmetro id na URL da solicitação. Se houver ele sobrescreve. 

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch(msg) {
            return res.status(400).send(msg) //bad Request - Solicitação feita pelo cliente ao servidor possui problema ou é inválida de alguma forma.
        }

        if(category.id){//Upadate da categoria se o id da categoria já existir
            app.db('categories')
            .update(category)
            .where({ id: category.id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {//Inserindo a categoria
            app.db('categories')
            .insert(category)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err)) 
        }
    }

    const remove = async (req, res) => {//
    try{
        existsOrError(req.params.id,)//Verifica se existe
        
        const subcategory = await app.db('categories')
        .where({ parentId: req.params.id })//Descobrir se a categoria possui subcategorias
        notExistsOrError(subcategory, 'Categoria possui subcategorias')//Se existir vai da erro

        const articles = await app.db('articles')
        .where({ categoryId: req.params.id})//Tenta recuperar artigos associados à categoria
        notExistsOrError(articles,"Categoria possui artigos")//Se tiver vai dar erro
        //Agora sera excluida
        const rowsDeleted = await app.db('categories')
        .where({id:req.params.id}).del()//Deletando a requisição
        existsOrError(rowsDeleted,'Categoria não foi encontrada')//Se pelo menos uma linha foi deletada

        res.status(204).send()//No Content indicando que a operação de exclusão foi bem sucedida

    }catch(msg) {
        res.status(400).send(msg)
    }
    }
    //Uma representação do caminho hierárquico de cada categoria
    const withPath = categories => { //Recebe várias categorias
        const getParent = (categories, parentId) => {//Pegar categoria pai de uma categoria com base no parentid
            const parent = categories.filter(parent => parent.id === parentId)//Tenta encontrar uma categoria na lista de categorias cujo id corresponde ao parentId
            return parent.length ? parent[0] : null //Retornado uma unica categoria pai ou null
        }
        //A função começa a mapear cada categoria da lista  'categories' para criar uma nova lista chamada 'categoriesWithPath'
        const categoriesWithPath = categories.map(category => {
            let path = category.name//Categoria atual
            let parent = getParent(categories, category.parentId)//Tenta encontrar a categoria pai

            while(parent){//Enquanto houver uma categoria pai
                path = `${parent.name} > ${path}` // Atualiza o caminho
                parent = getParent(categories, parent.parentId)// Atualiza a variável parent para a categoria pai da categoria pai atual
            }
            
            return { ...category,path}//Retornar um objeto com a categoria atual, mas a propriedade path

    })

        categoriesWithPath.sort((a, b) => {//Ordena o array com base em uma finção que usa a propriedade path
            if(a.path < b.path) return -1 // Obejto a antes do objeto b
            if(a.path > b.path) return 1 // Objeto b deve ir antes do objeto a
            return 0 
        })
        return categoriesWithPath // Retorna a lista de categorias com o caminho hierárquico 
    }

    const get = (req,res)=>{//Retornar as categorias
        app.db('categories')
        .then(categories=> res.json(withPath(categories)))
        .catch(err => res.status(500).send(err))
    }

    const getById =(req,res)=>{//Retorna pelo id
         app.db('categories')
        .where({id:req.params.id})
        .first()
        .then(category=> res.jsong(category))
        .catch(err => res.status(500).send(err))
    }

    const toTree=(categories,tree)=>{//Transformar um array de categorias em uma esturtura de árvore
        if(!tree) tree = categories.filter(c => !c.parentId)//Se tree não existir inicializa a tree como um array contendo todas as categorias que não tem parentId
        tree = tree.map(parentNode=>{//Os nós pais das árvores
            //Função para descobrir os filhos
            const isChild = node => node.parentId == parentNode.id//Verificar se o nó é filho do nó pai atual
            parentNode.children = toTree (categories,categories.filter(isChild))//Recebe o array de categorias e filtra apenas as cateogorias que são filhas do nó pai
            //Será deifnida como um novo array contendo as categorias que são filhas diretas desse nó
            return parentNode//cria um novo array de nos pai(com suas respectivas árvores de filhos) e o retorna
        })
        return tree //Retorna a estrutura de árvores completa

    }

    const getTree=(req,res)=>{
        app.db('categories')
        .then(categories => res.json(toTree(categories)))
        .catch(err => res.status(500).send(err))
    }


    return{save,remove,get,getById, getTree}
}