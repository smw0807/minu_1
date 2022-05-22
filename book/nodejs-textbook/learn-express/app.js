const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);
console.log(process.env.NODE_ENV);
// app.use(morgan('dev'));
app.use((req, res, next) => {
  // morgan('dev')(req, res, next);
  if (process.env.NODE_ENV === 'production') {
    morgan('combined')(req, res, next);
    // morgan('combined'); //next 없어서 여기서 다음으로 안넘어감
  } else {
    morgan('dev')(req, res, next);
    // morgan('dev'); //next 없어서 여기서 다음으로 안넘어감
  }
})
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //querystring 모듈을 이용하여 쿼리스트링을 해석한다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: true
  },
  name: 'session-cookie'
}))

app.use( (req, res, next) => {
  console.log('모든 요청에 다 실행된다.');
  next();
});

app.use((req, res, next) => { //요청이 끝날 때까지만 데이터를 유지하는 방법?
	req.data = '데이터 넣기';
	next();
}, (req, res, next) => {
	console.log(req.data); //데이터 받기
	next();
});

app.get('/', (req, res, next) => {
  // res.send('hello, Express');
  /**
   * type module로 앱을 실행하면 __dirname is not defined가 뜨는데 이유 찾아보기.
   */
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 express 실행 중');
});