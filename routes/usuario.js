const express = require('express')
const router = express.Router()

const modelUs = require('../models/Usuario')

// rota que renderiza formulario de cadastro de usuario
router.get('/registro', (req, res)=>{
    res.render('usuarios/registro')
})

//rota com função de cadastrar usuario
router.post('/registro', (req, res)=>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha2 != req.body,senha){
        erros.push({texto: "As senhas são diferentes"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }
    else{

    }

})

module.exports = router