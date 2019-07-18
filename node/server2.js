var http = require("http");
var express = require("express");

var app = express();

app.get("http://www.naver.com", function (request, response) {
    console.log("??");
    console.log(request);
    console.log(response);
});

http.createServer(app).listen(8085, function () {
    console.log("server2 start!!!");
});