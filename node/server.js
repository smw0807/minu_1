//모듈 추출
var http = require("http");
var express = require("express");
var main = require("./web/js/main");

//웹서버 생성
var app = express();
app.use(function (request, response, next) {});
app.use(function (request, response, next) {});
app.use(function (request, response, next) {});

//웹서버 실행
http.createServer(app).listen(8085, function () {
    console.log('Server Running !!!');
    var tt = main.setDate();
    
    console.log(tt);
    //setInterval (() => {}, 5000);
});