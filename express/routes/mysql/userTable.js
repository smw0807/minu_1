const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');
const { encryptPassword } = require('../../utils/authenticate');

router.post('/insert', async (req, res) => {
  let rt = {
    ok : false,
    msg : '',
    result : null
  }
  const params = req.body;
  console.table(params);
  let conn = null;
  try {
    if (params.user_id === undefined || params.user_id === '') throw '아이디 없음';
    if (params.user_nm === undefined || params.user_nm === '') throw '이름 없음';
    if (params.user_pw === undefined || params.user_pw === '') throw '패스워드 없음';
    const sql = `INSERT INTO tb_user (user_id, user_nm, user_pw, user_addr, user_mk_dt, user_upd_dt, is_use) VALUES (
      "${params.user_id}",
      "${params.user_nm}",
      "${encryptPassword(params.user_pw)}",
      "${params.user_addr}",
      NOW(),
      NOW(),
      1
      )`;
    conn = await mysql.getConnection();
    //트랜젝션 시작
    await conn.beginTransaction();
    const [ rows ] = await conn.query(sql);
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = rows;
    await conn.commit(); //commit
    conn.release();
  } catch (err) {
    console.error('userTable/user_insert Error!!');
    console.error(err);
    rt.msg = 'user_insert Error';
    rt.result = err.message;
    await conn.rollback(); //rollback
    conn.release();
  }
  res.send(rt);
})

module.exports = router;