const express = require("express")

//método do express que permite a utilização de rotas em outro arquivo 
const router = express.Router()

//importando tabela
const modelCat = require('../models/Categoria')

//rota principal do admin
router.get('/', (req, res)=>{
    res.render("admin/index")
})

//rota para listar posts
router.get('/posts', (req, res)=>{
    res.send('página de posts')
})

//rota para listar categorias
router.get('/categorias', (req, res)=>{
    modelCat.findAll({order:[['id', 'DESC']]}).then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    })
})

//rota para adicionar categoria
router.get('/categorias/add', (req, res)=>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res)=>{

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

module.exports = router