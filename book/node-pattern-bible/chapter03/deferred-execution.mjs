//지연 실행으로 비동시성 보장?
import { readFile } from 'fs';

const cache = new Map();

function consistenReadSync(filename, callback) {
  if (cache.has(filename)) {
    //지연된 콜백 호출
    process.nextTick(() => callback(cache.get(filename)));
  } else {
    //비동기 함수
    readFile(filename, 'utf8', (err, data) => {
      cache.set(filename, data);
      callback(data);
    });
  }
}
