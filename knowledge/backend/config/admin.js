module.exports = middleware => {//Exporta uma função que recebe um middleware como argumento
    return (req, res, next) => {//Dentro do middleware há uma verificação condicional
        if(req.user.admin){//
            middleware(req,res,next)//Se a condição for válida o middleware chama o middleware original passado como argumento  
            //Isso permite que a solicitação continue a ser processada pelos middelwares subsequentes e, eventualmente, alcance a rota o recurso protegido 
        } else {
            res.status(401).send('Usuário não é administrador.')// Não tem permissão para acessar o recurso protegido.
        }
    }
}