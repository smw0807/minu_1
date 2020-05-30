const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var date = require('./util');

const server = app.listen(3000, function() {
    console.log ("Server Start... [" + date.dateFormat('yyyy-MM-dd HH:mm:ss E') + ']');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: 'dhkffk!23#',
    resave: false,
    saveUninitialized: true
}))

var main = require('./route/main')(app);