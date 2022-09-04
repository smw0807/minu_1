import { EventEmitter } from 'events';
import { readFileSync } from 'fs';

class FindRegex extends EventEmitter {
  constructor(regex) {
    super(); //EventEmitter 내부 구성을 초기화하기 위해
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    for (const file of this.files) {
      readFileSync(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }

        this.emit('fileread', file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach(elem => this.emit('found', file, elem));
        }
      });
    }
    return this;
  }
}

const regex = /aa \w+/gi;

const findRegexInstance = new FindRegex(regex);
findRegexInstance
  // .addFile('test.json')
  .addFile('../cps.js')
  .find() //메서드 내 로직을 동기식으로 변경해서 아래 리스너들이 다 증발함
  .on('fileread', file => console.log(`${file} was read.`))
  .on('found', (file, match) =>
    console.log(`Matched "${match}" in file ${file}`)
  )
  .on('error', err => console.error(`Error emitted ${err.message}`));
