const fs = require('fs');
const es_client = require('./client');

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
  

async function run() {
  try {
    const list = fs.readdirSync('./_template/');
    console.log(list);
    asyncForEach(list, async (name) => {
      let data = fs.readFileSync('./_template/' + name, 'utf8');
      const save_name = name.split('.')[0];
      let bulk = await es_client.indices.putTemplate({
        name: save_name,
        body: data
      })
      console.log(bulk);
    })
  } catch (err) {
    console.error(err);
  }
}
run();