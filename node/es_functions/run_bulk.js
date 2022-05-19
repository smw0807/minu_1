const fs = require('fs');
const es_client = require('./client');

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// async function run() {
//   try {
//     const list = fs.readdirSync('./_bulk/');
//     asyncForEach(list, async (name) => {
//       console.log(name);
//       let data = fs.readFileSync('./_bulk/' + name, 'utf8');
//       let bulk = await es_client.bulk({
//         body: data
//       })
//       console.log(bulk);
//     })
//   } catch (err) {
//     console.error(err);
//   }
// }
async function run() {
  try {
    const data = fs.readFileSync('./_bulk/ni_setting_test', 'utf8');
    let bulk = await es_client.bulk({
      body: data
    })
    if (bulk.errors) { //벌크 결과 중에 에러가 1개라도 있으면...
      for (let item of bulk.items) {
        if (item.index.status !== 200) { //결과중에 status가 200이 아닌것만 출력
          console.log(JSON.stringify(item));
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
run();