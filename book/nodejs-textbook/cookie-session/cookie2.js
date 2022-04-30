const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') => 
  cookie
  .split(';')
  .map( v => v.split('='))
  .reduce( (acc, [ k, v ]) => {
    acc[k.trim()] = decodeURIComponent(v);
    return acc;
  }, {});

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  console.log('url : ', req.url);
  //주소가 /login으로 시작하는 경우
  if(req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    // 쿠키 유효 시간을 현재 시간 +5분으로 설정
    expires.setMinutes(expires.getMinutes() + 5);
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; path=/`
    });
    res.end();
  } else if (cookies.name) {
    console.log('exists cookie name...');
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'});
    res.end(`${cookies.name}님 안녕하세요!`);
  } else {
    console.log('not exists cookie name...');
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
      res.end(data);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8'});
      res.end(err.message);
    }
  }
}).listen(8084, () => {
  console.log('http server start');
})