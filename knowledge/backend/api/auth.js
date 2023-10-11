const { authSecret } = require('../.env')//Importa a chave secreta
const jwt = require('jwt-simple')//Biblioteca que permite codificar e decodificar tokens JWT.
const bcrypt = require('bcrypt-nodejs')//Para lidar com criptografia de senhas

module.exports = app => {
    const signin = async (req, res) => {//Autenticar um usuário com base nas credenciais fornecidas (email e senha)
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()
        if (!user) return res.status(400).send('Usuário não encontrado!')


        const isMatch = bcrypt.compareSync(req.body.password,user.password)//Compara a senha fornecida no corpo da solicitação com a senha armazenada no banco de dados para o usuário encontrado.
        if(!isMatch) return res.status(401).send("Email ou senha inválidos")//O acesso não está autorizado

        const now = Math.floor(Date.now() / 1000)
        
        const payload={//Gera um token com as informações do usuário e uma data de expiração
            id:user.id,
            name:user.name,
            email:user.email,
            admin: user.admin,
            iat:now,
            exp: now + (60 * 60 * 24 * 3)//Data de expiração
        }
        //Retorna um objeto json que inclui payload (informações do usuário) e o token JWT gerado
        res.json({//Qualquer requisição que for feita é necessario um cabeçalho chamado authorization 
            ...payload,
            token: jwt.encode(payload, authSecret)//Gerar o token com o authSecret para gerar apartir de um segredo
        })//Isso permite que o cliente(frontend) armazene o token e o use para a autenticação em futuras solicitações.
        


    }

    const validateToken = async (req, res) => {//Validar se um token é válido ou expirou
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)//Fazer a decodificação do token com o authSecret 
                if(new Date(token.exp * 1000) > new Date()) {//Teste de expiração
                    return res.send(true)//Pode renovar o token retorna true se o token for válido 
                }

            }
        } catch(e) {
            // problema com o token
        }
        res.send(false)//Retorna false se o token tiver expirado


    }

    return { signin, validateToken }
}//Essas duas funções juntas fornecem autenticação para o aplicativo, permitindo que os usuários se autentiquem com suas credenciais e usem tokens JWT para acessar recursos protegidos.