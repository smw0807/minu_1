const a = v => {
  try {
    if (v) {
      return true;
    } else {
      // throw new Error('Error Test');
      throw 'throw test';
      // return false;
    }
  } catch (err) {
    console.error('Error 2 : ', err);
    throw err;
  }
};

(async () => {
  console.log('go!');
  try {
    // const run = a(true);
    const run = a(false);
    console.log('run : ', run);
  } catch (err) {
    console.error('Error 1 : ', err);
  }
})();
/**
 * go!
 * Errow 2 : [throw 내용]
 * Errow 1 : [throw 내용]
 */
