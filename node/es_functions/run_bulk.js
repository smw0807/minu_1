const fs = require('fs');
const es_client = require('./client');

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

async function run() {
  try {
    const list = fs.readdirSync('./_bulk/');
    asyncForEach(list, async (name) => {
      console.log(name);
      let data = fs.readFileSync('./_bulk/' + name, 'utf8');
      let bulk = await es_client.bulk({
        body: data
      })
      console.log(bulk);
    })
  } catch (err) {
    console.error(err);
  }
}
run();