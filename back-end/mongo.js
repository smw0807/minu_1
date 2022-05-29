const mongoose = require('mongoose');

const { MG_URL, MG_DB } = process.env;

mongoose.connect(MG_URL, {
  dbName: MG_DB,
}, (error) => {
  if (error) {
    console.log('몽고디비 연결 에러', error);
  } else {
    console.log('몽고디비 연결 성공');
  }
});

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다.');
  // connect();
});
