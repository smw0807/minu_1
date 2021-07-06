const es_client = require('../testAPI/els');

//================================================================
const elasticsearch = require('elasticsearch');
const url = 'https://test:test1234@192.168.2.20:9200';
const es = new elasticsearch.Client({hosts: url});

async function check() {
  try {
    const test = await es.ping();
    console.log(test);
  } catch (err) {
    console.error(err);
  }
}
// check();
//================================================================

//================================================================
//search
async function search () {
  try {
    let q = {
      "size":50,
      "query":{
        "bool":{
          "must":[
            {
              "wildcard":{
                "CC_FLAG":"att_type_*"
              }
            }
          ]
        }
      }
    }
    const rs = await es_client.search({
      index: 'ts_cmn_code',
      type:'doc',
      body: q
    })
    data(rs);
  } catch (err) {
    console.error(err);
  }
}
search();
//data
function data(v) {
  v.hits.hits.flatMap( async (doc) => {
    try {
      const rs = await es.index({
        index: 'ts_cmn_code',
        type:'doc',
        id: doc._id,
        body: doc._source
      })
      console.log(rs);
    } catch (err) {
      console.error('data err : ', err);
    }
  })
}
//================================================================
