const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

//채팅방 메인 화면 렌더링
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    // console.log('/', rooms);
    res.render('main', { rooms, title: '채팅방'});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/room')
  .get( (req, res) => { // 채팅방 생성 화면 렌더링
    res.render('room', { title: '채팅방 생성'});
  })
  .post( async (req, res, next) => { //채팅방 생성 처리
    try {
      //몽고디비에 방 정보 생성
      const newRoom = await Room.create({
        title: req.body.title,
        max: req.body.max,
        owner: req.session.color,
        password: req.body.password
      })
      const io = req.app.get('io'); //socket.js 에서 담은 io 객체 가져오기
      /**
       * /room 네임스페이스 연결된 모든 클라이언트에 데이터를 보내는 메서드
       * 메인 화면에 접속 중인 모든 클라이언트가 새로 생성된 채팅방에 대한 데이터를 받을 수 있다.
       */
      io.of('/room').emit('newRoom', newRoom); //웹에 방정보 전달
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`); //만들고 만든방으로 접속
    } catch(err) {
      console.error(err);
      next(err);
    }
  })

/**
 * 특정 채팅방을 렌더링하는 라우터
 * 렌더링 전에 방에 존재하는지, 비밀방인지, 비밀방이면 입력한 패스워드가 맞는지, 허용 인원을 초과하지 않았는지 검사한다.
 * rooms[req.params.id] : 해당 방의 소켓 목록이 나옴, 이걸로 참가 인원의 수를 알아낼 수 있음.
 */
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=비밀번호가 틀렸습니다.');
    }
    const { rooms } = io.of('/chat').adapter; //방 목록이 들어있음
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      return res.redirect('/?error=허용 인원이 초과하였습니다.');
    }
    const chats = await Chat.find({ room: room._id }).sort('createAt'); //디비에 저장된 채팅 내역 가져오기
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
})

/**
 * 채팅을 데이터베이스에 저장 한 후 웹 소켓을 이용해 방에 채팅 메시지 데이터를 전송
 */
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat
    })
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

/**
 * 채팅방, 채팅 내역 삭제
 * 삭제 후 2초 뒤 /room 네임스페이스에 방이 삭제되었음을 알림
 */
router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

try {
  fs.readdirSync('uploads');
} catch (err) {
  console.error('uploads 폴더가 없어 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) { //저장될 경로
      done(null, 'uploads/');
    },
    filename(req, file, done) { //파일명
      const ext = path.extname(file.originalname); //파일 확장자 추출
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    console.log(req.file.filename);
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename
    });
    console.log(chat);
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;