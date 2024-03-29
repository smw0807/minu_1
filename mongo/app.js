const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// const url = 'mongodb://localhost/song';
const url = 'mongodb://minu0807.iptime.org:27017/song';
const port = 5000;

// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
mongoose.connect(url, { useCreateIndex: true })
  .then(() => {
    console.log('Successfully connected to mongodb')
    app.use('/api/test', require('./routes/api/test'));
    const data = require('./data/test');
  })
  .catch(e => console.error(e));
  

app.listen(port, () => console.log(`Server listening on port ${port}`));