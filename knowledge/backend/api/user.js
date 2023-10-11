const bcrypt = require('bcrypt-nodejs')//Criptografar senhas

module.exports = app => {    
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation


    const encryptPassword = password => {//Obter senha criptografada
        const salt = bcrypt.genSaltSync(10)//Gerar um 'sal' aleatório. um valor aleatorio que é combinado com a senha. 10 é o tempo necessário para gerar o sal
        return bcrypt.hashSync(password, salt)//Criar o hash da senha combinada com o sal
    }


    const save = async (req, res) => {// Inserir um novo usuário e alterar um já inserido
        const user = { ...req.body }// Cria um objeto user a partir dos dados fornecidos da requisição
        //Verificar se no parametro da url tem o id
        if(req.params.id) user.id = req.params.id //Para atualizar o usuário
        
        if(!req.originalUrl.startsWith('/users')) user.admin = false //Se a url não estarta com /users admin será falso
        if(!req.user || !req.user.admin) user.admin = false //Se não tiver ninguem logado ou se o usuario logado não for admin o campo  admin será falso


        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()//Verifica se o usuário já existe com base no email fornecido

            if(!user.id) {  // Se o user.id for null indica que é a inserção de um novo usuário portanto ocorre a verificação se o usuário já foi cadastado

                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            } 
        } catch(msg) {
            return res.status(400).send(msg)//Erro com o cliente
        }


        user.password = encryptPassword(user.password)
        delete user.confirmPassword //Não será salvo no banco de dados

        if(user.id) {//Atualizar o usuário no banco de dados
            app.db('users')
            .update(user)
            .where({ id: user.id })
            .whereNull('deletedAt')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))//Erro do lado do servidor
        } else {//Inserir o usuário no banco de dados
            app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }


    const get = (req, res) => {//Pegar os usuário que não foi excluido de forma soft delete (ta no banco mais foi excluido da aplicação)
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .whereNull('deletedAt')
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }


    const getById = (req, res) =>{//Pegar um usuário pelo id
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .where({ id: req.params.id })
        .whereNull('deletedAt')//Somente onde o campo deleteAt é nulo
        .first()
        .then(user => res.json(user))
        .catch(err => res.status(500).send(err))
    }
    //O ususário não foi excluido do banco, mas no sistema não irá aparecer.
    const remove = async (req, res) => {
        try {
            //Verifica se o ususário possui artigos se possuir tem que desassociar eles
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')//Lança uma msg de erro informando que o usuário possui artigos
            //Atualiza a nova coluna
            const rowsUpdated = await app.db('users')// Se não possuir artigos atualiza o campo deleteAt com a data atual, marcando-o como removido
                .update({deletedAt: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove } ;//Em ves de chamar o module.exportes e exportar alguma coisa , está sendo esportando uma função e a função quando chamada irá retornar tudo aquilo que quer que seja exportado
}