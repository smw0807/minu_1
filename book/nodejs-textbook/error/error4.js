process.on('uncaughtException', (err) => {
  console.error('예기치 못한 에러', err)
  process.exit();
})

setInterval(() => {
  throw new Error('서버 멈춰!!');
}, 1000);

setInterval(() => {
  console.log('시작!!!');
}, 2000);