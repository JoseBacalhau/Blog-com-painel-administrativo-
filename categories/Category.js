const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define("categories",{
    title:{
        type: Sequelize.STRING,
        allownull: false
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Category.sync({force: true});// após rodar o projeot uma vez, remover essa linha, pois vai ficar tentando a tabela toda vez que o programa rodar

module.exports = Category;