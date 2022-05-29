const { MongoClient, ServerApiVersion } = require('mongodb');

const { MG_URL } = process.env;
const client = new MongoClient(MG_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1 
});
// const connect = () => {
  
//   client.connect(err => {
//     const collection = client.db("pj_1").collection("users");
//     client.close();
//   });
// };

module.exports = client;;

// const mongoose = require('mongoose');
// const { MG_URL } = process.env;
// const connect = () => {
  
//   if (process.env.NODE_ENV !== 'production') {
//     mongoose.set('debug', true);
//   }
//   mongoose.connect(MG_URL, {
//     // dbName: 'smw-db',
//     useNewUrlParser: true,
//     useCreateIndex: true,
//   }, (error) => {
//     if (error) {
//       console.log('몽고디비 연결 에러', error);
//     } else {
//       console.log('몽고디비 연결 성공');
//     }
//   });
// };

// mongoose.connection.on('error', (error) => {
//   console.error('몽고디비 연결 에러', error);
// });
// mongoose.connection.on('disconnected', () => {
//   console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
//   connect();
// });

// module.exports = connect;
