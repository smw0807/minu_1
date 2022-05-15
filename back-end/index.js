const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const util = require('./utils/utils');
const app = express();

require('dotenv').config();
const { verifyToken } = require('./middleware/auth');

const { server_port, STORAGE } = process.env;

const server = app.listen(server_port, function() {
  console.info ("Server Start... [" + util.dateFormat('yyyy-MM-dd HH:mm:ss E') + ']');
  console.info(`Storage Mode : ${STORAGE} | Server Port : ${server_port}`)
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());

app.use(verifyToken); //토큰 체크 미들웨어

//test
app.use('/api/test/', require('./routes/test'));

app.use('/api/auth', require('./routes/auth'));
if (STORAGE === 'es') {
  app.use('/api/es/idx', require('./routes/es/idx'));
  app.use('/api/es/code', require('./routes/es/code'));
  app.use('/api/es/info', require('./routes/es/info'));
  app.use('/api/es/user', require('./routes/es/user'));
}
if (STORAGE === 'mysql') {
  app.use('/api/mysql/make', require('./routes/mysql/makeTable'));
  app.use('/api/mysql/user', require('./routes/mysql/userTable'));
}