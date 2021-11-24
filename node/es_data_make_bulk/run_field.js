/**
 * 인덱스 필드 추가하기
 */
const fs = require('fs');
const es_client = require('./client');

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
  

async function run() {
  try {
    const list = fs.readdirSync('./_field/');
    console.log(list);
    asyncForEach(list, async (name) => {
      let data = fs.readFileSync('./_field/' + name, 'utf8');
      const index_name = name;
      console.log(index_name);
      console.log(JSON.stringify(data));
      let rs = await es_client.indices.putMapping({
        index: index_name,
        body: data
      })
      console.log(rs);
    })
  } catch (err) {
    console.error(err);
  }
}
run();