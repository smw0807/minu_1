const express = require('express');

const router = express.Router();
const es_client = require('../elastic');
const es_utils = require('../utils/utils');

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
  const uid = params.user_id;
  const pwd = params.user_pw;
  try {
    const freepass = testUserCheck(uid);
    let info = {
      uid: '',
      user_nm: ''
    }
    if (freepass) {
      info.uid = uid;
      info.user_nm = '테스트';
      const token = makeToken(info);
      rt.ok = true;
      rt.msg = 'test user';
      rt.result = {
        accessToken: token.accessToken(info),
        refreshToken: token.refreshToken(info)
      }
    } else {
      //====== user check logic ======S
      //====== user check logic ======E
      info.uid = uid;
      info.user_nm = '';
      const token = makeToken(info);
      rt.ok = true;
      rt.msg = 'login success';
      rt.result = {
        accessToken: token.accessToken(info),
        refreshToken: token.refreshToken(info)
      }
    }
  } catch (err) {
    console.error('===== login Error =====');
    console.error(err);
    rt.ok = false;
    rt.msg = 'error';
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
    const check = await certifyRefreshToken(req.headers['refresh-token']);
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

module.exports = router;