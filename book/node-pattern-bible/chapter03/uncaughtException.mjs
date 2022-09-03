import { readFile } from 'fs';

function readJSON(filename, callback) {
  readFile(filename, 'utf8', (err, data) => {
    let parsed = JSON.parse(data);
    console.log(parsed);
    callback(null, parsed);
  });
}

readJSON('test1.json', (err, data) => {
  console.log('run...');
  if (err) {
    console.log('Error!!!');
    console.log(err);
  } else {
    console.log('data!!!');
    console.log(data);
  }
});

process.on('uncaughtException', err => {
  console.error('uncaughtException!');
  console.error(err.message);
  console.error(err);
  //종료 코드 1(에러)과 함께 애플리케이션 종료
  //아래의 코드가 없으면 애플리케이션은 계속됨
  process.exit(1);
});
