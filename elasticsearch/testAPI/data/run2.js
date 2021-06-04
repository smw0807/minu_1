const els = require('../els');
var datef = require('dateformat');
var rd = require("../randomUt");

const sleep = function (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
};

let struct = {
	"test_mk_dt": "2019-05-01T09:10:16.424+0900",
	"name": "송민우", 
	"age": 30, 
	"test_ip": "192.107.1.120",
	"test_port": 8080,
	"is_use": true
}

const run = async () => {
  console.log("els run!!");
  //------ 랜덤 데이터 지정 --------- S
  var col_list = new Array();
	col_list.push("name,age");

  let name = new Array();
  name.push("송민우");
	name.push("송민우1");
  name.push("송민우2");
  name.push("송민우3");
  name.push("송민우4");
  name.push("송민우5");
  name.push("민우");
  name.push("민우1");
  name.push("민우2");
  name.push("민우3");
  name.push("민우4");
  name.push("민우5");

  let age = new Array();
  age.push('27');
  age.push('28');
  age.push('29');
  age.push('30');
  age.push('31');
  age.push('32');

  let is_use = new Array();
	is_use.push(true);
	is_use.push(false);



  //------ 랜덤 데이터 지정 --------- E
  let cnt = 0;
  console.time('runTotal');
  while(cnt < 1000000) {
    console.time('run');
    let bulk = [];
    for (var i = 0; i < 5000; i++) {
      let index = '{"index":{"_index":"idx_test1"}}';
      bulk.push(index);
      let msg = JSON.parse(JSON.stringify(struct));
      msg.name = rd.list(name);
      msg.age = rd.list(age);
      msg.test_mk_dt = datef(new Date(), "yyyy-mm-dd hh:MM:ss");
      msg.test_ip = rd.ipRange('192.168.11.1', '192.168.11.5');
      msg.test_port = rd.intRange(8080, 9000);
      msg.is_use = rd.list(is_use);
      bulk.push(msg);
    }
    els.bulk({
      body: bulk
    }, (err, rs) => {
      if (err) {
        console.log('err : ', err);
      }
      cnt = cnt + (bulk.length / 2);
      console.log('cnt: ' + cnt);
      console.timeEnd('run');
    })
    await sleep(2000);
  }
  console.timeEnd('runTotal');
};
run();
