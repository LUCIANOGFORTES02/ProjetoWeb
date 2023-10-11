const config = require('../knexfile.js')
const knex = require('knex')(config)
//Instanciando o knex passando o arquivo de configuração para ele. Passando o kenexfile como parâmetro
// Isso cria uma instância do Knex.js com base nas configurações fornecidas no knexfile.js.

knex.migrate.latest([config])
//Vai executar a migração assim que executar o backend
//
module.exports = knex