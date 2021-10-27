const {
  Worker, isMainThread, parentPort,
} = require('worker_threads');
/**
 * isMainThread : 기존에 동작하던 싱글 스레드를 메인 스레드 또는 부모 스레드라고 한다.
 * parentPort : 부모에게 메세지를 보냄
 */
if (isMainThread) { // 부모일 때
  const worker = new Worker(__filename);
  worker.on('message', message => console.log('from worker', message)); //worker.on 워커로 부터 온 메세지를 받음, 
  worker.on('exit', () => console.log('worker exit')); //메세지를 한번만 받고 싶다면 once를 사용
  worker.postMessage('ping'); //워커에 데이터를 보낼 수 있다.
} else { // 워커일 때
  parentPort.on('message', (value) => { //parentPort.on 부모로부터 메세지를 받음
    console.log('from parent', value);
    parentPort.postMessage('pong'); //parentPort.postMessage 부모에게 메세지를 보냄
    parentPort.close();
  });
}