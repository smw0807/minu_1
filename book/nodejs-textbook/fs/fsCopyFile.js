const fs = require('fs').promises;

fs.copyFile('fsDelete.js', 'fsDelete.copy.js').then(() => {
  console.log('파일 복사 완료');
  return fs.unlink('fsDelete.copy.js');
}).then(() => {
  console.log('복사 한 파일 삭제!');
})
.catch((err) => {
  console.error(err);
})