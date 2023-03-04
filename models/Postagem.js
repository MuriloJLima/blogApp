const Sequelize = require('sequelize')

//importando banco
const connection = require('../database/database')

//importando tabela de categoria
const categoria = require('./Categoria')

//criando tabela
const modelPos = connection.define('postagens', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    conteudo:{
        type: Sequelize.STRING,
        allowNull: false
    }

})

//relacionamento 1 para 1, em que a tabela de categoria pertence a tabela de postagem
modelPos.belongsTo(categoria, {
    constraint: true,
    foreignKey: 'idCat'
})

//modelPos.sync({force: true})

module.exports = modelPos