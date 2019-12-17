var http = require('http');
var dt = require('./modules');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Start Time : " + dt.datetime());
    res.end('Hello World!!');
}).listen(8080);
//https://www.w3schools.com/nodejs/nodejs_http.asp