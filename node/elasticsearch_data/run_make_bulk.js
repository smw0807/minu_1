/**
 * 인덱스명과 쿼리로 뽑은 데이터들 bulk 파일로 만들기
 */
const fs = require('fs');
const es_client = require('./client');

const is_id = true
const index_name = 'ni_setting_test';

const query = {
  "size": 100,
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "type": "org"
          }
        }
      ]
    }
  }
}

async function run() {
  try {
    let rs = await es_client.search({
      index: index_name,
      body: query,
      scroll: '1m'
    })
    let bulk = '';
    while(rs.hits.hits.length > 0) {
      rs.hits.hits.map( (doc) => {
        if (is_id) {
          bulk += JSON.stringify({index: {_index: doc._index, _id: doc._id}}) + '\n';
        } else {
          bulk += JSON.stringify({index: {_index: doc._index }}) + '\n';
        }
        bulk += JSON.stringify(doc._source) + '\n';
      })
      rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
    }
    fs.writeFileSync('./_bulk/' + index_name, bulk);
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
}
run();