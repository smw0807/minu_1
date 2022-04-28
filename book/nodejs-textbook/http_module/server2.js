const http = require('http');
const fs = require('fs');

const server = http.createServer( async (req, res) => {
  try {
    const html = fs.readFileSync('./server2.html');
    console.log(html); //버퍼로 담김
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
    // res.end(err); //이건 에러 페이지도 안뜨고 서버에만 에러뜸
    res.end(err.message);
  }
})
server.listen(8080, () => {
  console.log('server start');
})