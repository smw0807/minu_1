//모듈 추출
var http = require("http");
var express = require("express");
var main = require("./web/js/main");

//웹서버 생성
var app = express();
//? ???
// app.use(function (request, response, next) {
//     console.log("firest");
//     next();
// });
// app.use(function (request, response, next) {
//     console.log("second");
//     next();
// });
// app.use(function (request, response, next) {
//     response.send('<h1>안녕? Middleware Test....</h1>');
// });

//! 2019-03-09
// app.use(function (request, response, next) {
//     request.test = 'request test';
//     response.test = 'respnose test';
//     next();
// });
// app.use(function (request, response, next) {
//     response.send('<h1>' + request.test + '::' + response.test + '</h1>');
// })

//* static middleware
// app.use(express.static('web'));
// //? 여러개 선언해서 라이브러리 같은거 선언 가능할까?
// app.use(express.static('./../lib')); //안먹히는 것 같다...? 더 알아봐야할듯

// app.use(function (request, response) {
//     response.send('<h1>Hello Middleware...!');
// });

//* router middleware
// app.use(express.static('web'));
// app.all('/a', function (request, response) {
//     response.send('Page A');
// });
// app.all('/b', function (request, response) {
//     response.send('Page B');
// });
// app.all('/c', function (request, response) {
//     response.send('Page C');
// });

//응답과 응답 형식
app.use(express.static('web'));
var item = [
    {name: 'aaaa', info: 'aaaaaaa'},
    {name: 'bbbb', info: 'bbbbbbbbbbbbbbb'},
    {name: 'cccc', info: 'cccccccccccccccccccccc'}
];
app.all('/data.html', function (request, response) {
    
})
app.all('/data.json', function (request, response) {

})
app.all('/data.xml', function (request, response) {

})


//웹서버 실행
http.createServer(app).listen(8085, function () {
    console.log('Server Running !!!');
    //setInterval (() => {}, 5000);
});