var http = require('http');

http.createServer(function (request, response){
    console.info("node Server Start!!");
    response.writeHead(200, {'Context-Type' : 'text/html'});
    response.end('Hello World!!');
}.listen(8000));