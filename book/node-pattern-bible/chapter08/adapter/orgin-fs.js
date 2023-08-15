import fs from 'fs';

fs.writeFile('./tmp/file.txt', 'Hello!', () => {
  fs.readFile('./tmp/file.txt', { encoding: 'utf-8' }, (err, res) => {
    if (err) {
      return console.error(err);
    }
    console.log(res);
  });
});

//누럭된 파일 읽기 시도
fs.readFile('./tmp/missing.txt', { encoding: 'utf-8' }, (err, res) => {
  console.error(err);
});
