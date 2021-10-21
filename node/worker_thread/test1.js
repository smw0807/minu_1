const es_client = require('./elastic');
/**
 * 
 */


async function run_bulk (data) {
  try {
    /**
     * bulk 옵션별로 차이 있는지 확인.
     * refresh false가 제일 빠르긴 함
     */
    const rs = await es_client.bulk({
      body: data,
      // refresh : 'wait_for' //1.6s, 0,9s, 1.1s, 1s
      // refresh : true //1.4s, 0.7s, 1s, 1s
      refresh : false //0.7s, 0.7, 1s, 1s
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
  console.log('test1.js run');
  await search();
  const eTime = new Date();
  const time = (eTime - sTime) / 1000;
  console.log('test1 : ', time + 's');
}

module.exports = run;