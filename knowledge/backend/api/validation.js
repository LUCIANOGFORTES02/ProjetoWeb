module.exports = app => {
    function existsOrError(value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg 
        //trim( espaços vazios) remove os espaços vazios no inicio e no final 
    }
    
    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch(msg) {
            return
        }
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg) {
    if(valueA !== valueB) throw msg
    }

    return { existsOrError, notExistsOrError, equalsOrError }
    //O proprio consign vai ser responável por carregar essas funções
    
    //Validar se id é valido ou não
    //Validar password
    //Validar e-mail
}