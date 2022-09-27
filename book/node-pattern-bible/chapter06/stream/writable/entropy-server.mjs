//임의의 문자열 시퀀스를 출력하는 http 서버
import { createServer } from 'http';
import Chance from 'chance';

const chance = new Chance();
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' }); //1
  //2
  while (chance.bool({ likelihood: 95 })) {
    res.write(`${chance.string()}\n`); //3
  }
  res.end('\n\n'); //4
  res.on('finish', () => console.log('All data sent')); //5
});
server.listen(8080, () => {
  console.log('listening on http://localhost:8080');
});
