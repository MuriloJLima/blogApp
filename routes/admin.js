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
    res.render("admin/categorias")
})

//rota para adicionar categoria
router.get('/categorias/add', (req, res)=>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res)=>{
    //inserindo os dados passados no front para a tabela
    modelCat.create({
        nome: req.body.nome,
        slug: req.body.slug
    }).then(() =>{
        console.log('categoria salva')
    }).catch((erro) => {
        res.send(`HOUVE UM ERRO: ${erro}`)
    })
})

module.exports = router