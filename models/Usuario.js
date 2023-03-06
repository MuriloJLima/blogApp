const Sequelize = require('sequelize')
const sequelize = require('../database/database')

const connection = require('../database/database')

const modelUs = connection.define('usuarios', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    eAdmin:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//modelUs.sync({force: true})

module.exports = modelUs