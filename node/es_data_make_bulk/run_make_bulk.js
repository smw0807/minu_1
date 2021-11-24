/**
 * 인덱스명과 쿼리로 뽑은 데이터들 bulk 파일로 만들기
 */
const fs = require('fs');
const es_client = require('./client');

const is_id = true
const index_name = 'ni_manage';

const query = {
  size: 100,
  query : {
    bool : {
      must : [
        {
          term : {
            type : "cmn_code"
          }
        }
      ]
    }
  }
}

async function run() {
  let rs = await es_client.search({
    index: index_name,
    type: '_doc',
    body: query,
    scroll: '1m'
  })
  let bulk = '';
  while(rs.hits.hits.length > 0) {
    rs.hits.hits.map( (doc) => {
      if (is_id) {
        bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
      } else {
        bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type}}) + '\n';
      }
      bulk += JSON.stringify(doc._source) + '\n';
    })
    rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
  }
  fs.writeFileSync('./_bulk/' + index_name, bulk);
}
run();