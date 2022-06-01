function adminAuth(req, res, next){ // SE NÃO CHAMAR O NEXT O USUARIO FICA TRAVADO
    if(req.session.user != undefined){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = adminAuth;