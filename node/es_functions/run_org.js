const es_client = require('./client');
let org = new Map();

async function run () {
  await makeOrg();
  const org = getOrgName(443, 1);
}
//data : n_org, id : sensor_id
function getOrgName(data, id) {
  const org_str = org.get('org_tree_' + id);
  // const org_json = JSON.parse(org_str);
  const org_title = searchOrgTitle(data, JSON.parse(org_str))
  console.log(org_title);
}
function searchOrgTitle(data, json) {
  console.log(data, json);
  let result = '';
  for (let i = 0; i < json.length; i++) {
    if (json[i].key === data) {
      result =  json[i].title;
    }
    if (i === json.length - 1 && result === '') {
      return searchOrgTitle(data, json[i].children);
    }
  }
  if (result !== '' ) {
    return result;
  }
}

async function makeOrg() {
  try {
    let query = {
      "query":{
        "bool":{
          "filter":[
            {
              "wildcard":{
                "doc_id": "org_tree*"
              }
            }
          ]
        }
      },
      "sort":{
        "doc_id":"asc"
      }
    }
    const rs = await searchScroll('ni_cache', query, false);
    for (let item of rs.flat()) {
      org.set(item.doc_id, item.text_val_1);
    }
  } catch (err) {
    console.error(err);
  }
}

async function searchScroll(idx, query, is_type) {
  let result = [];
  try {
    let rs = await es_client.search({
      index: idx,
      type: '_doc',
      body: query,
      scroll: '1m'
    })
    while(rs.hits.hits.length > 0) {
      if (is_type) {
        result.push(TypeData(rs));
      } else {
        result.push(noTypeData(rs));
      }
      rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
    }
  } catch (err) {
    console.error(err);
  }
  return result;
}

//type 형식 아닌 데이터
function noTypeData (data) {
  let rt = data.hits.hits.flatMap( (doc) => {
    let d= {};
    let key = Object.keys(doc._source);
    let val = doc._source;
    for (key in val) {
      d[key] = val[key];
    }
    return d;
  });
  return rt;
}

run();