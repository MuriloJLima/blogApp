//importando express
const express = require('express')

//importando handlebars
const handlebars = require('express-handlebars')

//importando rotas
const routerAdmin = require('./routes/admin')
const routerUsuario = require('./routes/usuario')

//importando modulo path para utilização de arquivos estáticos
const path = require('path')

//importando seção para retorno de mensagens de validação
const session = require('express-session')

//modulo para tornar mensagem do middlewar temporária
const flash = require('connect-flash')

//importando passport para configurar sua seção
const passport = require('passport')

//imporando a função passport que valida o usuario
require('./config/auth')(passport)

//importação de models para serem urilizadas nas rotas
const modelPos = require('./models/Postagem')
const modelCat = require('./models/Categoria')


//constante app que contém o metodo express
const app = express()

//config sessão
app.use(session({
    secret: "node",
    resave: true,
    saveUninitialized: true
}))
//config sessão (passport)
app.use(passport.initialize())
app.use(passport.session())
//config flash
app.use(flash())

//config middlewar, criando variaveis globais a serem exibidas em detrminadas condições
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
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


//ROTAS A PARTIR DA RAÍZ - INÍCIO

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

//rota para listar categorias para o cliente
app.get('/categorias', (req, res)=>{
    modelCat.findAll().then((categorias)=>{
        res.render('categorias/index', {categorias: categorias})
    })
})

//rota para listar postagens refetende a uma categoria
app.get('/categorias/:slug', (req, res)=>{
    const slug = req.params.slug

    modelCat.findOne({where: {slug}}).then((categoria)=>{
        if(categoria){
            modelPos.findAll({categoria: categoria.id}).then((postagens)=>{
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
            })
        }
    })
})

//FIM DAS ROTAS A PARTIR DA RAÍZ

//rotas admin
app.use('/admin', routerAdmin)

//rotas usuario
app.use('/usuario', routerUsuario)

//porta
app.listen(3000, ()=>{
    console.log("servidor rodando em: localhost:3000")
})