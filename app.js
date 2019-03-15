const express = require("express");
const path = require("path");
const mongo = require("mongoose");
const parser = require("body-parser"); 
const session = require("express-session");
const validator = require("express-validator");
const flash = require("connect-flash");
const config = require("./config/database");
const passport = require("passport");

// Configurar el acceso a MongoDB
mongo.connect(config.database);
let db = mongo.connection;

// Validar conexion a MongoDB
db.once("open", function(){
    console.error("Connection successfully to MongoDB")
});

// Atrapar errores de MongoBD
db.on("error", function(err){
    console.error(err);
});

// Inicializar app
const app = express();

// Cargar View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Utilizar un Body Parser para obtener los parametros enviados a peticiones
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

// Indicar el Public Directory
app.use(express.static(path.join(__dirname, "public")));

// Configurar Express Session
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}));

// Configurar Express Messages
app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = require("express-messages")(req, res);
    next();
});

// Configurar Express Validator
app.use(validator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split(".");
        var root = namespace.shift();
        var formParam = root;
        while(namespace.length){
            formParam += "[" + namespace.shift() + "]";
        }
        
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Configurar Passport JS
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Variable global que almacena el usuario autentificado
app.get("*", function(req, res, next){
    res.locals.user = req.user;
    next();
});

// Route principal
app.get("/", function(req, res){
    res.redirect("/user/login");
});

// Routes de Country
app.use("/country", require("./routes/country"));

// Routes de User
app.use("/user", require("./routes/user"));

// Permitir peticiones sobre el puerto indicado
app.listen(3000, function(){
    console.log("Server started on port 3000...");
});