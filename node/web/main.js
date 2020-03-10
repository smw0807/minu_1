var http = require('http');

http.createServer(function (request, response) {
    /*
        HTTP 헤더 전송
        HTTP Status : 200 : OK
        Content Type : text/plain
    */
   response.writeHead(200, {'Context-Type': 'text/plain'});
   /*
        response Body를 "Hellow World"로 설정
   */
  response.end("Hello World\n");
}).listen(8081);

console.log("Server running at http://127.0.0.8081");