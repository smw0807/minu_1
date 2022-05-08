/**
 * accessToken 유효성 체크 미들웨어
 * 토큰이 없을 경우 419 에러코드 리턴
 * 유효하지 않은 토큰일 경우 401 에러코드 리턴
 */
const { certifyAccessToken } = require('../utils/authenticate.js');
exports.verifyToken = async (req, res, next) => {
  try {
    if (process.env.is_token === 'Y') {
      //아래 경로는 검증 없이 패스
      if (req.path.match(/(login|refresh)/gm) != null) {
        return next();
      }
      const token = req.headers['x-access-token'];
      await certifyAccessToken(token); //accessToken 검증
    } else {
      return next();
    }
  } catch (err) {
    console.error('middleware verifyToken Error : ', err.name, err.message, err);
    if (err.message.indexOf('malformed') !== -1) { //토큰 없을 때
      return res.status(419).json({
        code: 419,
        message: 'accessToen is Null... Need  refreshToken'
      })
    }
    if (err.message.indexOf('invalid') !== -1) { //유효하지 않은 토큰
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다'
      })
    }
  }
  return next();
}