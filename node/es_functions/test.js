const makeBulk = require('./run_make_bulk2.js');

async function main () {
  try {
    const run1 = await makeBulk.run();
    console.log('run1 : ', run1);
    if (run1 === true) {
      //다음꺼
    } 
  } catch (err) {
    console.error(err);
  }
}

main();