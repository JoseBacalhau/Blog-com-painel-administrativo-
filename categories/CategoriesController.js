const express = require("express");
const router = express.Router();
const Category = require("./Category"); 
const slugify = require("slugify");

//     res.send("Rota de categorias");
// });

// router.get("/admin/categories/new",(req,res)=>{
//     res.send("Rota para criar uma nova categoria");
// });

router.get("/admin/categories/new",(req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save",(req,res)=>{ // o recomendado é sempre usar o método post ao invés do método get quando se trata de um formulário
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title) // serva para tranformar um titulo por exemplo em um url : desenvolvimento web --> desenvolvimento-web
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("admin/categories/new");
    }
});

router.get("/admin/categories",(req,res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){// SE FOR NUMÉRICO
            Category.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories");
            });
        }else{ // SE O ID NÃO FOR UM NÚMERO
            res.redirect("/admin/categories");
        }

    }else{ // SE O ID FOR NULO
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req,res) => {
    var id = req.params.id;
   
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => { // findBuPk É UMA FORMA MAIS FÁCIL DE ENCONTRAR UM ELEMENTO, QUE NESE CASO É O id
        if(category != undefined){
            res.render("admin/categories/edit",{category: category});
        }else{
            res.redirect("/admin/categories");
        }     
    }).catch(erro =>{
        res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    
    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })
});

module.exports = router;