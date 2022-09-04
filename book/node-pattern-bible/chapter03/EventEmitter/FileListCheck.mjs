/**
 * EventEmitter를 이용해
 * 파일 목록에서 특정 패턴이 발견되면 알려주는 함수
 */
import { EventEmitter } from 'events';
import { readFile } from 'fs';

function findRegex(files, regex) {
  const emitter = new EventEmitter();
  for (const file of files) {
    //파일을 읽을 때
    readFile(file, 'utf-8', (err, content) => {
      if (err) {
        //파일을 읽는 동안 에러가 발생하였을 때
        return emitter.emit('error', err);
      }
      emitter.emit('fileread', file); //파일이 있으면
      const match = content.match(regex); //파일 내용
      if (match) {
        //일치하는 항목이 발견됐을 때
        match.forEach(elem => emitter.emit('found', file, elem));
      }
    });
  }
  return emitter;
}

const findFile = ['test.json', '../cps.js'];
const regex = /aa \w+/gi;

findRegex(findFile, regex)
  .on('fileread', file => console.log(`${file} was read.`))
  .on('found', (file, match) => console.log(`Matched "${match} in ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`));
