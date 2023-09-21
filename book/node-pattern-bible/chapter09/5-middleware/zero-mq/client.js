import zeromq from 'zeromq';
import { ZmqMiddlewareManager } from './zmqMiddlewareManager.js';
import { jsonMiddleware } from './jsonMiddleware.js';
import { zlibMiddleware } from './zlibMiddleware.js';

async function main() {
  // 1
  const socket = new zeromq.Socket('req');
  socket.connect('tcp://127.0.0.1:5000');

  const zmqm = new ZmqMiddlewareManager(socket);
  zmqm.use(zlibMiddleware());
  zmqm.use(jsonMiddleware());
  zmqm.use({
    inbound(message) {
      console.log('Echoed back', message);
      return message;
    },
  });

  // 2
  setInterval(() => {
    zmqm.send({ action: 'ping', echo: Date.now() }).catch(err => console.error(err));
  }, 1000);

  console.log('Client connected');
}

main();
