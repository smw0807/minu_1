const express = require('express');
const router = express.Router();

const guestbook = require('../../schemas/GuestBook');

router.get('/', async (req, res) => {
  let rt = {
    ok: false,
    msg: '',
    result: null,
  };
  try {
    const rs = await guestbook.find({});
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = rs;
  } catch (err) {
    rt.msg = err.message;
    rt.result = err;
    console.error(err);
  }
  res.send(rt);
});

router.post('/insert', async (req, res) => {
  let rt = {
    ok: false,
    msg: '',
    result: null,
  };
  try {
    const { name, comments } = req.body;
    const rs = await guestbook.create({
      user_nm: name,
      comments: comments,
    });
    console.log(rs);
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = rs;
  } catch (err) {
    rt.msg = err.message;
    rt.result = err;
    console.error(err);
  }
  res.send(rt);
});

module.exports = router;
