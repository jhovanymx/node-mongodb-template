const express = require("express");
const router = express.Router();

// Cargar el modelo Country
let Country = require("../models/country");

// Enlistar los paises
router.get("/list", function(req, res){
    Country.find({}, function(err, countries){
        if(err){
            console.error(err);
            return;
        }
        res.render("countries", {
            countries: countries
        });
    });
});

// Formulario para agregar un pais
router.get("/add", ensureAuthenticated, function(req, res){
    res.render("country_add", {});
});

// Agregar un pais
router.post("/add", function(req, res){
    req.checkBody("id", "Id is required").notEmpty();
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("description", "Description is required").notEmpty();
    
    let errors = req.validationErrors();
    
    if(errors){
        res.render("country_add", {
            errors: errors
        })
    }else{
        let country = new Country({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description
        });
        country.save(function(err){
            if(err){
                console.error(err);
                return;
            }
            req.flash("success", "Country Added");
            res.redirect("/country/list");
        });
    }
});

// Formulario de edicion de un pais
router.get("/edit/:id", ensureAuthenticated, function(req, res){
    Country.findById(req.params.id, function(err, country){
        if(err){
            console.error(err);
            return;
        }
        res.render("country_edit", {
            country: country
        });
    });
});

// Guardar los cambios hechos a un pais
router.post("/edit/:id", function(req, res){
    let country = {        
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    };
    let query = {_id: req.params.id};
    
    Country.update(query, country, function(err, country){
        if(err){
            console.error(err);
            return;
        }
        req.flash("success", "Country Updated");
        res.redirect("/country/list");
    });
});

// Informacion de un Pais
router.get("/:id", function(req, res){
    Country.findById(req.params.id, function(err, country){
        if(err){
            console.error(err);
            return;
        }
        res.render("country", {
            country: country
        });
    });
});

// Eliminar un pais
router.delete("/:id", function(req, res){
    let query = {_id: req.params.id};
    
    Country.remove(query, function(err){
        if(err){
            console.error(err);
            return;
        } 
        res.send(JSON.stringify({ok: true}));
    });
});

// Control de Acesso
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("danger", "Please login");
        res.redirect("/user/login");
    }
}

module.exports = router;