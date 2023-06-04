const fs = require('fs');
const es_client = require('./client');

const idx_code = 'ts_cmn_code';
const idx_ntm = 'ts_ntm_detect_rule';
const idx_mtm = 'ts_mtm_detect_rule';

/**
 * 기존 개수 20개
 * 변경 개수 16개
 */
async function run () {
  //공통코드 작업
  const v_del = await delAttType('Virus', 14);
  if (!v_del) return;
  const v_ins = await insAttType('v_data');
  if (!v_ins) return;
  const e_del = await delAttType('Etc', 6);
  if (!e_del) return;
  const e_ins = await insAttType('e_data');
  if (!e_ins) return;

  //탐지규칙 작업
  let params = {
    idx : idx_ntm,
    type: 'Virus',
    code: 'Virus_Total',
    name: '악성코드'
  }
  const v_ntm_upd = await updDetect(params);
  if (!v_ntm_upd) return;

  params = {
    idx : idx_ntm,
    type: 'Etc',
    code: 'Etc_Total',
    name: '기타'
  }
  const e_ntm_upd = await updDetect(params);
  if (!e_ntm_upd) return;

  params = {
    idx : idx_mtm,
    type: 'Virus',
    code: 'Virus_Total',
    name: '악성코드'
  }
  const v_mtm_upd = await updDetect(params);
  if (!v_mtm_upd) return;

  params = {
    idx : idx_mtm,
    type: 'Etc',
    code: 'Etc_Total',
    name: '기타'
  }
  const e_mtm_upd = await updDetect(params);
  if (!e_mtm_upd) return;
}

//======== 공통코드 공격유형 처리 =========== S
//기존 공격유형 삭제
async function delAttType(type, cnt) {
  let result = false;
  try {
    const query = {
      "query": {
        "bool": {
          "must": [
            {
              "query_string": {
                "query": `${type}*`,
                "fields": [
                  "CC_CODE", "CC_PCODE"
                ]
              }
            }
          ]
        }
      }
    }
    const check = await getCount(idx_code, query);
    if (check.ok === true && check.cnt === cnt) {
      const rs = await delQuery(idx_code, query);
      result = rs;
    } else {
      console.log(`${type} 공격유형 개수가 맞지 않아서 실행을 취소합니다.`);
    }
  } catch (err) {
    console.error(`${type} delAttType Error :`, err);
  }
  return result;
}
//새로운 공격유형 등록
async function insAttType(fileName) {
  let result = false;
  try {
    const data = fs.readFileSync(`./_bulk/${fileName}`, 'utf-8');
    const rs = await es_client.bulk({
      body: data,
      refresh: 'wait_for'
    })
    console.log(`====== ${fileName} insert result ======`);
    if (!rs.errors) {
      for( let item of rs.items) {
        console.log(JSON.stringify(item));
      }
      result = true;
    } else {
      result = false;
      console.error(`${fileName} bulk fail...`);
    }
  } catch (err) {
    console.error(`${fileName} insAttType Error :`, err);
  }
  return result;
}
//======== 공통코드 공격유형 처리 =========== E

//======== 탐지규칙 처리 =========== S
//공격유형 수정
async function updDetect(params) {
  let result = false;
  try {
    let query = {
      "query": {
        "bool": {
          "must": [
            {
              "query_string": {
                "query": `${params.type}_*`,
                "fields": [
                  "DRULE_ATT_TYPE_CODE1"
                ]
              }
            }
          ]
        }
      }
    }
    const check = await getCount(params.idx, query);
    if (check.ok === true && check.cnt !== 0) {
      query.script = {
        "source":"ctx._source.DRULE_ATT_TYPE_CODE1=params.code; ctx._source.DRULE_ATT_TYPE_NM1=params.name",
        "params":{
            "code":`${params.code}`,
            "name":`${params.name}`
        }
      }
      const rs = await updQuery(params.idx, query);
    }
    result = true;
  } catch (err) {
    console.error(`${params.type} updDetect Error : `, err);
  }
  return result;
}
//======== 탐지규칙 처리 =========== E

//======== ElasticSearch Query =========== S
//@@ 개수 구하기
async function getCount(idx, query) {
  let result = {
    ok: false,
    cnt : 0
  }
  try {
    const rs = await es_client.count({
      index: idx,
      type: 'doc',
      body: query
    })
    result = {
      ok : true,
      cnt : rs.count
    }
  } catch (err) {
    console.error('getCount Error : ', err);
  }
  return result;
}

//@@ 데이터 업데이트
async function updQuery(idx, query) {
  let result = false;
  try {
    const rs = await es_client.updateByQuery({
      index: idx, 
      type: 'doc',
      body: query
    })
    console.log(`${idx} updQuery result : ${rs.updated}`);
    result = true;
  } catch (err) {
    console.error('updQuery Error : ', err);
  }
  return result;
}

//@@ 데이터 삭제
async function delQuery(idx, query) {
  let result = false;
  try {
    const rs = await es_client.deleteByQuery({
      index: idx,
      type: 'doc',
      body: query
    })
    result = true;
  } catch (err) {
    console.error('delQeury Error : ', err);
  }
  return result;
}
//======== ElasticSearch Query =========== E
run();