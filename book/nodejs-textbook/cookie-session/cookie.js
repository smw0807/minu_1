const http = require('http');

http.createServer( (req, res) => {
  console.log(req.url, req.headers.cookie);
  res.writeHead(200, { 'Set-Cookie': 'mycookie=test'});
  res.end('hello Cookie');
}).listen(8083, () => {
  console.log('http server start..8083');
})