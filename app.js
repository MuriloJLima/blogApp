//importando express
const express = require('express')

//importando handlebars
const handlebars = require('express-handlebars')

//importando rotas
const routerAdmin = require('./routes/admin')

//importando modulo path para utilização de arquivos estáticos
const path = require('path')

//importando seção para retorno de mensagens de validação
const session = require('express-session')

//modulo para tornar mensagem do middlewar temporária
const flash = require('connect-flash')

const modelPos = require('./models/Postagem')

//constante app que contém o metodo express
const app = express()

//config sessão
app.use(session({
    secret: "node",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//config middlewar
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//config express
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//config handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//config public 
app.use(express.static(path.join(__dirname, 'public')))

//rota home
app.get('/', (req, res)=>{
    modelPos.findAll().then((postagens)=>{
        res.render('index', {postagens: postagens})
    })
})

//rota que lista postagem selecionada na home através do parametro slug
app.get('/postagem/:slug', (req, res)=>{

    const slug = req.params.slug

    modelPos.findOne({where: {slug}}).then((postagem)=>{
        if(postagem){
            // const post = {
            //     titulo: postagem.titulo,
            //     data: postagem.data,
            //     conteudo: postagem.conteudo
            // }
            res.render('postagem/index', {postagem: postagem})
        }
        else{
            req.flash("error_msg", 'esta postagem não existe')
            res.redirect('/')
        }
    })
})

//rotas
app.use('/admin', routerAdmin)

//porta
app.listen(3000, ()=>{
    console.log("servidor rodando em: localhost:3000")
})