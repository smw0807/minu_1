const express = require('express');
const router = express.Router();
const mg = require('mongoose');
const test = require('../../model/test');
const data = require('../../model/testDataSet');

router.get('/', async (req, res) => {
  console.log('/api/test');
  test.find(function (err, rs) {
    if (err) {
      console.log('err :', err);
    }
    console.log(rs);
    res.json(rs);
  })
});

router.post('/insert', async(req, res) => {
  console.log('/api/test/insert');
  let tt = new test();
  tt.t
  tt.test_id = '1';
  tt.test_pass = '1',
  tt.test_name = '1';
  tt.save(function(err) {
    if (err) {
      console.log('err :', err);
      res.json(err);
      return;
    }
    res.json('dd');
  })
});


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

/**
 * param이용해서 전달 받은 데이터를 기반으로 데이터 넣기
 * 없는건 struct의 값으로 들어감
 */
router.post('/data/insert', async(req, res) => {
  console.log('/api/test/data/insert');
  var param = req.body;
  console.log(param);
  let cnt = 0;
  console.time('run');
  try{
    let bulk = [];
    for (var i = 0; i < 5000; i++) {
      let dt = new data();
      dt.$set(struct);
      if (param) {
        for (key in param) {
          dt[key] = param[key];
        }
      }
      bulk.push(dt);
    }
    data.bulkInsert(bulk, function (err, rs) {
      if (err) {
        console.error(err);
      }
      cnt = cnt + bulk.length;
      console.log('cnt: ' + cnt);
      console.timeEnd('run');
      res.json({result: 'success'});
    });
  } catch (err) {
    res.json({result: 'fail', Error: err});
  }
})

//institutionName aggs
router.post('/search1', async (req, res) =>{
  console.log('/api/test/search1');
  data.aggregate([
    {
      $group:{
        _id: "$institutionName",
        count: {$sum:1}
      }
    },
    {
      $sort:{ // 내림 차순으로 sort (오름 차순은 1)
        count: -1
      }
    }
  ], function (err, rs) {
    if (err) {
      res.json(err);
    } else {
      console.log(rs);
      res.json(rs);
    }
  })
});

router.post('/search2', async (req, res) =>{
  console.log('/api/test/search2');
  data.aggregate([
    // {
    //   $match: {institutionName: 'aaaa1'}
    // },
    {
      $group:{
        _id: "$detectionRuleName"
      }
    }
  ], (err, rs) => {
    if (err) {
      res.json(err);
    } else {
      console.log(rs);
      res.json(rs);
    }
  })
})


module.exports = router;