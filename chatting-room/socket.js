/**
 * socket.io 버전으로 인한 socket.request.session 문제 관련 이슈 내용
 * https://github.com/ZeroCho/nodejs-book/issues/160
 */
const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io'});
  app.set('io', io); //라우터에서 io 객체를 사용할 수 있게 저장 req.app.get('io')로 접근 가능하다.
  const room = io.of('/room'); //채팅방 생성 및 삭제에 관한 정보를 전달하는 네임스페이스
  const chat = io.of('/chat'); //채팅 메시지를 전달하는 네임스페이스

  /**
   * Socket.IO 미들웨어.
   * 모든 웹 소켓 연결 시마다 실행된다.
   * 요청(socket.request), 응답(socket.request.res), next 함수를 인수로 넣으면 된다.
   */
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  room.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
  room.use(wrap(sessionMiddleware));
  chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
  chat.use(wrap(sessionMiddleware));
   
  room.on('connection', (socket) => {
    console.log('room 네임스페이스 접속');
    console.log('test : ', socket.request.session.color);
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });
    
  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    /** roomId
     * 같은 방에 있는 소켓끼리만 데이터를 주고 받게 하기 위해
     * 접속한 웹 페이지의 URL을 가져와 URL에서 방 아이디를 추출하는 부분
     */
    const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
    socket.join(roomId); //방에 들어가는 메서드
    /**
     * socket.to(방 아이디) 
     * 특정 방에 데이터를 보낼 수 있다.
     * 방 입장 시 입장했다는 메세지를 보냄
     */
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color} 님이 입장하셨습니다.`
    })
    socket.on('disconnect', async () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId); //방에 나가는 메서드
      const currentRoom = socket.adapter.rooms.get(roomId); //참여 중인 소켓 정보가 들어있음. (map 형식의 데이터임)
      const userCount = currentRoom ? currentRoom.size : 0;
      if (userCount === 0) {
        //접속 해제 시 현재 방의 사람 수를 확인해서 0명이면 방 제거 요청을 보냄
        try {
          /**
           * 서버에서 axios를 요청하기 때문에 쿠키를 담아서 보내지 않음.
           * 요청해더에 직접 넣어줘야함
           */
          await axios.delete(`http://localhost:8005/room/${roomId}`);
          console.log(`${roomId} 방 삭제 완료`);
        } catch (err) {
          console.error(`${roomId} 방 삭제 실패 : `, err);
        }
      } else {
        // 남은 인원이 0명이 아니라면 퇴장 메시지를 보냄
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color} 님이 퇴장하셨습니다.`
        });
      }
    })
  })
}