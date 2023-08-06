const express = require('express');
const session = require('express-session');

const app1 = express();
const app2 = express();

app1.use(
  session({
    secret: 'app1_secret',
    name: 'app1_sessionid',
    resave: false,
    saveUninitialized: true,
  })
);

app2.use(
  session({
    secret: 'app1_secret',
    name: 'app1_sessionid',
    resave: false,
    saveUninitialized: true,
  })
);

app1.get('/', (req, res) => {
  req.session.app1Data = 'Data from App1';
  res.send('This is App1');
});

app2.get('/', (req, res) => {
  req.session.app2Data = 'Data from App2';
  res.send('This is App2');
});

app1.listen(8001, () => {
  console.log('App1 is running on port 8001');
});

app2.listen(8002, () => {
  console.log('App2 is running on port 8002');
});
