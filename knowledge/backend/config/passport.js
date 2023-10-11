//Configura o middleware de autenticação Passport.js para usar a estratégia JSON WEB TOKEN (JWT)
const { authSecret } = require('../.env')//Importa a chave secreta
//Chave secreta para assinar e verificar os tokens
const passport = require('passport') //Middleware de autenticação para o Node.js
const passportJwt = require('passport-jwt')//Uma estrategia JWT para o Passport
const { Strategy, ExtractJwt } = passportJwt//Desestrutura o objeto passportJwt para obter as classes Strategy e ExtactJwt que são usadas para configurar a estratégia JWT do Passport.js

//O token é formado por uma chave, o payload e uma chave de verificação
module.exports = app => {

    const params = {//Parâmaetros para a estratégia
        secretOrKey: authSecret,//Chave secreta usada para verificar a assinatura dos tokens JWT 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()//Especifica como extrair o token JWT das requisições HTTP.Neste caso o token é extraído do cabeçalho Authorization da requisição como um token no formato Bearer 
    }

    //Configurando a estratégia Jwt Passport para verificar e autenticar o token JWT
    const strategy = new Strategy(params, (payload, done) => {//Cria uma instância da estratégia JWT do Passport com os parâmetros params. A função callback é executada quando um token for verificado com sucesso.
        app.db('users')//Consulta o banco de dados para encontrar o usuário com base no id contido no payload do token JWT
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))//Se o usuário for encontrado, a função callback é chamada com dois argumentos. null indica que não houve erro e um objeto se nenhum usuário for encontrado a função de callback done é chamada com false indicando que a validação falhou. Se o usuário for encontrado, ele é adicionado ao payload do token e a validação considerada bem sucedida.
            .catch(err => done(err, false))
            //Deu erro e validação foi falsa
    })

    passport.use(strategy)//Isso registra a estratégia JWT com o Passport.js permitindo que ela seja usada para autenticar solicitações

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
        //Retorna um objeto com um método 'authenticate' que pode ser usado como middleware para filtrar solicitações com base na autenticação JWT. Quando esse middleware é aplicado a uma rota, ele verifica se o token JWT é valido e, se for, permite que a rota seja acessada.
    }
}//Esse código configura o Passport para autenticar solicitações com base em tokens JWT, usando a chave secreta authSecret e a estrategia JWT.
//Isso permite que vc restrinja o acesso a rotas protegidas em seu aplicativo, garantindo que apenas usuários autenticados com tokens JWT válidos possam acessá-los. 