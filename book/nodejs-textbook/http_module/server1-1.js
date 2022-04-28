const http = require('http');

const server = http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
  res.write('<h1>Hello?</h1>');
  res.end('<p>http server..</p>');
});
server.listen(8080);
server.on('listennig', () => {
  console.log('server start!');
})
server.on('error', (err) => {
  console.error(err);
})