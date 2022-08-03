const { classIpToRange } = require('./ip');
const org_depth = '4';
const orgDatas = []; //엘라스틱 형식으로 변환시킨 데이터 담을 곳
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
 * @param {Number} id 센서 아이디
 * @param {String} nm 센서 명
 */
function makeDefaultData({sensor_id, sensor_nm}) {
  //센서 데이터
  const sensor = JSON.parse(JSON.stringify(baseFormat));
  sensor.sensor_id = sensor_id;
  sensor.org.org_nm = sensor_nm;
  orgDatas.push(sensor);

  //내부 그룹 데이터
  const nOrg = JSON.parse(JSON.stringify(baseFormat));
  nOrg.sensor_id = sensor_id;
  nOrg.org.org_pcode = 0;
  nOrg.org.org_code = 1;
  nOrg.org.org_nm = '내부그룹';
  nOrg.org.org_level = 3;
  nOrg.org.org_num = 0;
  nOrg.org.org_flag = '0-1';
  orgDatas.push(nOrg);

  //외부 그룹 데이터
  const outOrg = JSON.parse(JSON.stringify(baseFormat));
  outOrg.sensor_id = sensor_id;
  outOrg.org.org_pcode = 0;
  outOrg.org.org_code = 100;
  outOrg.org.org_nm = '외부그룹';
  outOrg.org.org_level = 3;
  outOrg.org.org_num = 1;
  outOrg.org.org_flag = '0-100';
  orgDatas.push(outOrg);

  //미분류 데이터
  const unknown = JSON.parse(JSON.stringify(baseFormat));
  unknown.sensor_id = sensor_id;
  unknown.org.org_pcode = 1;
  unknown.org.org_code = 999;
  unknown.org.org_nm = '미분류';
  unknown.org.org_level = 4;
  unknown.org.org_num = 999;
  unknown.org.org_flag = '0-1-999';
  orgDatas.push(unknown);
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
 * ! org_code 0, 1, 100, 999는 사용 안할것
 * @param {Array} data 
 * @returns 
 */
function trimDatas({sensor_id, sensor_nm, rows}) {
  const maxDepth = parseInt(org_depth);
  const depthLastCode = new Map(); //뎁스별 마지막 코드값 저장
  const orgDataMap = new Map();
  let lastCode = 2; 
  /**
   * 상위 뎁스 저장 방식 생각해보기.
   * 어떻게??
   */
  const result = rows.map( (cur) => {
    for (const key of Object.keys(cur)) {
      const base = JSON.parse(JSON.stringify(baseFormat));
      base.sensor_id = sensor_id;
      if (key.indexOf('depth') !== -1) {
        const data = cur[key];
        //depth Number
        const depthNum = parseInt(key.substr(key.length -1 , key.length));
        if (depthNum > maxDepth) continue;
        if (depthLastCode.has(depthNum)) {
          base.org.org_pcode = depthLastCode.get(depthNum - 1);
          lastCode = depthLastCode.get(depthNum) + 1;
          base.org.org_code = lastCode;
        } else {
          base.org.org_pcode = 1;
          base.org.org_code = lastCode;
        }
        depthLastCode.set(depthNum, lastCode);
        base.org.org_nm = data;
        base.org.org_level = setLevel(depthNum);
        base.org.org_num = null;
        base.org.org_flag = null;
        //그룹 데이터
        // console.log(lastCode, JSON.stringify(base));
        orgDataMap.set(lastCode, base);
        console.log(JSON.stringify(orgDataMap));
        lastCode++;
      } else if (key.indexOf('IP Address') !== -1) {
        //아이피 데이터
        let ip = cur['IP Address'];
        const desc = cur['desc'] || '';
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
        ipObj.desc = desc ? '' : desc;
        const data = orgDataMap.get(lastCode - 1);
        // console.log(data);
        data.org.use_ip.push(ipObj)
        orgDataMap.set(lastCode, data);
      }
      
      // console.log(JSON.stringify(orgDataMap));
    }
    // console.log('=====');
    // console.log(cur)
    // console.log('-----');
  });
  // console.log(depthLastCode);
  // console.log(result);
  return result;
}

function makeCsvUploadData(param) {
  //기본 데이터 생성
  makeDefaultData(param);
  //데이터를 인덱스 맵핑에 맞게 변환
  const tData = trimDatas(param);
  //변환된 데이터들 벌크 데이터화

  //엘라스틱에 벌크시키기

}
const param = {
  sensor_id : 1,
  sensor_nm : '119',
  rows : data(),
}
makeCsvUploadData(param);