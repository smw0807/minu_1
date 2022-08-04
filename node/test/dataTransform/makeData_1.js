const { classIpToRange } = require('./ip');
const org_depth = '4';
const depthLastCode = new Map(); //뎁스별 마지막 코드값 저장
const orgDataMap = new Map(); //엘라스틱 형식으로 변환시킨 데이터 담을 곳
const baseFormat = {
  "type": "org",
  "sensor_id": 0,
  "org": { 
    "org_pcode": 0,
    "org_code": 0,
    "org_nm": "",
    "org_level": 0,
    "org_num": 0,
    "is_use": true,
    "org_pcodes": [
    ],
    "use_ip": [
    ],
    "org_flag": "0"
  }
}
function data() {
  let result = [
    {                                                                                 
      depth1: '최상위1',
      depth2: '상위1',
      depth3: '하위1',
      depth4: '최하위1',
      'IP Address': '192.1.1.1-192.1.1.20'
    },
    {
      depth4: '최하위2',
      'IP Address': '192.1.1.30'
    },
    {
      depth4: '최하위3',
      'IP Address': '192.1.1.30'
    },
    {
      depth4: '최하위4',
      'IP Address': '192.1.1.30'
    },
    { 
      depth2: '상위2',
      depth3: '하위2',
      desc: '설명 공간'
    },
    { 
      depth3: '하위3',
      depth4: '최하위3',
      'IP Address': '120.1.1.1/24'
    },
    { 
      'IP Address': '82.1.20.6'
    },
    { 
      depth1: '최상위2',
      depth2: '상위3',
      'IP Address': '60.2.35.1-60.3.1.255'
    }
  ];
  return result;
};

//===========================================================

/**
 * 기본 데이터 생성
 * [센서, 내부그룹, 외부그룹, 미분류]
 * @param {Number} id 센서 아이디
 * @param {String} nm 센서 명
 */
function makeDefaultData({sensor_id, sensor_nm}) {
  //센서 데이터
  const sensor = JSON.parse(JSON.stringify(baseFormat));
  sensor.sensor_id = sensor_id;
  sensor.org.org_nm = sensor_nm;
  orgDataMap.set(0, sensor);

  //내부 그룹 데이터
  const nOrg = JSON.parse(JSON.stringify(baseFormat));
  nOrg.sensor_id = sensor_id;
  nOrg.org.org_pcode = 0;
  nOrg.org.org_code = 1;
  nOrg.org.org_nm = '내부그룹';
  nOrg.org.org_level = 3;
  nOrg.org.org_num = 0;
  nOrg.org.org_flag = '0-1';
  orgDataMap.set(1, nOrg);

  //외부 그룹 데이터
  const outOrg = JSON.parse(JSON.stringify(baseFormat));
  outOrg.sensor_id = sensor_id;
  outOrg.org.org_pcode = 0;
  outOrg.org.org_code = 100;
  outOrg.org.org_nm = '외부그룹';
  outOrg.org.org_level = 3;
  outOrg.org.org_num = 1;
  outOrg.org.org_flag = '0-100';
  orgDataMap.set(100, outOrg);

  //미분류 데이터
  const unknown = JSON.parse(JSON.stringify(baseFormat));
  unknown.sensor_id = sensor_id;
  unknown.org.org_pcode = 1;
  unknown.org.org_code = 999;
  unknown.org.org_nm = '미분류';
  unknown.org.org_level = 4;
  unknown.org.org_num = 999;
  unknown.org.org_flag = '0-1-999';
  orgDataMap.set(999, unknown);
}

/**
 * 마지막 코드가 특정 값이면 +1 시키기
 * @param {Number} v 
 * @returns 
 * 0은 센서, 1은 내부그룹, 100은 외부그룹, 999는 미분류라 사용하면 안됨
 */
function getLastCode(v) {
  if ([0, 1, 100, 999].includes(v)) v++
  return v;
}
/**
 * 그룹 레벨...(4부터 시작함)
 * @param {Number} v 레벨값
 * @returns 
 */
function setLevel(v) {
  let refValue = 10;
  if (v > 10) {
    refValue = 20;
  }
  return v % refValue + 3;
}

/**
 * 웹에서 받은 데이터로 엘라스틱 매핑 형식에 맞게 데이터 가공
 * ! org_code 0, 1, 100, 999는 사용 안할것
 * @param {Array} data 
 * @returns 
 */
function trimDatas({sensor_id, rows}) {
  const maxDepth = parseInt(org_depth); //최대 뎁스 설정 값
  let lastCode = 2; //0은 센서, 1은 내부그룹이라 2부터 시작
  let org_num = 0; //
  let lastPcode = 0;
  rows.map( (v) => {
    for (const key of Object.keys(v)) {
      const base = JSON.parse(JSON.stringify(baseFormat));
      base.sensor_id = sensor_id;
      if (key.indexOf('depth') !== -1) {
        lastCode = getLastCode(lastCode); //번호 세팅
        const orgName = v[key]; 
        const depthNum = parseInt(key.substr(key.length -1 , key.length)); //뎁스 번호 가져오기
        if (depthNum > maxDepth) continue; //뎁스 최대 설정값보다 크면 패스

        base.org.org_pcode = depthLastCode.get(depthNum - 1) || 1;
        base.org.org_code = lastCode;
        base.org.org_nm = orgName;
        base.org.org_level = setLevel(depthNum);
        if (lastPcode === base.org.org_pcode) {
          base.org.org_num = ++org_num
        } else {
          base.org.org_num = 0;
          org_num = 0;
        }
        lastPcode = base.org.org_pcode;
        depthLastCode.set(depthNum, lastCode);
        
        let flag = '0-1';
        for (let i = 1; i <= depthNum; i++) {
          const code = depthLastCode.get(i - 1);
          if (code) flag += `-${code}`;
        }
        flag += `-${lastCode}`;
        base.org.org_flag = flag;

        orgDataMap.set(lastCode, base);
        lastCode++;
      } else if (key.indexOf('IP Address') !== -1) {
        //아이피 데이터
        let ip = v['IP Address'];
        let ipObj = {};
        if (ip.indexOf('-') != -1) {
          ipObj.s_ip = ip.split('-')[0];
          ipObj.e_ip = ip.split('-')[1];
        } else if (ip.indexOf('/') != -1) {
          ipObj = classIpToRange(ip);
        } else {
          ipObj.s_ip = ip;
          ipObj.e_ip = ip;
        }
        ipObj.is_use = true;
        ipObj.desc = v['desc'] || '';
        const data = orgDataMap.get(lastCode - 1);
        data.org.use_ip.push(ipObj)
        orgDataMap.set(lastCode - 1, data);
      }
    }
  });
}

/**
 * 만들어진 Map 데이터들 bulk 데이터로 변환
 */
function makeBulkData({sensor_id}) {
  let result = [];
  orgDataMap.forEach( (v, k) => {
    result.push({"index": {"_index": "ni_setting", "_id": `org_${v.org.org_code}_${sensor_id}`}});
    result.push(v);
  })
  return result;
}

function makeCsvUploadData(param) {
  //기본 데이터 생성
  makeDefaultData(param);
  //데이터를 인덱스 맵핑에 맞게 변환
  trimDatas(param);
  //변환된 데이터들 벌크 데이터화
  const bulkData = makeBulkData(param);
  //엘라스틱에 벌크시키기
  console.log(bulkData);
}
const param = {
  sensor_id : 1,
  sensor_nm : '119',
  rows : data(),
}
makeCsvUploadData(param);