const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');
router.post('/user_table', async (req, res) => {
  console.info('/api/mysql/make/user_table');
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  try {
    const sql = `CREATE TABLE tb_user (
      user_id varchar(255),
      user_nm varchar(255),
      user_pw varchar(255),
      user_addr varchar(255),
      user_mk_dt datetime,
      user_upd_dt datetime,
      is_use tinyint(1)
      )`;
    mysql.getConnection((err, connection) => {
      if (err) {
        console.error('connection Error : ', err);
      }
      connection.query(sql, (err, rs, fields) => {
        if (err) {
          console.error('query Error : ', err);
          rt.msg = 'query Error';
          rt.result = err
        } else {
          console.log('result : ', rs);
          rt.msg = 'success!!';
          rt.result = rs;
        }
      })
      connection.release();
    });
  } catch (err) {
    console.error("makeTable/user_table Error!!");
    console.error(err);
  }
  res.send(rt);
})

module.exports = router;