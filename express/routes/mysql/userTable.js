const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');
router.post('/user_insert', async (req, res) => {
  let rt = {
    ok : false,
    msg : '',
    result : null
  }
  const params = req.body;
  let conn = null;
  try {
    const sql = `INSERT INTO tb_user 
    (user_id, user_nm, user_pw, user_addr, user_mk_dt, user_upd_dt, is_use) 
    VALUES (
      ${params.user_id},
      ${params.user_nm},
      ${params.user_pw},
      ${params.user_addr},
      ${params.user_mk_dt},
      ${params.user_upd_dt},
      1
      )`;
    conn = await mysql.getConnection();

  } catch (err) {
    console.error('userTable/user_insert Error!!');
    console.error(err);
  }
})