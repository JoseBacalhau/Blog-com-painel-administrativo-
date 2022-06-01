const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth ,(req,res) =>{
    Article.findAll({
        include: [{model: Category}] // INCLUINDO NA MINHA BUSCA O MODEL Category, QUE É USADO PARA CRIAR AS CATEGORIAS
    }).then(articles => {
       res.render("admin/articles/index", {articles: articles})
    })
});

router.get("/admin/articles/new",adminAuth ,(req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories});
    });
});

router.post("/articles/save",adminAuth ,(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    if(title != undefined){}

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete",adminAuth ,(req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){// SE FOR NUMÉRICO
            Article.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            });
        }else{ // SE O ID NÃO FOR UM NÚMERO
            res.redirect("/admin/articles");
        }

    }else{ // SE O ID FOR NULO
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id",adminAuth , (req,res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit",{categories: categories, article: article});
            });   
        }else{
            res.redirect("/admin/article");
        }
    }).catch(erro =>{
        res.redirect("/admin/article");
    });
});

router.post("/articles/update",adminAuth , (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.boyd;
    var category = req.body.category;
    
    Article.update({title: title, body: body,categoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err =>{
        res.redirect("/")
    })
});

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1 ){
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * 4;
    }

    Article.findAndCountAll({// findAndCountAll VAI PESQUISAR TODOS OS ELEMENTOS NO BANCO DE DADOS E VAI RETORNAR TODOS OS ARTIGOS E A QUANTIDADE
        limit : 4,
        offset: offset,///SERVE PARA RETORNAR A PARTIR DO NUMERO DO OFF SET 
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
       
        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result ={
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories =>{
            res.render("admin/articles/page",{result: result, categories: categories })
        });
    })
});

module.exports = router;