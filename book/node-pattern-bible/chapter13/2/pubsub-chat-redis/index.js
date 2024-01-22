import { createServer } from 'http';
import staticHadler from 'serve-handler';
import ws from 'ws';
import Redis from 'ioredis'; // 1

// const redisOptions = {
//   port: 6379,
//   host: '127.0.0.1',
//   family: 4,
//   db: 0,
// };

const redisSub = new Redis();
const redisPub = new Redis();

redisSub.get('chat_messages', (err, result) => {
  if (err) {
    console.error('Error getting key:', err);
  } else {
    console.log('Value:', result);
  }
});

// 정적인 파일들을 서비스함
const server = createServer((req, res) => {
  return staticHadler(req, res, { public: 'www' });
});

const wss = new ws.Server({ server });
wss.on('connection', client => {
  console.log('Client connected');
  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    // 2
    redisPub.publish('chat_message', msg);
  });
});

// 3
redisSub.subscribe('chat_messages');
redisSub.on('message', (channel, msg) => {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
});

server.listen(process.argv[2] || 8080, () => {
  console.log('start');
});
