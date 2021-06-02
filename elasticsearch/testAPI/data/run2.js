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

  let keyval_list = new Array();
	keyval_list.push("송민우,30");
	keyval_list.push("송민우1,31");
  keyval_list.push("송민우2,32");
  keyval_list.push("송민우3,33");
  keyval_list.push("송민우4,34");
  keyval_list.push("송민우5,35");
  keyval_list.push("민우,30");
  keyval_list.push("민우1,31");
  keyval_list.push("민우2,32");
  keyval_list.push("민우3,33");
  keyval_list.push("민우4,34");
  keyval_list.push("민우5,35");


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
      rd.listColArray(keyval_list, struct); 
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
