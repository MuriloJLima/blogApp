const express = require("express")

//método do express que permite a utilização de rotas em outro arquivo 
const router = express.Router()

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

module.exports = router