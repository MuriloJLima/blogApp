const Sequelize = require("sequelize")

//conexão com o banco de dados
const sequelize = new Sequelize('blogapp', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    query:{raw:true}
})

module.exports = sequelize;