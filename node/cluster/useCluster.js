const os = require('os');
const crypto = require('crypto');
const cluster = require('cluster');

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().lengtht; i++) {
    cluster.fork();
  }
  cluster.on('error', (err) => {
    console.error('err?',err);
  })
  cluster.on('exit', (wk, code, signal) => {
    console.error(`${wk.process.pid} is died...`);
  })
} else {
  const pass = 'pass';
  const salt = 'salt';
  const start = Date.now();
  crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    const end = Date.now();
    console.log(`${process.pid} : ${(end - start) / 1000} s`);
    process.exit();
  })
}