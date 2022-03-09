const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');
router.post('/user_insert', async (req, res) => {
  let rt = {
    ok : false,
    msg : '',
    result : null
  }
  try {

  } catch (err) {
    console.error('userTable/user_insert Error!!');
    console.error(err);
  }
})