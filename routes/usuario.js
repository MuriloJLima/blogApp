const express = require('express')
const router = express.Router()

const modelUs = require('../models/Usuario')

//importação do bcrypt para criptografar senha
const bcrypt = require('bcryptjs')

//importação do passport para validação de usuario
const passport = require('passport')

// rota que renderiza formulario de cadastro de usuario
router.get('/registro', (req, res)=>{
    res.render('usuarios/registro')
})

//rota com função de cadastrar usuario
router.post('/registro', (req, res)=>{

    //validação
    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha2 != req.body.senha){
        erros.push({texto: "As senhas são diferentes"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }
    else{

        //verificando se ja existe um usuario com determinado email
        const email = req.body.email

        modelUs.findOne({where: {email}}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', "usuario ja existe")
                res.redirect('/usuario/registro')
            }
            else{
                
                //capturando a senha e a "criptografando"
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);
               
                //adicionando usuario no banco de dados
                modelUs.create({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: hash,
                    //eAdmin: 1
                }).then(()=>{
                    req.flash("success_msg", 'usuario registrado')
                    res.redirect('/')
                })
            }
        })
    }

})

//rota que exibe formulario de login
router.get('/login', (req, res)=>{
    res.render("usuarios/login")
})

//rota com função de login, onde se é passado o tipo de altenticação (local), 
//juntamente com ações a serem feitas após altenticação
router.post('/login', (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req, res, next)
})

//logout
router.get('/logout', (req, res) => {
    req.logout(()=>{
        req.flash("success_msg", "deslogado")
        res.redirect('/')
      })
})

module.exports = router