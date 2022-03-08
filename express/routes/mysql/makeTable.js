const express = require('express');
const router = express.Router();

router.post('/user_table', async (req, res) => {
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  try {
    const sql = ``;
  } catch (err) {
    console.error("makeTable/user_table Error!!");
    console.error(err);
  }
  res.send(rt);
})

module.exports = router;