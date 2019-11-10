//모듈 추출
var http = require("http");
var express = require("express");
var main = require("./web/js/main");

//웹서버 생성
// var app = express();
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

//! 2019-03-10
//응답과 응답 형식
// app.use(express.static('web'));
var items = [
    {name: 'aaaa', info: 'aaaaaaa'},
    {name: 'bbbb', info: 'bbbbbbbbbbbbbbb'},
    {name: 'cccc', info: 'cccccccccccccccccccccc'}
];
// app.all('/data.html', function (request, response) {
//     var output = '';
//     output += '<!DOCTYPE html>';
//     output += '<html>';
//     output += '<head>';
//     output += '<title>Data Html</title>';
//     output += '</head>';
//     output += '<body>'
//     items.forEach(function (item) {
//         output += '<div>';
//         output += ' <h1>' + item.name + '</h1>';
//         output += ' <h2>' + item.info + '</h2>';
//         output += '</div>';
//     });
//     output += '</body>'
//     output += '</html>';
//     response.send(output);        
// })
// app.all('/data.json', function (request, response) {
//     response.send(items);
// })
// app.all('/data.xml', function (request, response) {
//     var output = '';
//     output += '<?xml version="1.0" encoding="UTF-8" ?>';
//     output += '<products>';
//     items.forEach(function (item) {
//         output += '<product>';
//         output += '<name>' + item.name + '</name>';
//         output += '<info>' + item.info + '</info>';
//         output += '</product>';
//     });
//     output += '</products>';
//     response.type("text/xml");
//     response.send(output);
// })

// 요청과 요청 매개변수
// 일반 요청 매개변수
// app.all('/parameter/', function (request, response) {
//     var name = request.param('name');
//     var info = request.param('info');
//     response.send('<h1>' + name + ':' + info + '</h1>');
// });
// 동적 라우트 요청 매개 변수
// app.all('/papapa/:id', function (request, response) {
//     var id = request.param('id');
//     response.send('<h1>' + id + '</h1>');
// });

//! 2019-03-24
//body parser 미들웨어와 라우트 구성
var app = express();
app.use(express.static('web'));

// app.get('/products', function (request, response) {
//     response.send(items);
// });
// app.get('/products/:id', function (request, response) {
//     var id = Number(request.param('id'));
    
//     if (isNaN(id)) {
//         //오류 : 잘못된 경로
//         response.send({
//             error: '숫자를 입력하세요!'
//         })
//     } else if (items[id]) {
//         //정상
//         response.send(items[id]);
//     } else {
//         response.send({
//             error: '존재하지 않는 데이터 입니다.!'
//         })
//     }
// });
// app.post('/products', function (request, response) {});
// app.put('/products/:id', function (request, response) {});
// app.del('/products/:id', function (request, response) {});

//웹서버 실행
http.createServer(app).listen(8085, function () {
    console.log('Server Running !!!');
    //setInterval (() => {}, 5000);
});