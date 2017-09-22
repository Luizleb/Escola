var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyparser = require("body-parser");
var routes = require("./routes");

module.exports = function(app) {
      //req body parser
    app.use(bodyparser.urlencoded({extended: true}));
    app.use(bodyparser.json());
    
    // routes
    app.use(routes);
    
    // define the public path
    app.use("/assets", express.static(path.join(__dirname , "../public" )));
    
    // define handlebars as the view engine
    app.engine('handlebars',exphbs.create({
        defaultLayout: 'mainLayout'
    }).engine);
    app.set('view engine', 'handlebars');

    return app;
}