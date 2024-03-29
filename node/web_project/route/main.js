const { get } = require('request');
const fs = require('fs');
const user = require('./util/user.js');

/**
 * `${~~}` 형식으로 모드에 맞춰 url 요청 주소를 다르게 주려고했는데 마땅한 아이디어가 떠오르지가 않네
 */
let gAction = {
  login: '/login/:userid/:userpw', //로그인
  logout: '/logout', //로그아웃
};
let sAction = {
  joinUser: '/joinUser', //회원가입
};

module.exports = function (app, util) {
  const pageType = 'main';
  app.get('/', function (req, res) {
    var sess = req.session;
    res.render('index', {
      title: 'Main page',
      length: 5,
      userid: sess.userid,
      username: sess.username,
      pageType: pageType,
    });
  });

  app.get(gAction.login, function (req, res) {
    var sess;
    sess = req.session;
    var result = {};
    var date = util.dateFormat('yyyy-MM-dd HH:mm:ss');
    fs.readFile(__dirname + '/../conf/user.json', 'utf-8', function (err, data) {
      console.log('======== 로그인 시도 ========S');
      console.log(date);
      var users = JSON.parse(data);
      var userid = req.params.userid;
      var userpw = user.sha256(userid, req.params.userpw);
      console.log('로그인 ID : ' + userid);
      if (!users[userid]) {
        //아이디 없을 때
        console.log('결과 : Fail');
        result['success'] = 0;
        result['message'] = '아이디가 존재하지 않습니다.';
        res.json(result);
        console.log('======== 로그인 시도 ========E');
        return;
      }
      if (users[userid]['pass'] == userpw) {
        console.log('결과 : Success');
        result['success'] = 1;
        sess.userid = userid;
        sess.username = users[userid]['user_nm'];
        res.json(result);
      } else {
        console.log('결과 : Fail');
        result['success'] = 0;
        result['message'] = '패스워드가 일치하지 않습니다.';
        res.json(result);
      }
      console.log('======== 로그인 시도 ========E');
    });
  });

  app.get(gAction.logout, function (req, res) {
    console.log('logout!!');
    sess = req.session;
    if (sess.username) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  });

  app.post(sAction.joinUser, async function (req, res) {
    console.log('====== 회원 가입 ======= S');
    var body = req.body; //data 정보 가져오기
    console.log('입력된 정보 : ' + JSON.stringify(body));
    var result = {};
    //아이디 중복되는게 있는지 확인
    var idCheck = await user.idCheck(body.user_id);
    if (!idCheck) {
      console.log('아이디 중복');
      result['success'] = 0;
      result['message'] = '이미 등록된 아이디 입니다.';
      res.json(result);
      console.log('====== 회원 가입 ======= E');
      return;
    }

    //패스워드 sha256 처리
    var pw = await user.sha256(body.user_id, body.user_pw);
    body['pass'] = pw;
    delete body['user_pw'];

    //등록
    var add = await user.addUser(body);
    if (add) {
      console.log('등록성공');
      result['success'] = 1;
      result['message'] = '등록에 성공했습니다.';
      res.json(result);
      console.log('====== 회원 가입 ======= E');
      return;
    } else {
      console.log('등록실패');
      result['success'] = 0;
      result['message'] = '사용자 정보 등록 중 문제가 발생했습니다.';
      res.json(result);
      console.log('====== 회원 가입 ======= E');
      return;
    }
  });
};
