const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { default: ColorHash} = require('color-hash');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true
});

//몽고디비 연결
const connect = require('./schemas');
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//Socket.IO도 미들웨어를 사용할 수 있으므로 세션 정보 변수화해서 같이 사용.
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
})
app.use(sessionMiddleware);

/**
 * 세션에 color 속성이 없으면 세션 아이디로 HEX 형식의 색상 문자열로 만들어 준 뒤
 * color 속성에 값을 넣어주기
 */
app.use((req, res, next) => {
  if(!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
})

const indexRouter = require('./routes');
app.use('/', indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
})

const server = app.listen(app.get('port'), () => {
  console.log('Server Start!!!');
})

const WebSocket = require('./socket');
WebSocket(server, app, sessionMiddleware);