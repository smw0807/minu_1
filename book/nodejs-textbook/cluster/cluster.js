const cluster = require('cluster');
const http = require('http');

const numCUPs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master Process ID : ${process.pid}`);
  // CPU 개수만큼 워커를 생성
  for (let i = 0; i < numCUPs; i++) {
    cluster.fork();
  }
  // 워커가 종료되었을 때
  cluster.on('exit', (worker, code, signal) => {
    console.log(`${worker.process.pid} 번 워커 종료됨`);
    console.log('code ', code, 'signal ', signal);
    cluster.fork();
  })
} else {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8;'});
    res.end('<h1>Cluster Server!!</h1>');
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }).listen(8086);
  console.log(`${process.pid} 번 워커 실행!`)
}