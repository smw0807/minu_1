const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');

const user = require('./user');

try {
  fs.readdirSync('uploads');
} catch (err) {
  console.log('make upload dir');
  fs.mkdirSync('uploads');
}
dotenv.config();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) { //파일 저장할 곳
      done(null, 'uploads/');
    },
    filename(req, file, done) { //저장 할 파일 이름
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

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

app.get('/file', (req, res) => {
  console.log('file');
  res.sendFile(path.join(__dirname, 'views', 'file.html'));
})
//파일이 한 개 일 때
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('upload');
  console.log(req.file, req.body);
  res.send('ok');
})
//파일이 여러개 일 때 upload.single => upload.array, req.file => req.files
// app.post('/upload', upload.array('image'), (req, res) => {
//   console.log('upload');
//   console.log(req.files, req.body);
//   res.send('ok');
// })
//파일은 여러 개 지만 키가 다를 때
// app.post('/upload', upload.fields([
//   {name : 'image'}, 
//   {name : 'image2'}
// ]), (req, res) => {
//   console.log('키가 다른 파일 여러개');
//   console.log(req.files);
//   res.send('ok');
// })
//멀티파트 인데 파일이 없을 경우
// app.post('/upload', upload.none(), (req, res) => {
//   console.log('이럴 땐 req.body만 존재한다.');
//   console.log(res.body);
//   res.send('ok');
// })

app.use('/user', user);

//경로 없음
app.use((req, res, next) => {
  res.status(404).send('Not Found');
})
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 express 실행 중');
});