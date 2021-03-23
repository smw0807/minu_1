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

async function run () {
  console.log('mongoDB run!!!');
  let dt = new data();
}
run();
module.exports = router;