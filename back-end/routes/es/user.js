const express = require('express');
const router = express.Router();

const es_client = require('../../elastic');

const index_name = 'user_test1';

router.post('/insert', async (req, res) => {
  let rt = {
    ok: false,
    msg :'',
    result : null
  }
  try {
    const params = req.body;
    console.table(params);
    const data = {
      type : params.type,
      user_id : params.user_id,
      user_pw : params.user_pw,
      user_nm : params.user_nm,
      user_addr : params.user_addr
    }
    const rs = await es_client.index({
      index: index_name,
      body: data
    })
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = rs;
    console.dir(rs, {depth : 10});
  } catch (err) {
    console.error('es/user/insert Error', err);
    rt.msg = err.message;
    rt.result = err;
  }
  res.send(rt);
})

module.exports = router;