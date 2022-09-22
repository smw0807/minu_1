const { delayError } = require('./delayError');
async function errorNotCaught() {
  try {
    // return delayError(100); //호출자에게 반환
    return await delayError(100); //로컬 catch로
    // await delayError(100); //로컬 catch로
  } catch (err) {
    console.error('Error caught by the async function: ', err.message);
  }
}

errorNotCaught().catch(err => {
  console.error('Error caught by the caller: ', err.message);
});
