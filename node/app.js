var http = require("http");
var express = require("express");

var app = express();
app.use(express.static('web'));

app.use('/main', require('./web/view/main.html'));


http.createServer(app).listen(8085, function () {
    console.log("Node Server Start!!!!");
});