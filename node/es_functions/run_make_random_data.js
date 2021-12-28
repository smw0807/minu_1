const es_client = require('./client');
const ut = require("./utils");
const type = {
  1:"전체IP대역(유선)",
  2: "전체IP대역(무선)",
  3: "WEB 서버",
  4: "내부응용 서버",
  5: "DB 서버",
  6: "패치 서버",
  7: "네트워크",
  8: "보안 PC",
  9: "업무용 PC",
  10: "비업무용 PC",
  11: "기타",
}

async function run_bulk(bulk) {
  try {
    const rs = await es_client.bulk({
      body: bulk
    })
    console.log(rs);
    // console.dir(rs, {depth: 5});
  } catch (err) {
    console.error(err);
  }
}

async function run (cnt) {
  try {
    let bulk = [];
    for (var i = 0; i < cnt; i++) {
      bulk.push({"index": {"_index": "ni_manage", "_type": "_doc"}})
      let code = ut.intRange(1, 11);
      var data = {
        type: "assets",
        "assets": {
          "ip": {
            "gte": "192.168.1.1",
            "lte": ut.ipRange("192.168.1.1", "192.168.1.255")
          },
          "type_code":  code.toString(),
          "type_nm": type[code],
          "desc": '송민우 테스트',
          "mk_dt": `2021-${ut.intRange(10, 12)}-${ut.intRange(10, 28)} ${ut.intRange(10, 12)}:${ut.intRange(10, 59)}:${ut.intRange(10, 59)}`,
          "is_use": true
        }
      };
      bulk.push(data);
    }
    // console.log(bulk);
    await run_bulk(bulk);
  } catch (err) {
    console.error(err);
  }
}

run(500);