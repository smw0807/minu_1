import { createServer } from 'http';
import { cpus } from 'os';
import cluster from 'cluster';

// 1
if (cluster.isMaster) {
  const availableCpus = cpus();
  console.log(`Clustering to ${availableCpus.length} processes`);
  availableCpus.forEach(() => cluster.fork());
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker`);
      cluster.fork();
    }
  });
}
// 2
else {
  setTimeout(() => {
    throw new Error('Ooops');
  }, Math.ceil(Math.random() * 3) * 1000);
  const { pid } = process;
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Hedling request from ${pid}`);
    res.end(`Hellow from ${pid}\n`);
  });
  server.listen(8080, () => console.log(`Started at ${pid}`));
}
