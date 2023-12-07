const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')

app.db = db 
app.mongoose = mongoose

const port = process.env.PORT || 3000
//consign vai ser responsável por passar essa aplicação (app) como parâmetro para esse arquivo e e dentro desse arquivo consegue injetar os middleware dentro da minha aplicação 
consign() 
.include('./config/passport.js')
    //Arquivos de config está botando individualmente
.then('./config/middlewares.js')
.then('./api/validation.js')
.then('./api')
.then('./schedule')
.then('./config/routes.js')
.into(app)
//Injetar em cada uma das dependências que ele vai carregar ele vai injetar como parâmetro o app que acabou de criar  


app.listen(port, () => {
    console.log(`Backend executando...${port}`)
})
