const passport = require('passport'); // passport의 핵심 기능을 포함한다.
const { Strategy: LocalStrategy } = require('passport-local'); // passport의 인증 기능을 직접 구현할 때 사용
const bcrypt = require('bcryptjs');

const User = require('../schemas/user');

/**
 * 클라이언트가 서버로 사용자의 아이디와 비밀번호가 담긴 데이터를 보내면 
 * passport에서는 등록된 프로퍼티 이름으로 아이디와 비밀번호를 인식
 */
const passportConfig = {
  usernameField: 'user_id', // passport가 읽을 사용자의 아이디를 확인하는 옵션
  passwordField: 'user_pw' // passport가 읽을 사용자 비밀번호를 확인하는 옵션
}
/**
 * 
 * @param {*} user_id 사용자 아이디
 * @param {*} user_pw 사용자 패스워드
 * @param {*} done 인증결과를 호출하는 함수
 * @returns 
 * 
 * done의 인자 3개의 의미
 * done(서버에서 발생한 에러, 성공했을 때 반환할 값, 사용자가 임의로 인증 실패를 만들고 싶을 때 사용하며 인증 실패한 이유를 함꼐 넣어줌?)
 */
const passportVerify = async ( user_id, user_pw, done) => {
  console.log('passportVerify start');
  console.log(user_id, user_pw);
  try {
    //유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({user_id: user_id});
    console.log('user : ', user);
    if (!user) {
      done(null, false, { message: '존재하지 않는 사용자 입니다.'});
      return;
    }
    //유저 데이터가 있다면 비밀번호 확인
    const compareResult = await bcrypt.compare(user_pw, user.user_pw);

    //비밀 번호가 맞으면
    if (compareResult) {
      done(null, user);
      return;
    }
    //비멀번호가 다르면
    done(null, false, { message: '올바르지 않은 비밀번호 입니다.'});
  } catch (err) {
    console.error('passportVerify Error : ', err);
    done(err);
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
}