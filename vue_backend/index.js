const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var util = require('./utils/utils');
const app = express();

require('dotenv').config();

const server = app.listen(process.env.prot, function() {
  console.log ("Server Start... [" + util.dateFormat('yyyy-MM-dd HH:mm:ss E') + ']');
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());

//test
app.post('/api/test', (req, res) => {
  console.log('/api/test....');
  res.send('API Success!!');
})
//test nuxt에서 serverMiddleware 값이 있어도 탈 수 있는지 확인용
app.post('/express/test', (req, res) => {
  console.log('/express/test....');
  res.send('API Success!!');
})

app.use('/api/v1/code', require('./routes/code'));