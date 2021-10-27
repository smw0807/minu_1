const { workerData, parentPort } = require('worker_threads');

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms * 1000);
  })
};

async function run() {
  const num = workerData;
  await sleep(3);
  parentPort.postMessage(num);
}
run();