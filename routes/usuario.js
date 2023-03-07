const express = require('express')
const router = express.Router()

const modelUs = require('../models/Usuario')

const bcrypt = require('bcryptjs')

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
                    senha: hash
                }).then(()=>{
                    req.flash("success_msg", 'usuario registrado')
                    res.redirect('/')
                })
            }
        })
    }

})

module.exports = router