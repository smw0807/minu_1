const els = require('../els');
var datef = require('dateformat');
var rd = require("../randomUt");

const sleep = function (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
};

let struct = {
	"sendDateTime": "2019-05-01T09:10:16.424+0900",
	"detectionDateTime": "2019-05-01T09:10:16.424+0900",
	"institutionCode": "A000002779", 
	"institutionName": "충남대학교병원", 
	"equipCode": "A000000001-N-00001",
	"equipIp": "192.168.0.122", 
	"packetSize": 2,
	"attackIp": "192.107.1.120",
	"attackPort": 27007,
	"victimIp": "192.27.131.203",
	"victimPort": 24043,
	"protocol": 6,
	"detectionRuleName": "Web-XSS-29-01-Linux(bash_history).1712021828ECSC#",
	"payload": "70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 70 6B 73 6B 61 73 6B 6C 61 6C 66 61 73 6A 64 66 61 73 6C 61 6C 61 6C 61 6C 61 70 70 70 70 70 ",
	"detectionCount": 1
}

const run = async () => {
  console.log("els run!!");
  //------ 랜덤 데이터 지정 --------- S
  var col_list = new Array();
	col_list.push("institutionCode,institutionName,equipCode,equipIp");

  let keyval_list = new Array();
	keyval_list.push("A000002723,충남대학교,A000002723-N-00001,10.0.10.28");
	// keyval_list.push("A000003754,농협대학교,A000003754-N-00001,10.0.10.28");
	keyval_list.push("Z000000001,교육부사이버안전센터,Z000002019-N-00004,10.0.10.18");
	// keyval_list.push("A000004974,신경대학교,A000004974-N-00001,10.0.10.18");
	// keyval_list.push("Z000000001,교육부사이버안전센터,A000000001-N-00001,10.0.10.18");
	// keyval_list.push("R100003088,울진초등학교,A000003754-N-00001,10.0.10.18");
	// keyval_list.push("R100005370,안동초등학교,A000003754-N-00001,10.0.10.18");


  let proto_list = new Array();
	proto_list.push(6);
	proto_list.push(8);
	// proto_list.push(18);
	// proto_list.push(22);

  var detecName_list = new Array();
	detecName_list.push(Buffer.from("Hack-CnC-29-01-Linux(bash_history).1712021828ECSC#").toString('base64'));
	// detecName_list.push(Buffer.from("Mail-Hack-29-01-Linux(bash_history).1712021828ECSC#").toString('base64'));
	detecName_list.push(Buffer.from("Malwr-Ransom-29-01-Linux(bash_history).1712021828ECSC#").toString('base64'));

  var payload_list = new Array();
	payload_list.push(Buffer.from(Buffer.from("테스트1").toString('hex')).toString('base64'));
	payload_list.push(Buffer.from(Buffer.from("테스트2").toString('hex')).toString('base64'));

  //------ 랜덤 데이터 지정 --------- E
  let cnt = 0;
  console.time('runTotal');
  while(cnt < 10000) {
    console.time('run');
    let bulk = [];
    for (var i = 0; i < 5000; i++) {
      let index = '{"index":{"_index":"test_data"}}';
      bulk.push(index);
      let msg = JSON.parse(JSON.stringify(struct));
      rd.listColArray(col_list,keyval_list, struct); 
      msg.sendDateTime = datef(new Date(), "yyyy-mm-dd'T'hh:MM:ss.l+0900");
		  msg.detectionDateTime = datef(new Date(), "yyyy-mm-dd'T'hh:MM:ss.l+0900");
      msg.packetSize = rd.intRange(1, 5);
      msg.attackIp = rd.ipRange('192.168.11.1', '192.168.11.5');
      msg.victimIp = rd.ipRange('192.168.1.1', '192.168.1.5');
      msg.attackPort = rd.intRange(1010, 1019);
      msg.victimPort = rd.intRange(2020, 2029);
      msg.protocol = rd.list(proto_list);
      msg.payload = rd.list(payload_list);
      msg.detectionRuleName = rd.list(detecName_list);
      msg.detectionCount = rd.intRange(1, 5);
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
    await sleep(5000);
  }
  console.timeEnd('runTotal');
};
run();
