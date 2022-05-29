const express = require('express');
const router = express.Router();
const mg = require('../../mongo');
const user = require('../../model/user');

router.post('/makeUserCollection', (req, res) => {
  const connect = mg.connect().then( (db) => {
    // console.log(db);
    user();
  })
  res.send('ok');
})

module.exports = router;