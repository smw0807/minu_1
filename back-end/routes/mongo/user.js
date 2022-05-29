const express = require('express');
const router = express.Router();
const users = require('../../model/user');

router.post('/insert', async (req, res) => {
  try {
    const params = req.body;

    const rs = await users.create({
      user_id: params.user_id,
      user_pw: params.user_pw,
      user_nm: params.user_nm
    })
    console.log(rs);
  } catch (err) {
    console.error('mongo user insert Error : ', err);
  }
  res.send('ok');
})

router.post('/list', async (req, res) => {
  try {
    const rs = await users.find();
    console.log(rs);
  } catch (err) {
    console.error('users list Error : ', err);
  }
  res.send('ok');
})

module.exports = router;