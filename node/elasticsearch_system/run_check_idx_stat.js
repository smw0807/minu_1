/**
 * elasticsearch 특정 인덱스 별 doc count, size 데이터 뽑기
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_indices_stats
 * https://www.elastic.co/guide/en/elasticsearch/reference/7.16/indices-stats.html
 */
const es_client = require('./client');
const idx_arr = [
  'ni_stat_min',
  'ni_stat_day',
  'ni_stat_month',
  'ni_raw_threat',
  'ni_raw_flw',
  'ni_raw_etc'
]

function byteToSize(size) {
  const fixed = 2;
  var str

  if (size >= 1024 * 1024 * 1024 * 1024) {
    size = size / (1024 * 1024 * 1024 * 1024);
    size = (fixed === undefined) ? size : size.toFixed(fixed);
    str = size + ' TB';
  } else if (size >= 1024 * 1024 * 1024) {
    size = size / (1024 * 1024 * 1024);
    size = (fixed === undefined) ? size : size.toFixed(fixed);
    str = size + ' GB';
  } else if (size >= 1024 * 1024) {
    size = size / (1024 * 1024);
    size = (fixed === undefined) ? size : size.toFixed(fixed);
    str = size + ' MB';
  } else if (size >= 1024) {
    size = size / 1024;
    size = (fixed === undefined) ? size : size.toFixed(fixed);
    str = size + ' KB';
  } else {
    size = (fixed === undefined) ? size : size.toFixed(fixed);
    str = size + ' byte';
  }
  return str;
}

async function runs() {
  let rt = {};
  
  try {
    let idx_infos = [];
    for (let item of idx_arr) {
      const rs = await es_client.indices.stats({
        index : item + '-*',
      })
      let info = {
        index_type : item,
        doc_count : rs._all.total.docs.count,
        size : rs._all.total.store.size_in_bytes,
        indices: [
  
        ]
      }
      const arr = Object.keys(rs.indices);
      for (let v of arr) {
        const data = rs.indices[v].total;
        info.indices.push({
          index_name : v,
          doc_count : data.docs.count,
          size : data.store.size_in_bytes
        })
      }
      idx_infos.push(info);
    }
    rt.error = false;
    rt.msg = 'ok';
    rt.result = idx_infos;

    console.dir(rt, {depth: 5});
  } catch (err) {
    console.error(err);
  }
}
runs();