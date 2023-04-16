import { mailSand } from './mailSender.js'

const params = {
  to: 'a@naver.com',
  subject: 'TEST',
  text: 'This is text...',
  html: null
}

var run = (async function() {
  try {
    const result = await mailSand();
    console.log('result : ', result);
  } catch (err) {
    console.error(err);
  }
})();