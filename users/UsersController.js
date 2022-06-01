const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{users: users});
    });
});

router.get("/admin/users/create",(req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({where:{email: email}}).then( user => {
        if(user == undefined){
        // salt É COMO SE FOSSE EM TEMPERO A MAIS QUE VAI SER COLOCADO NO HASH PARA AUMENTAR AINDA MAIS A SEGURANÇA DELE
            var salt = bcrypt.genSaltSync(10);// ESSE 10 É NÚMERO ALEATÓRIO PARA GERAR O SAL
            var hash = bcrypt.hashSync(password, salt);
            
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                res.redirect("/admin/users/create");
            });


        }else{
            res.redirect("/admin/users/create");
        }
    });
    
    // res.json({email, password});// É BOM UTILIZAR ANTES DE CRIAR O BANCO DE DADOS PARA TESTAR SE O EMAIL E O PASSWORD ESTÃO FUNCIONANDO
});

router.get("/login",(req,res)=>{
    res.render("admin/users/login");
});

router.post("/authenticate",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user =>{
        if(user != undefined){// SE EXISTE UM USUARIO COM ESSE EMAIL
            // VALIDAR SENHA
            var correct = bcrypt.compareSync(password, user.password); // VAI COMPARAR A HASH QUE O USUARIO DIGITAR VAI BATER COM A DO BANCO DE DADOS
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login");
            }
            
        }else{
            res.redirect("/login");
        }
    });
});

router.get("/logout", (req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
})

module.exports = router;