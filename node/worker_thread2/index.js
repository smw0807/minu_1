const { Worker } = require('worker_threads');

const run_cnt = 5;
let number = 1;
let is_single = true;

function run_worker(num) {
  return new Promise( (resolve, reject) => {
    console.log('2', num);
    const wk = new Worker('./run1.js', {workerData: num});
    wk.on('message', (msg) => {
      console.log(msg + '번 워커로 부터 받은 message!');
    });
    wk.on('exit', () => {
      resolve(true);
    })
  })
};


async function run() {
  if (is_single) {
    for (let i = 0; i < run_cnt; i++) {
      console.log('1');
      await run_worker(number);
      number++;
      console.log('3');
    }
  } else {
    const threads = new Set();
    for (let i = 0; i < run_cnt; i++) {
      threads.add(new Worker('./run1.js', {workerData: number}));
      number++;
    }
    for (let worker of threads) {
      worker.on('message', (msg) => {
        console.log(msg + '번 워커로 부터 받은 message!');
      });
      worker.on('exit', () => {
        threads.delete(worker);
        if (threads.size === 0) {
          console.log('모든 워커 종료됨.');
        }
      })
    }
  }
}
run();