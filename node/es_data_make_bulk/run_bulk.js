const fs = require('fs');
const es_client = require('./client');

async function run() {
  try {
    const list = fs.readdirSync('./_bulk/');
    list.forEach( (name) => {
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