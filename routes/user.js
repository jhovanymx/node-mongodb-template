const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Cargar el modelo User
let User = require("../models/user");

// Formulario de alta de usuario
router.get("/register", function(req, res){
    res.render("register");
});

// Registrar usuario
router.post("/register", function(req, res){
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is not valid").isEmail();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password-confirm", "Passwords do not match").equals(req.body.password);
    
    let errors = req.validationErrors();
    
    if(errors){
        res.render("register", {
            errors: errors
        });
    }else{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err){
                    console.error(err);
                    return;
                }
                
                user.password = hash;
                user.save(function(err){
                    if(err){
                        console.error(err);
                        return;
                    }
                    req.flash("success", "You are now register and can log in");
                    res.redirect("/user/login");
                });
            });
        });
    }
});

// Formulario de login
router.get("/login", function(req, res){
    res.render("login");
});

// Proceso de login
router.post("/login", function(req, res, next){
    passport.authenticate("local", {
        successRedirect: "/country/list",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

// Proceso de logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logget out");
    res.redirect("/user/login");
});

module.exports = router;