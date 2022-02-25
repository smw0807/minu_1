const moment = require('moment');
const fs = require('fs');

const virus_name = {
  V_Ransom : '랜섬웨어',
  V_Backdoor : '백도어',
  V_Rat : 'RAT',
  V_Resource : '리소스소모',
  V_Hwp : 'HWP',
  V_Office : 'MS 오피스',
  V_Pdf : 'PDF',
  V_Adw : 'Adware',
  V_P2p : 'P2P',
  V_Connect : '감염의심',
}

const etc_name = {
  E_Platform : '오픈플랫폼 취약점',
  E_OS : 'OS취약점',
  E_Appliance : '어플라이언스 장비',
  E_EvtCollect : '보안장비이벤트 수집',
}

function run_virus_bulk () {
  let bulk = '';
  const key = Object.keys(virus_name)
  for (let item of key) {
    bulk += `{"index":{"_index":"ts_cmn_code","_type":"doc","_id":"Virus_Total_${item}"}}\n`;
    bulk += `{"CC_PCODE":"Virus_Total","CC_CODE":"${item}","CC_NM":"${virus_name[item]}","CC_DESC":"","CC_TYPE":"ALL","IS_USE":true,"NEIS_CODE":false,"CC_GRP_LEVEL":"9","CC_FLAG":"att_type_3","CC_MK_DT":"${moment().format('YYYY-MM-DD HH:mm:ss')}"}\n`;
  }
  fs.writeFileSync('./_bulk/v_data', bulk, 'utf-8');
}
run_virus_bulk();

function run_etc_bulk() {
  let bulk = '';
  const key = Object.keys(etc_name)
  for (let item of key) {
    bulk += `{"index":{"_index":"ts_cmn_code","_type":"doc","_id":"ETC_Total_${item}"}}\n`;
    bulk += `{"CC_PCODE":"ETC_Total","CC_CODE":"${item}","CC_NM":"${etc_name[item]}","CC_DESC":"","CC_TYPE":"ALL","IS_USE":true,"NEIS_CODE":false,"CC_GRP_LEVEL":"9","CC_FLAG":"att_type_9","CC_MK_DT":"${moment().format('YYYY-MM-DD HH:mm:ss')}"}\n`;
  }
  fs.writeFileSync('./_bulk/e_data', bulk, 'utf-8');
}
run_etc_bulk();