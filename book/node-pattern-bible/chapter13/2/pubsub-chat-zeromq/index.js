import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws from 'ws';
import yargs from 'yargs'; // 1
import zmq from 'zeromq';

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
});

let pubSocket;
async function initializeSockets() {
  pubSocket = new zmq.Publisher(); // 2
  await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`);

  const subSocket = new zmq.Subscriber(); //3
  const subPorts = [].concat(yargs.argv.sub);
  for (const port of subPorts) {
    console.log(`Subscribing to ${port}`);
    subSocket.connect(`tcp://127.0.0.1:${port}`);
  }
  subSocket.subscribe('chat');

  //4
  for await (const [msg] of subSocket) {
    console.log(`Message from another server: ${msg}`);
    broadcast(msg.toString().split(' ')[1]);
  }
}

initializeSockets();

const wss = new ws.Server({ server });
wss.on('connection', client => {
  console.log('Client connected');
  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    broadcast(msg);
    pubSocket.send(`chat ${msg}`); //5
  });
});

function broadcast(msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}

server.listen(yargs.argv.http || 8080);
