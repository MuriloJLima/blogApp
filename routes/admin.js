const express = require("express")

//método do express que permite a utilização de rotas em outro arquivo 
const router = express.Router()

//importando tabela de categorias
const modelCat = require('../models/Categoria')

//importando tabelas de post
const modelPos = require('../models/Postagem')

//importando middleware para controle de acesso, onde será declarado como parametro nas rotas
const {eAdmin} = require('../helpers/eAdmin')

//rota principal do admin
router.get('/', eAdmin, (req, res)=>{
    res.render("admin/index")
})

//rota para listar posts
router.get('/posts', eAdmin, (req, res)=>{
    res.send('página de posts')
})

//rota para listar categorias
router.get('/categorias', eAdmin, (req, res)=>{
    modelCat.findAll({order:[['id', 'DESC']]}).then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    })
})

//rota para adicionar categoria
router.get('/categorias/add', eAdmin, (req, res)=>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', eAdmin, (req, res)=>{

    //validação das categorias
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug inválido"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }
    else{
         //inserindo os dados passados no front para a tabela
        modelCat.create({
            nome: req.body.nome,
            slug: req.body.slug
        }).then(() =>{
            req.flash("success_msg", "categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((erro) => {
            req.flash("error_msg", "erro ao cadastrar categoria")
            res.redirect("/admin")
        })
    }
   
})

//rota para alterar categoria front
router.get('/categorias/edit/:id', eAdmin, (req, res)=>{

    //variável que captura o id
    const id = req.params.id

    //listagem da categoria a ser editada, através de valores da tabela passados ao id
    //que por sua vez, são convertidos em array para leitura no front
    modelCat.findOne({atributes: ['nome', 'slug'], where:{id}}).then((categorias)=>{ 
        res.render("admin/editCategoria", {categorias: categorias})
    }).catch((error)=>{
        req.flash('error_msg', "essa categoria n existe")
        res.redirect('/admin/categorias')
    })
    
})

//rota com função de alterar categoria
router.post('/categorias/edit', eAdmin, (req, res)=>{

    //variáveis que capturarão os valores a serem editados, juntamente com id
    const id = req.body.id
    const nome = req.body.nome
    const slug = req.body.slug

    //editando valores capturados nas variáveis através do id
    modelCat.update(
        {nome, slug},
        {where:{id}}
    ).then(()=>{
        req.flash("success_msg", "categoria alterada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((error)=>{
        req.flash('error_msg', "essa categoria n existe")
        res.redirect('/admin/categorias')
    })
    
})

//rota com função de deletar categoria com base no id passado no corpo
router.post("/categorias/deletar", eAdmin, (req, res)=>{

    const id = req.body.id

    modelCat.destroy({where:{id}}).then(()=>{
        req.flash("success_msg", "categoria deletada")
        res.redirect('/admin/categorias')
    }).catch((error)=>{
        req.flash("error_msg", "erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})


// rotas de postagens

//rota de listagem de postagem
router.get('/postagens', eAdmin, (req, res)=>{

    modelPos.findAll({order:[['id', 'DESC']]}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens})
        
        // const id ={
        //     id: postagens.idCat
        // }

        // var id = req.body.id
        // console.log(id)

        // modelCat.findAll({atributes: ['nome'], where:{id}}).then((categorias)=>{ 
        //     res.render("admin/postagens", {categorias: categorias, postagens: postagens})
        // })

        // if(postagens){
        //     const id = {
        //         id: postagens.id
        //     }

        //     modelCat.findAll({atributes: ['nome'], where:{id}}).then((categorias)=>{ 
                
        //         if(categorias){
        //             const params = {
        //                 titulo: postagens.titulo,
        //                 descricao: postagens.descricao,
        //                 nome: categorias.nome
        //             }
        //             res.render("admin/postagens", params)
        //         }
        //     })
        // }

    })
})

//rota que carrega o formulário para adicionar postagem
router.get('/postagens/add', eAdmin, (req, res)=>{
    
    modelCat.findAll().then((categorias) =>{
        res.render("admin/addPostagem", {categorias: categorias})
    })
})

//rota com a função de adicionar postagem
router.post('/postagens/nova', eAdmin, (req, res)=>{

    //validação
    var erros = []

    if(req.body.categoria == 0){
        erros.push({texto: 'Categoria inváida'})
    }

    if(erros.length > 0){
        res.render('admin/addPostagem', {erros: erros})
    }
    else{
        //adicionando valores com base nos campos do front
        modelPos.create({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            idCat: req.body.categoria
        }).then(() =>{
            req.flash("success_msg", "postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((error) => {
            req.flash("error_msg", "erro ao cadastrar postagem")
            res.redirect("/admin/postagens")
        })
    }
})

//rota que carrega os valores das postagens a serem editadas
router.get('/postagens/edit/:id', eAdmin, (req, res)=>{

    //variável que captura o id
    const id = req.params.id

    //listagem da categoria a ser editada, através de valores da tabela passados ao id
    //que por sua vez, são convertidos em array para leitura no front
    modelPos.findOne({atributes: [
        'titulo', 'slug', 'descricao', 'conteudo', 'idCat'], where:{id}}).then((postagens)=>{ 
        // res.render("admin/editPostagem", {postagens: postagens})
        modelCat.findAll().then((categorias)=>{
            res.render("admin/editPostagem", {postagens: postagens, categorias: categorias})
        })


    }).catch((error)=>{
        req.flash('error_msg', "essa postagem n existe")
        res.redirect('/admin/postagens')
    })
    
})

//rota com a função de editar postagem
router.post("/postagem/edit", eAdmin, (req, res)=>{
    //variáveis que capturarão os valores a serem editados, juntamente com id
    const id = req.body.id
    const titulo = req.body.titulo
    const slug = req.body.slug
    const descricao = req.body.descricao
    const conteudo = req.body.conteudo
    const idCat = req.body.categoria

    //editando valores capturados nas variáveis através do id
    modelPos.update(
        {titulo, slug, descricao, conteudo, idCat},
        {where:{id}}
    ).then(()=>{
        req.flash("success_msg", "postagem alterada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((error)=>{
        req.flash('error_msg', "essa postagem n existe")
        res.redirect('/admin/postagens')
    })
})

//rota com função de deletar post com base no id passado como parâmetro
router.get('/postagem/deletar/:id', eAdmin, (req, res)=>{

    const id = req.params.id
    
    modelPos.destroy({where: {id}}).then(()=>{
        req.flash('success_msg', "postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    })
})


module.exports = router