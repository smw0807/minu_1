const makeFile = require('./_js/makeFile');
const readFile = require('./_js/readFile');

async function run() {
  try {
    const make = await makeFile();
    console.log('make : ', make);
    if (make) {
      readFile();
    }
  } catch (err) {
    console.error(err);
  }
}
run();