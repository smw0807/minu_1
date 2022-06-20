const fs = require('fs');

function run() {
  return new Promise ( (resolve, reject) => {
    try {
      /**
       * 왜 파일 읽는 경로 기준이 이 파일이 아니라 
       * 실행한 run.js 기준으로 경로를 찾는 걸까???
       */
      // const file = fs.createWriteStream('../_bulk/text');
      const file = fs.createWriteStream('_bulk/text');
      file.on('finish', () => {
        resolve(true); 
      })
      file.write('hi.\n');
      file.write('hello');
      file.end();
    } catch (err) {
      reject(err);
    }
  })
}
module.exports = run;