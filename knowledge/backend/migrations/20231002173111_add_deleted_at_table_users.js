
exports.up = function (knex, Promise) {//Resposável por definir o que deve ser feito quando a migração é aplicada ao banco de dados
    return knex.schema.alterTable('users', table => {//Método para modificar a tabela
        table.timestamp('deletedAt')//A coluna irá armazenar informações do tipo data e hora
    })
};
//comando knex migrate:rollback -- reverte amigração mais recente
//comando kenx migrate:rollback --to <migration-name> -- reverter uma migração especifica por nome

exports.down = function (knex, Promise) {//Usada para definir o que deve se feito quando a migração é revertida 
    return knex.schema.alterTable('users', table => {
        table.dropColumn('deletedAt')
    })
};
