const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs')

const router = express.Router();
const es_client = require('../elastic');
const es_utils = require('../utils/utils');

const User = require('../schemas/user');

const { 
  generateAccessToken, 
  generateRefreshToken,
  certifyAccessToken,
  certifyRefreshToken
} = require('../utils/authenticate');

router.post('/login', async(req,res) => {
  console.log('login...');
  let rt = {
    ok: false,
    msg:'',
    result: null
  };
  const params = req.body;

  const userInfo = {
    user_id: params.user_id,
    user_pw: params.user_pw,
    user_nm: '',
  }
  try {
    const freepass = testUserCheck(userInfo.user_id);
    if (freepass) {
      console.log('this is freepass id : ', userInfo.user_id);
      userInfo.user_nm = '테스트';
      const token = makeToken(userInfo);
      rt.ok = true;
      rt.msg = '테스트 유저로 로그인했습니다.';
      rt.result = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
      res.send(rt);
    } else {
      //====== user check logic ======S
      if (process.env.STORAGE === 'mg') {
        const user = await User.findOne({user_id: userInfo.user_id});
        if (!user) {
          rt.msg = '존재하지 않는 유저입니다.';
          return res.send(rt);
        }
        const compare = bcrypt.compareSync(userInfo.user_pw, user.user_pw);
        if (!compare) {
          rt.msg = '올바르지 않은 패스워드입니다.';
          return res.send(rt);
        }
        userInfo.user_nm = user.user_nm;
        const token = makeToken(userInfo);
        rt.ok = true;
        rt.msg = '로그인 성공';
        rt.result = {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        } 
        res.send(rt);
      }
      // passport.authenticate('local', (passportError, user, info) => {
      //   console.log('authenticate...', passportError, user, info);
      //   if (passportError || !user) {
      //     rt.msg = '로그인 실패';
      //     rt.result = passportError;
      //   } else {
      //     console.log('success');
      //     console.log(user);
      //     console.log(info);
      //   }
      // })
      // console.log('!!');
      //====== user check logic ======E
      // info.uid = uid;
      // info.user_nm = '';
      // const token = makeToken(info);
      // rt.ok = true;
      // rt.msg = '로그인 성공';
      // rt.result = {
      //   accessToken: token.accessToken,
      //   refreshToken: token.refreshToken
      // }
    }
  } catch (err) {
    console.error('===== login Error =====');
    console.error(err);
    rt.ok = false;
    rt.msg = 'error';
    rt.result = err.message;
    res.send(rt);
  }
})

//accessToken 검증
router.post('/accessTokenCheck', async (req, res) => {
  console.log('accessTokenCheck!');
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  try {
    const rs = await certifyAccessToken(req.headers['x-access-token']);
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = true;
  } catch (err) {
    console.error('accessTokenCheck Error : ', err);
    if(err.message.indexOf('jwt expired') !== -1) {
      rt.msg = '토큰 만료';
    } else {
      rt.msg = '토큰 변조 의심됨';
    }
    rt.result = err.message;
  }
  res.send(rt);
})

//refreshToken 유효성 체크 후 토큰 새로 발급하기
router.post('/refreshToken', async(req,res) => {
  console.log('refreshToken....');
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  try {
    const check = await certifyRefreshToken(req.headers['x-refresh-token']);
    const info = {
      uid : check.uid,
      user_nm : check.user_nm
    }
    const token = makeToken(info);
    rt.ok = true;
    rt.result = {
      accessToken : token.accessToken,
      refreshToken : token.refreshToken
    }
  } catch (err) {
    console.error('===== refreshToken Error =====');
    console.error(err.message);
    rt.msg = 'fail....';
    rt.result = err.message;
  }
  res.send(rt);
})

function makeToken(info) {
  return {
    accessToken: generateAccessToken(info, process.env.access_time),
    refreshToken: generateRefreshToken(info, process.env.refresh_time)
  }
}

function testUserCheck (id) {
  return id === 'test';
}

async function mongoLogin(user) {
  let result = false;
  try {
    const userInfo = await User.findOne({user_id: user.user_id});
    const compare = bcrypt.compareSync(user.user_pw, userInfo.user_pw);
    result = compare;
  } catch (err) {
    console.error('mongoLogin Error :', err);
  }
  return result;
}

module.exports = router;