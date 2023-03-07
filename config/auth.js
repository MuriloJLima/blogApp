
//importação do passport local para login urilizando dados locais
const localStrategy = require('passport-local').Strategy

const Sequelize = require("sequelize")

//importanto dependencia responsável pela criptografia
const bcrypt = require('bcryptjs')

//model de usuario
const modelUs = require('../models/Usuario')


module.exports = function(passport){

    //configurando passport

    //declarando campos a serem comparados
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done)=>{

        //buscando usuario que possua email a ser passado no formulario
        modelUs.findOne({where: {email: email}}).then((usuario)=>{

            //casso usuario n exista, exibir mensagem
            if(!usuario){
                return done(null, false, {message: "essa conta n existe"})
            }

            //caso usuario exista, comparar senha criptografada com senha passada no formulario
            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{

                //caso batam, retornar array com dados do usuario
                if(batem){
                    return done(null, usuario)
                }
                //caso não batam, retornar mensagem
                else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })

    }))

    //função que armazena usuario no navegador atraves do id
    passport.serializeUser((usuario, done)=>{

        done(null, usuario.id)

    })

    //verificando se usuario armazenado é o mesmo do banco comparando o id
    passport.deserializeUser((id, done)=>{
        modelUs.findOne({where: {id}}).then((usuario)=>{
            done(null, usuario)
        })
    })

}

