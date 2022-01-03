const es_client = require('./client');


async function run() {
  try {
    const rs = await es_client.indices.getTemplate({
      name: 'tpl_ni_*'
    })
    console.log(rs);
  } catch (err) {
    console.error(err);
  }
}

run();