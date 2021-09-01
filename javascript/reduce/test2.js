let tmp = [
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'cc_proto',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'proto',
        pcode: 'MAIN',
        code: 'proto',
        name: '프로토콜',
        grp_level: '0',
        mk_dt: '2017-10-19 21:04:44',
        upd_dt: '2017-10-19 21:04:44',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '0' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'cc_testCode',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'testCode',
        pcode: 'MAIN',
        code: 'testCode',
        name: '테스트 트리',
        grp_level: '0',
        mk_dt: '2021-08-20 10:36:19',
        upd_dt: '2021-08-20 10:36:19',
        desc: '1123',
        is_use: true
      }
    },
    sort: [ '0' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'cc_ct_code',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'ct_code',
        pcode: 'MAIN',
        code: 'ct_code',
        name: '국가코드',
        grp_level: '0',
        mk_dt: '2017-10-19 21:04:06',
        upd_dt: '2017-10-19 21:04:06',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '0' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'cc_att_type',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type',
        pcode: 'MAIN',
        code: 'att_type',
        name: '공격유형',
        grp_level: '0',
        mk_dt: '2021-05-12 12:28:10',
        upd_dt: '2021-09-01 11:04:42',
        desc: '',
        is_use: 'true',
        is_system: false
      }
    },
    sort: [ '0' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_2',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_2',
        pcode: 'att_type',
        code: 'Simple_Scan',
        name: '단순 침입시도_스캔',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_3',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_3',
        pcode: 'att_type',
        code: 'Virus_Malware',
        name: '악성코드_멀웨어',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_5',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_5',
        pcode: 'att_type',
        code: 'Virus_Etc',
        name: '악성코드_기타 악성코드',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_9',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_9',
        pcode: 'att_type',
        code: 'Etc_App',
        name: '기타_어플리케이션 취약점',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_12',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_12',
        pcode: 'att_type',
        code: 'Mail_Hack',
        name: '악성의심 메일분석_해킹메일',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_1',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_1',
        pcode: 'att_type',
        code: 'Web_Vul',
        name: '웹 해킹_취약점공격',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_4',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_4',
        pcode: 'att_type',
        code: 'Virus_PUP',
        name: '악성코드_PUP',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_8',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_8',
        pcode: 'att_type',
        code: 'DoS_Sys',
        name: '서비스 거부공격_시스템',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_6',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_6',
        pcode: 'att_type',
        code: 'Virus_Doc',
        name: '악성코드_문서형 악성코드',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_7',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_7',
        pcode: 'att_type',
        code: 'MalUrl_Site',
        name: '유해사이트접근_금지사이트',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_10',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_10',
        pcode: 'att_type',
        code: 'Etc_Event',
        name: '기타_이벤트 수집',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'att_type_11',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'att_type_11',
        pcode: 'att_type',
        code: 'Homepage_Widas',
        name: '홈페이지 위변조 모니터링_WIDAS',
        grp_level: '1',
        mk_dt: '2021-03-16 10:09:15',
        upd_dt: '2021-03-16 10:09:15',
        desc: '',
        is_use: true,
        is_system: false
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'testCode_asdf',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'testCode_asdf',
        pcode: 'testCode',
        code: 'asdf',
        name: '디렉토리1',
        grp_level: '1',
        mk_dt: '2021-09-01 11:51:54',
        upd_dt: '2021-09-01 11:51:54',
        desc: '',
        is_use: true
      }
    },
    sort: [ '1' ]
  },
  {
    _index: 'ni_manage',
    _type: '_doc',
    _id: 'asdf_d2',
    _score: null,
    _source: {
      type: 'cmn_code',
      cmn_code: {
        flag: 'testCode_asdf_d2',
        pcode: 'asdf',
        code: 'd2',
        name: '디-디렉토리',
        grp_level: '2',
        mk_dt: '2021-09-01 12:13:10',
        upd_dt: '2021-09-01 12:13:10',
        desc: 'ㅁ',
        is_use: true
      }
    },
    sort: [ '2' ]
  }
];
function flatmap(data) {
  let rt = data.flatMap(doc => {
    let d = {};
    d._index = doc._index;
    d._id = doc._id;
    d.type = doc._source.type;
    if (doc._source.sensor_id != undefined) {
      d.sensor_id = doc._source.sensor_id;
    }
    let key = Object.keys(doc._source.type);
    let val = doc._source[doc._source.type];
    for (key in val) {
      d[key] = val[key];
    }
    if (doc.sort) {
      d.search_after = doc.sort;
    }
    return d;
  });
  return rt;
}

let data = flatmap(tmp);

//트리구조 만들기
let level = '0';
let a = data.reduce( (acc, cur) => {
  if (level === cur.grp_level) { 
    level = cur.grp_level;
    if (cur.pcode === 'MAIN') {
      acc.push(cur);
    } else {
      const pcode = cur.pcode;
      for (var i in acc) {
        if (acc[i].code === pcode) {
          if (acc[i].children === undefined) {
            acc[i].children = [];
          }
          acc[i].children.push(cur);
        }
      }
    }
  } else {
    level = cur.grp_level;
    const pcode = cur.pcode;
    for (var i in acc) {
      console.log(acc[i]);
      if (acc[i].code === pcode) {
        if (acc[i].children === undefined) {
          acc[i].children = [];
        }
        acc[i].children.push(cur);
      }
    }
  }
  return acc;
}, []);
for (var i in a) {
  console.log(JSON.stringify(a[i]));
}