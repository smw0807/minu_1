const fs = require('fs').promises;

fs.readdir('./forder').then((dir) => {
  console.log('폴더 내용 확인 : ', dir);
  return fs.unlink('./forder/newfile.js');
}).then(() => {
  console.log('파일 삭제 성공');
  return fs.rmdir('./forder');
}).then(() => {
  console.log('폴더 삭제 성공');
}).catch((err) => {
  console.error(err);
})