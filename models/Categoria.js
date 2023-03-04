const Sequelize = require('sequelize')

//importando banco
const connection = require('../database/database')

//criando tabela
const modelCat = connection.define('categorias', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }

})

//modelCat.sync({force: true})

module.exports = modelCat