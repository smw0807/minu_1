//모듈 추출
var http = require("http");
var express = require("express");

//웹서버 생성
var app = express();
app.use(function (request, response, next) {});
app.use(function (request, response, next) {});
app.use(function (request, response, next) {});

//웹서버 실행
http.createServer(app).listen(8085, function () {
    console.log('Server Running !!!');
    //setInterval (() => {}, 5000);
});