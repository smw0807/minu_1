/**
 * elasticsearch node 별 이름과 디스크 사용 퍼센트
 * 참고 사이트
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_cat_nodes
 * https://www.elastic.co/guide/en/elasticsearch/reference/7.16/cat-nodes.html
 */
const es_client = require('./client');
async function run() {
  try {
    const rs = await es_client.cat.nodes({
      bytes: 'mb',
      h: ['name', 'disk.used_percent'],
    });
    const arr = rs.split('\n');
    let result = [];
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
    console.log(result);
  } catch (err) {
    console.error(err)
  }
}
run();


