const express = require('express');
const router = express.Router();

const es_client = require('../../elastic');

/**
 * 인덱스 필드 추가
 */
router.post('/putMapping', async (req, res) => {
  let rt = {
    ok : false,
    msg : '',
    result : null
  };
  try {
    const params = req.body;
    console.table(params.mappings);
    const rs = await es_client.indices.putMapping({
      index: params.index_name,
      include_type_name : true,
      type: "_doc",
      body: {
        properties: params.mappings
      }
    })
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = rs;
    console.dir(rs, {depth : 10});
  } catch (err) {
    console.error('putMapping Error', err);
    rt.msg = err.message;
    rt.result = err;
  }
  res.send(rt);
})

module.exports = router;