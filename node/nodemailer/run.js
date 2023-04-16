import { mailSand } from './mailSender.js'

const params = {
  to: 'a@naver.com',
  subject: 'TEST',
  text: 'This is text...',
  html: null
}
(() => {
  try {
    // const result = await mailSand();
    // console.log('result : ', result);
    console.log('test')
  } catch (err) {
    console.error(err);
  }
})();