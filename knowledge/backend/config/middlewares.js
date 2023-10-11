//Configurar o Middleware do js
const bodyParser = require('body-parser')
//Interpretar o body
const cors = require('cors')
//É um mecanismo usado para adicionar cabeçalhos HTTP que informam ao navegadores para permitir que uma aplicação WEB seja executada em uma origem e acesse recursos de outra origem diferente.
//A partir de uma outra aplicação (uma origem diferente) poder acessar a api que será construida no backend
//Tem duas aplicações diferentes front e back

module.exports = app => {
    app.use(bodyParser.json())//Configura o middelware body-parse para interpretar o corpo das solicitações HTTP como json tornando os dados disponíveis na propriedade req.body dos objetos de solicitação no Express 
    //Interpretar o json que vai vim no corpo da requisição
    app.use(cors())
}