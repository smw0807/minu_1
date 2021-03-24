const data = require('../model/testDataSet');

var struct = {
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

const sleep = function (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
};

let run = async () => {
  console.log('mongoDB run!!!');
  let cnt = 0;
  console.time('runTotal');
  while(cnt < 30000) {
    console.time('run');
    let bulk = [];
    for (var i = 0; i < 5000; i++) {
      let dt = new data();
      dt.$set(struct);
      dt.detectionCount = i;
      bulk.push(dt);
    }
    data.bulkInsert(bulk, function (err, rs) {
      if (err) {
        console.error(err);
      }
      cnt = cnt + bulk.length;
      console.log('cnt: ' + cnt);
      console.timeEnd('run');
    });
    await sleep(5000);
  }
  console.timeEnd('runTotal');
}
run();