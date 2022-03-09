const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var util = require('./utils/utils');
const app = express();

require('dotenv').config();

const { server_port, STORAGE } = process.env;

const server = app.listen(server_port, function() {
  console.info ("Server Start... [" + util.dateFormat('yyyy-MM-dd HH:mm:ss E') + ']');
  console.info(`Storage Mode : ${STORAGE} | Server Port : ${server_port}`)
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());

//test
app.post('/api/test', (req, res) => {
  console.log('/api/test....');
  let rt = {
    ok: true,
    msg: 'API Success!!'
  };
  res.send(rt);
})

app.use('/api/auth', require('./routes/auth'));
if (STORAGE === 'es') {
  global.es_client = require('./elastic');
  app.use('/api/es/code', require('./routes/es/code'));
  app.use('/api/es/info', require('./routes/es/els_info'));
}
if (STORAGE === 'mysql') {
  // global.mysql = require('./mysql');
  app.use('/api/mysql/make', require('./routes/mysql/makeTable'));
}