const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('/api/test....');
  let rt = {
    ok: true,
    msg: 'API Success!!'
  };
  res.send(rt);
})

module.exports = router;