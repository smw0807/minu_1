const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ACCESS_KEY = process.env.access_key;
const REFRESH_KEY = process.env.refresh_key;

function certifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

function certifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, REFRESH_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

function authCheck(reqAuth = []) {
  return async function(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      //로그인 체크
      let rs = await certifyAccessToken(token);
      console.log('토큰 이상 없음.', rs);
      return next();
      // let { user_auth_code } = await certifyAccessToken(token);
      //사용자 권한 체크
      // if (reqAuth.length > 0) {
      //   //화이트리스트
      //   if (reqAuth.includes(user_auth_code)) {
      //     return next();
      //   } else {
      //     console.info(`user_auth_code:${user_auth_code} doesn't have permission to this request.`);
      //     res.status(403).json({ msg: '권한이 없습니다.' });
      //   }
      // } else {
      //   return next();
      // }
    } catch (err) {
      console.info('authCheck.err : ', err);
      res.status(401).json({ msg: 'accessToken 이상' });
    }
  };
}

function certifyPassword(requestPassword, storedPassword) {
  //return  bcrypt.compareSync(requestPassword,storedPassword);
  //this.encryptPassword(

  return bcrypt.compareSync(requestPassword, storedPassword);
}

function encryptPassword(password) {
  return bcrypt.hashSync(password, 5);
}

//accessToken 만들기
function generateAccessToken(information, time) {
  const { user_id, user_nm } = information;
  // const { user_id, user_auth_code, user_auth_nm, user_nm } = information;
  if (!user_id) {
    throw 'user_id 정보가 누락되었습니다.';
  }
  //  else if (!user_auth_code) {
  //   throw `${user_id}: user_auth_code 정보가 누락되었습니다.`;
  // } else if (!user_auth_nm) {
  //   throw `${user_id}: user_auth_nm 정보가 누락되었습니다.`;
  // }
  return jwt.sign({ user_id, user_nm }, ACCESS_KEY, { expiresIn: time });
}

//refreshToken 만들기
function generateRefreshToken(information, time) {
  // const { user_id, user_auth_code, user_auth_nm, user_nm } = information;
  const { user_id, user_nm } = information;
  if (!user_id) {
    throw 'user_id 정보가 누락되었습니다.';
  } 
  // else if (!user_auth_code) {
  //   throw `${user_id}: user_auth_code 정보가 누락되었습니다.`;
  // } else if (!user_auth_nm) {
  //   throw `${user_id}: user_auth_nm 정보가 누락되었습니다.`;
  // }
  return jwt.sign({ user_id,  user_nm }, REFRESH_KEY, { expiresIn: time });
}

function getUid(token) {
  if (token) {
    try {
      let decoded = jwt.decode(token);
      return decoded.user_id;
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    return null;
  }
}

function getUser(token) {
  if (token) {
    try {
      let decoded = jwt.decode(token);
      return decoded;
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    return null;
  }
}

module.exports = {
  certifyAccessToken,
  certifyRefreshToken,
  authCheck,
  certifyPassword,
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
  getUid,
  getUser
};
