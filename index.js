var express = require("express");
var config = require("./server/config");

var app = express();

app.set("port", 4000);

app.listen(app.get("port"), function() {
    console.log("Listening to port " + app.get("port"));
});

config(app);