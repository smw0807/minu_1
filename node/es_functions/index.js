const fs = require('fs');
const es_client = require('./client');
async function test() {
  const rs =  await es_client.ping({requestTimeout : 1000});
  console.log(rs);
}
// test(); //엘라스틱 연결 확인

//------- index ----------S
const idx_setting = 'ni_setting';
const idx_manage = 'ni_manage';
//------- index ----------e

function make_bulk(name, data) {
  fs.writeFileSync('./_bulk/' + name, data, 'utf8', function(err) {
    if (err) {
      console.error(err);
    }
  });
}

//사용자(어드민 계정 1개만)
async function make_module() {
  try {
    const rs = await es_client.get({
      index: idx_manage,
      id: 'mod_conf'
    })
    let bulk = '';
    bulk += JSON.stringify({index: {_index: rs._index, _type: rs._type, _id: rs._id}}) + '\n';
    bulk += JSON.stringify(rs._source) + '\n';

    make_bulk('mod_conf', bulk);
    
  } catch (err) {
    console.error(err);
  }
}

//사용자(어드민 계정 1개만)
async function make_user() {
  try {
    const rs = await es_client.get({
      index: idx_setting,
      id: 'admin'
    })
    let bulk = '';
    bulk += JSON.stringify({index: {_index: rs._index, _type: rs._type, _id: rs._id}}) + '\n';
    bulk += JSON.stringify(rs._source) + '\n';

    make_bulk('user', bulk);
    
  } catch (err) {
    console.error(err);
  }
}
//공통코드 - 국가코드
async function make_ct_code() {
  try {
    let bulk = '';
    const q = {
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "type": "cmn_code"
              }
            },
            {
              "term": {
                "cmn_code.code": "ct_code"
              }
            }
          ]
        }
      },
      "sort": {
        "cmn_code.code": "asc"
      }
    }
    let r = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: q
    })
    r.hits.hits.map( (doc) => {
      bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
      bulk += JSON.stringify(doc._source) + '\n';
    })
    const query = {
      size: 1000,
      query: {
        bool: {
          filter: [
            {
              term:{
                type:'cmn_code'
              }
            },
            {
              term:{
                "cmn_code.pcode":"ct_code"
              }
            }
          ]
        }
      }
    }
    let rs = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: query,
      scroll: '1m'
    })
    
    while(rs.hits.hits.length > 0) {
      rs.hits.hits.map( (doc) => {
        bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
        bulk += JSON.stringify(doc._source) + '\n';
      })
      rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
    }
    make_bulk('ct_code', bulk);
  } catch (err) {
    console.error(err)
  }
}

//공통코드 - 프로토콜
async function make_proto() {
  try {
    let bulk = '';
    const q = {
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "type": "cmn_code"
              }
            },
            {
              "term": {
                "cmn_code.code": "proto"
              }
            }
          ]
        }
      },
      "sort": {
        "cmn_code.code": "asc"
      }
    }
    let r = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: q
    })
    r.hits.hits.map( (doc) => {
      bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
      bulk += JSON.stringify(doc._source) + '\n';
    })

    const query = {
      "size": 1000,
      "query": {
        "bool": {
          "filter": [
            {
              "term":{
                "type": "cmn_code"
              }
            },
            {
              "term":{
                "cmn_code.pcode":"proto"
              }
            }
          ]
        }
      },
      "sort": {
        "cmn_code.code":"asc"
      }
    }
    let rs = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: query,
      scroll: '1m'
    })
    
    while(rs.hits.hits.length > 0) {
      rs.hits.hits.map( (doc) => {
        bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
        bulk += JSON.stringify(doc._source) + '\n';
      })
      rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
    }
    make_bulk('proto', bulk);
  } catch (err) {
    console.error(err)
  }
}

//공통코드 - 공격유형
async function make_att_type() {
  try {
    let bulk = '';
    const query0 = {
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "type": "cmn_code"
              }
            },
            {
              "term": {
                "cmn_code.name": "공격유형"
              }
            }
          ]
        }
      }
    }
    let r = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: query0
    })
    r.hits.hits.map( (doc) => {
      bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
      bulk += JSON.stringify(doc._source) + '\n';
    })

    const query1 = {
      "size":10,
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "type": "cmn_code"
              }
            },
            {
              "term": {
                "cmn_code.pcode": "att_type"
              }
            },
            {
              "range": {
                "cmn_code.mk_dt": {
                  "gte": "2021-11-11 14:14:14"
                }
              }
            }
          ]
        }
      }
    }
    let rs = await es_client.search({
      index: idx_manage,
      type: '_doc',
      body: query1
    })
    
    let type = [];
    rs.hits.hits.map( (doc) => {
      type.push(doc._source.cmn_code.code);
      bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
      bulk += JSON.stringify(doc._source) + '\n';
    })
    for (var att of type) {
      const query2 = {
        "size":20,
        "query": {
          "bool": {
            "filter": [
              {
                "term": {
                  "type": "cmn_code"
                }
              },
              {
                "term": {
                  "cmn_code.pcode": att
                }
              },
              {
                "range": {
                  "cmn_code.mk_dt": {
                    "gte": "2021-11-11 14:14:14"
                  }
                }
              }
            ]
          }
        }
      }
      let rs2 = await es_client.search({
        index: idx_manage,
        type: '_doc',
        body: query2
      })
      rs2.hits.hits.map( (doc) => {
        bulk += JSON.stringify({index: {_index: doc._index, _type: doc._type, _id: doc._id}}) + '\n';
        bulk += JSON.stringify(doc._source) + '\n';
      })
    }
    make_bulk('att_type', bulk);
  } catch (err) {
    console.error(err);
  }
}

make_module();
make_user();
make_ct_code();
make_proto();
make_att_type();