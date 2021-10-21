/**
 * 회사에서 ElasticSearch 데이터 조회 및 데이터 포맷 생성 후 insert 그리고 bulk 처리를 하는 걸 만들었는데
 * 생각보다 성능이 너무 안나와서 테스트 목적으로 만든 파일.
 * 
 * 일반 적인 로직으로 데이터 조회 및 bulk 데이터 생성
 * 워커스레드를 이용해 데이터 조회 및 bulk 데이터 생성
 * 이 2개의 처리 속도 테스트 (데이터는 15,000개)
 */

const worker = require('worker_threads');


const run1 = require('./test1');
run1();

let test = false;
if (!test) {
  console.log('run worker!');
  test = true;
  const wk = new worker.Worker('./test2.js');
  wk.on('exit', async function() {
    console.log('finish worker!');
  })
}