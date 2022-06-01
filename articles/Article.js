const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define("articles",{
    title:{
        type: Sequelize.STRING,
        allownull: false
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    }, body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // UMA CATEGORIA TEM MUITOS ARTIGOS 1 - P - M
Article.belongsTo(Category); // UM ARTIGO PERTENCE A UMA CATEGORIA 1 - P - 1

// Article.sync({force : true}); // após rodar o projeot uma vez, remover essa linha, pois vai ficar tentando a tabela toda vez que o programa rodar

module.exports = Article;