import { mailSand } from './mailSender.js'

var run = (async function() {
  try {
    const params = {
      to: 'minwoo2596@',
      subject: '이메일 테스트',
      // text: '테스트 이메일 입니다.',
      html: `<h1>안녕하세요.</h1><p>이메일 테스트 중 입니다...</p>`
    }

    const result = await mailSand(params);
    console.log('result : ', result);
  } catch (err) {
    console.error(err);
  }
})();