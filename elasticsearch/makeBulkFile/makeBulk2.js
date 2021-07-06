const elasticsearch = require('elasticsearch');

//moj test server
const url1 = 'https://test:test@192.168.1.23:9200';
const es_client = new elasticsearch.Client({hosts: url1});

//moj kube server
const url2 = 'https://test:test1234@192.168.2.20:9200';
const es = new elasticsearch.Client({hosts: url2});
//================================================================

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
                "DRULE_ATT_TYPE_CODE1":"*_*"
              }
            },
            {
              "term":{
                "IS_USE":true
              }
            }
          ]
        }
      }
    }
    const rs = await es_client.search({
      index: 'ts_ntm_detect_rule',
      type:'doc',
      body: q
    })
    // console.log(rs.hits.hits);
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
        index: 'ts_ntm_detect_rule',
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
