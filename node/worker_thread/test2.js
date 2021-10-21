const es_client = require('./elastic');

async function run_bulk (data) {
  try {
    const rs = await es_client.bulk({
      body: data,
      // refresh : 'wait_for' //0,9s, 0.9s, 0.8s
      // refresh : true //0.8s, 0.8s, 0.8s
      refresh : false //0.8s, 0.8s,
    })
  } catch (err) {
    console.error(err);
  }
}

async function search () {
  try {
    const query = {
      size: 100,
      query : {
        match_all : {}
      }
    }
    let rs = await es_client.search({
      index : 'idx_test1',
      type: '_doc',
      body : query,
      scroll: '2m'
    })
    let bulk = [];
    while(rs.hits.hits.length > 0) {
      rs.hits.hits.map( (doc) => {
        bulk.push({update: {_index:'idx_test1', _type: '_doc', _id: doc._id}});
        bulk.push({doc: {is_use: false}});
      })
      rs = await es_client.scroll({scrollId: rs._scroll_id, scroll: '2m'});
    }
    await run_bulk(bulk);
  } catch (err) {
    console.error(err);
  }
}

async function run () {
  const sTime = new Date();
  console.log('test2.js run');
  await search();
  const eTime = new Date();
  const time = (eTime - sTime) / 1000;
  console.log('test2 : ', time + 's');
}
run();