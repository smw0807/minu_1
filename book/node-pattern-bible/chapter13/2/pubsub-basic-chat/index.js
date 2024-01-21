import { createServer } from 'http';
import staticHandler from 'serve-handler';
import { WebSocketServer } from 'ws';

//정적인 파일들을 서비스 한다
//1
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'wwww' });
});

const wss = new WebSocketServer({ server }); //2
wss.on('connection', client => {
  console.log('Client connected');
  //3
  client.on('message', msg => {
    console.log(`Message : ${msg}`);
    broadcast(msg);
  });
});

function broadcast(msg) {
  //4
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}

server.listen(process.argv[2] || 8080, () => {
  console.log('Start Server');
});
