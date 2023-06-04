const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const session = require('express-session');
/**
 * 정적파일(Static files) 사용하기
 * HTML에서 사용되는 js, css, image 파일등을 정적파일이라함
 * 서버에서 정적파일을 다루기 위해선, express.static() 메소드를 사용하면됨
 */
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', express.static(__dirname + 'public'));
// __dirname : 현재 모듈의 위치를 나타냄
// path.join(__dirname, "디렉터리명")
// => 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없음

//express-ejs-layouts setting
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);

//서버가 읽을 수 있도록 HTML의 위치를 정의해줌
app.set('views', __dirname + '/views');
//서버가 HTML 렌더링을 할 때 EJS엔진을 사용하도록 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var util = require('./util');

const server = app.listen(3000, function () {
  console.log('Server Start... [' + util.dateFormat('yyyy-MM-dd HH:mm:ss E') + ']');
});

app.use(express.json());
app.use(
  session({
    secret: 'dhkffk!23#', //쿠키를 임의로 변조하는 것을 방지하기 위한 sign값, 원하는 값을 넣으면 된다.
    resave: false, //세션을 언제나 저장할 지(변경되지 않아도) 정하는 값, express-session documentation에서는 false를 권장함, 필요에 따라 true로 설정
    saveUninitialized: true, //uninitialized 세션이란 새로 생겼지만 변경되지 않은 세션을 의미함, documentaion에서는 true로 설정하는 것을 권장함
  })
);

//라우터 모듈인 main.js를 불러와서 app에 전달해준다.
// var main = require('./route/main')(app, conf, fs, util);
var main = require('./route/main')(app, util);
var test = require('./route/test/test')(app, util);
var js = require('./route/javascript/datatables')(app);
var vuejs = require('./route/vue/vue')(app);
