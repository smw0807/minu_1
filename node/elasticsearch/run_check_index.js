const es_client = require('./client');
const moment = require('moment');

function type (type) {
  let rt = '';
  switch(type) {
    case 'YYYYMMDD':
      rt = 'days';
      break
    case 'YYYYMM':
      rt = 'month';
      break
    case 'YYYY':
      rt = 'years';
      break
  }
  return rt;
}
/**
 * 년월일, 년월, 년 식의 인덱스 여러개를 조회하기 전 인덱스 유무를 체크해서
 * 존재하는 인덱스들로 반환시키기
 * @param {*} idx_name : index name
 * @param {*} sdt : start date
 * @param {*} edt : end date
 * @param {*} format : date format
 * @returns 
 */
async function run(idx_name, sdt, edt, format) {
  let rt = false;
  try {
    // console.log(idx_name, sdt, edt, format);
    if (sdt === undefined && edt === undefined) { //인덱스 1개 검색
      const rs = await es_client.indices.exists({
        index: idx_name,
        allowNoIndices: true,
        ignoreUnavailable: true,
        expandWildcards: 'all'
      });
      /**
       * closed된 인덱스도 가져오는 문제가 있음
       * open된 인덱스만 체크하고 싶은데 제공해주는 옵션중에 ignoreUnavailable 가 
       * 내가 원하는 옵션인 것 같았지만,
       * 안됨.
       * 확인이 필요함
       * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_indices_exists
       */
      if (rs) {
        return idx_name;
      }
    } else if (sdt === edt) { //시작날짜, 종료날짜 값이 같은 경우
      if (sdt.indexOf('-') !== -1) {
        sdt = sdt.replace(/-/g, '');
      }
      if (format !== undefined) { //같은데 날짜 포맷이 있을 경우
        sdt = sdt.substr(0, format.length);
      }
      const rs = await es_client.indices.exists({index: idx_name + sdt});
      if (rs) {
        return idx_name + sdt;
      }
    } else if (sdt !== edt && sdt !== undefined && edt !== undefined && format !== undefined) { //범위일 때
      if (sdt.indexOf('-') !== -1) {
        sdt = sdt.replace(/-/g, '');
      }
      if (edt.indexOf('-') !== -1) {
        edt = edt.replace(/-/g, '');
      }
      if (format === 'YYYYMM' && sdt.length > 6) {
        sdt = sdt.substr(0, 6);
      }
      if (format === 'YYYYMM' && edt.length > 6) {
        edt = edt.substr(0, 6);
      }
      if (format === 'YYYY' && sdt.length > 4) {
        sdt = sdt.substr(0, 4);
      }
      if (format === 'YYYY' && edt.length > 4) {
        edt = edt.substr(0, 4);
      }
      let start = moment(sdt);
      let end = moment(edt);
      let now = start.clone();
      let result = [];
      while(now.isSameOrBefore(end)) {
        const index_name =  idx_name + now.format(format);
        const rs = await es_client.indices.exists({
          index: index_name,
          ignore_unavailable: true,
        });
        if (rs) {
          result.push(index_name);
        }
        now.add(1, type(format));
      }
      // console.log(result);
      // console.log(result.toString()); //배열을 스트링으로 바꿔주면 이렇게 됨
      /**
       * [ 'ni_raw_flw-20211118', 'ni_raw_flw-20211119', 'ni_raw_flw-20211120' ]
       * ni_raw_flw-20211118,ni_raw_flw-20211119,ni_raw_flw-20211120
       */
      return result.toString();
    } else {
      console.log('인덱스 체크 함수 인자값 확인 필요 ', idx_name, sdt, edt, format);
      return false;
    }
  } catch (err) {
    console.error(err);
  }
  return rt;
}


async function test_function() {
  try {
    const chk = await run('ni_raw_threat-20211208');
    // const chk = await run('ni_raw_flw-');
    // const chk = await run('ni_raw_flw-20211120');
    // const chk = await run('ni_raw_flw-', '2021-11-20', '2021-11-25', 'YYYYMMDD');
    // const chk = await run('ni_stat_month-', '2020', '2021', 'YYYY');
    // const chk = await run('ni_stat_day-', '2021-11-20', '2021-12-02', 'YYYYMM');
    console.log(chk);
    if (!chk) {
      //elasticsearch event...
      console.log('not exists index');
    }
  } catch (err) {
    console.error(err);
  }
}
test_function();