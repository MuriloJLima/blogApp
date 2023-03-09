// criação de middleware para concrole de acesso de rotas, onde só admin poderá acessa-las

module.exports = {
    eAdmin: function(req, res, next){
        //verificando se quem está logado é admin
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }

        //caso n seja admin ou n esteja logado
        req.flash("error_msg", 'você precisa ser administrador')
        res.redirect('/')
    }
}