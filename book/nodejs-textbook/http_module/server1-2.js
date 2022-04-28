const http = require('http');
http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
  res.write('<h1>Hello?</h1>');
  res.end('<p>http server..</p>');
}).listen(8080, () => {
  console.log('server start1!');
})

http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
  res.write('<h1>Hello?</h1>');
  res.end('<p>http server..</p>');
}).listen(8081, () => {
  console.log('server start2!');
})