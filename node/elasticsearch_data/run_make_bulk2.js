/**
 * 인덱스명과 쿼리로 뽑은 데이터들 bulk 파일로 만들기
 * writeStream 방식
 */
const fs = require('fs');
const es_client = require('./client');

const is_id = true
const index_name = 'ni_setting';

const query = {
  "size": 1000,
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

function run() {
  return new Promise( async (resolve, reject) => {
    try {
      let rs = await es_client.search({
        index: index_name,
        body: query,
        scroll: '1m'
      })
      let bulk = '';
      let writeStream = fs.createWriteStream('./_bulk/' + index_name);
      const sTime = new Date().getTime();
      writeStream.on('finish', () => {
        const eTime = new Date().getTime();
        console.log('파일 쓰기 완료', (eTime - sTime) / 1000 + 's');
        resolve(true);
      });
      while(rs.hits.hits.length > 0) {
        rs.hits.hits.map( (doc) => {
          if (is_id) {
            // bulk += JSON.stringify({index: {_index: doc._index, _id: doc._id}}) + '\n';
            bulk += JSON.stringify({index: {_index: 'ni_setting', _id: doc._id}}) + '\n';
          } else {
            // bulk += JSON.stringify({index: {_index: doc._index }}) + '\n';
            bulk += JSON.stringify({index: {_index: 'ni_setting' }}) + '\n';
          }
          let flag = '';
          const org_pcodes = doc._source.org.org_pcodes
          for (let i = 0; i < org_pcodes.length; i++) {
            flag += org_pcodes[i]
            if (i < org_pcodes.length -1) {
              flag += '-';
            }
          }
          doc._source.org.org_flag = flag;
          // delete doc._source.org.org_pcodes;
          // delete doc._source.org.org_pcode;
          bulk += JSON.stringify(doc._source) + '\n';
        })
        writeStream.write(bulk);
        rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
      }
      writeStream.end();
    } catch (err) {
      console.error(err.message);
      console.error(err);
      reject(err);
    }
  })
}
// run();

module.exports = {
  run
}