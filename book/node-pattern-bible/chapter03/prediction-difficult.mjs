//예측할 수 없는 함수
import { readFile } from 'fs';

const cache = new Map();

function inconsistenRead(filename, cb) {
  if (cache.has(filename)) {
    //동기적으로 호출됨.
    cb(cache.get(filename));
  } else {
    //비동기 함수
    readFile(filename, 'utf8', (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}
