//importando express
const express = require('express')

//importando handlebars
const handlebars = require('express-handlebars')

//importando rotas
const routerAdmin = require('./routes/admin')

//importando modulo path parautilização de arquivos estáticos
const path = require('path')

//constante app que contém o metodo express
const app = express()

//config express
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//config handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//config public 
app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.use('/admin', routerAdmin)

//porta
app.listen(3000, ()=>{
    console.log("servidor rodando em: localhost:3000")
})