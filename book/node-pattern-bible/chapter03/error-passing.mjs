import { readFile } from 'fs';

function readJSON(filename, callback) {
  readFile(filename, 'utf8', (err, data) => {
    let parsed;
    if (err) {
      //에러를 전파하고 현재의 함수를 빠져 나옴
      console.log('err....');
      return callback(err);
      // callback(err); //return을 안쓰면 함수를 안빠져나가서 아래까지 내려감
    }
    try {
      //파일 내용 파싱
      parsed = JSON.parse(data);
      console.log(parsed);
    } catch (err) {
      //파싱 에러 캐치
      console.log('JSON.parse Error');
      return callback(err);
    }
    //에러 없음 데이터 전파
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
