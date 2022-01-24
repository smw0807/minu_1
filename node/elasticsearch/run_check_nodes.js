/**
 * elasticsearch node 별 이름과 디스크 사용 퍼센트
 * 참고 사이트
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_cat_nodes
 * https://www.elastic.co/guide/en/elasticsearch/reference/7.16/cat-nodes.html
 */
const es_client = require('./client');

async function run() {
  let result = [];
  try {
    const nodes = await getCatNodes();
    if (nodes.error) {
      console.error('엘라스틱서치 노드 정보 가져오기 실패');
      console.error(nodes.result);
    } else {
      result = trimData(nodes.result);
    }
  } catch (err) {
    console.error(err)
  }
  console.log(result);
  return result;
}

//cat.nodes
async function getCatNodes() {
  let rt = {};
  try {
    const rs = await es_client.cat.nodes({
      bytes: 'mb',
      h: ['name', 'disk.used_percent'],
    });
    rt.error = false;
    rt.result = rs;
  } catch (err) {
    rt.error = true;
    rt.result = err.message;
  }
  return rt;
}

//getCatNodes 데이터 가공 함수
function trimData(val) {
  let result = [];
  const arr = val.split('\n');
  for (let v of arr) {
    if (v.length > 0) {
      let data = v.split(' '); 
      let rt = {
        name : data[0],
        usage : data[1]
      }
      result.push(rt);
    }
  }
  return result;
}

run();


