const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

//express-ejs-layouts setting
app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var date = require('./util');

const server = app.listen(5000, function() {
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
var test = require('./route/test/test')(app, date);