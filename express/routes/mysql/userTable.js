const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');
const { encryptPassword } = require('../../utils/authenticate');

const table = 'tb_user';

router.post('/row', async (req, res) => {
  let rt = {
    ok: false,
    msg : '',
    result : null
  }
  const params = req.body;
  let conn = null;
  try {
    if (isNull(params.user_id)) throw { message : 'Parameter user_id is null...'};
    const sql = `SELECT * FROM ${table} WHERE user_id="${params.user_id}"`;
    conn = await mysql.getConnection();
    await conn.beginTransaction();
    const [ row  ] = await conn.query(sql);
    rt.msg = 'ok';
    rt.result = row[0];
    await conn.commit();
    conn.release();
  } catch (err) {
    console.error('userTable/row Error!!', err);
    rt.msg = 'userTable row Error';
    rt.result = err.message;
    if (conn !== null) {
      await conn.rollback();
      conn.release();
    }
  }
  res.send(rt);
})

router.post('/insert', async (req, res) => {
  let rt = {
    ok : false,
    msg : '',
    result : null
  }
  const params = req.body;
  let conn = null;
  try {
    if (isNull(params.user_id)) throw { message : '아이디 없음'};
    if (isNull(params.user_nm)) throw { message : '이름 없음'};
    if (isNull(params.user_pw)) throw { message : '패스워드 없음'};
    const sql = `INSERT INTO ${table} (user_id, user_nm, user_pw, user_addr, user_mk_dt, user_upd_dt, is_use) VALUES (
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
    console.error('userTable/insert Error!!', err);
    rt.msg = 'user_insert Error';
    rt.result = err.message;
    if (conn !== null) {
      await conn.rollback(); //rollback
      conn.release();
    }
  }
  res.send(rt);
})
/**
UPDATE 테이블명 SET 컬럼1 = 수정값1 [, 컬럼2 = 수정값2 ...] [WHERE 조건];
예제 : 테이블 데이터 전체 수정
UPDATE table_name SET country = '대한민국';
예제 : 테이블 데이터 일부 수정
UPDATE table_name SET name = '테스트 변경', country = '대한민국' WHERE id = 1105;
 */
router.post('/update', async (req, res) => {
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  const params = req.body;
  let conn = null;
  try {
    let sql = `UPDATE ${table} SET `;
    //---------------
    //배열을 toString() 처리하면 콤마 처리가 편리해서 이렇게 만들어 봤음
    let tmp = [];
    if (params.user_nm) {
      tmp.push(`user_nm="${params.user_nm}"`);
    }
    if (params.user_pw) {
      tmp.push(`user_pw="${params.user_pw}"`);
    }
    if (params.user_addr) {
      tmp.push(`user_addr="${params.user_addr}"`);
    }
    //--------------
    // console.log(tmp.toString());
    if (tmp.length == 0) {
      throw { message : '입력된 값이 없음'};
    } else {
      sql += `${tmp.toString()} WHERE user_id="${params.user_id}"`;
      // console.log(sql);
      conn = await mysql.getConnection();
      await conn.beginTransaction();
      const [ result ] = await conn.query(sql);
      rt.ok = true;
      rt.msg = 'ok';
      rt.result = result;
      await conn.commit();
      conn.release();
    }
  } catch (err) {
    console.error('userTable/updae Error!!', err);
    rt.msg = 'user_update Error';
    rt.result = err.message;
    if (conn !== null) {
      await conn.rollback();
      conn.release();
    }
  }
  res.send(rt);
})

router.post('/delete', async (req, res) => {
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  const params = req.body;
  let conn = null;
  try {
    if (isNull(params.user_id)) throw { message : 'parameter user_id is null....'};
    const sql = `DELETE FROM ${table} WHERE user_id="${params.user_id}"`;
    conn = await mysql.getConnection();
    await conn.beginTransaction();
    const [ result ] = await conn.query(sql);
    await conn.commit();
    conn.release();
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = result;
  } catch (err) {
    console.error('userTable/delete Error!!', err);
    rt.msg = 'userTable/delete Error';
    rt.result = err.message;
    if (conn !== null) {
      await conn.rollback();
      conn.release();
    }
  }
  res.send(rt);
})

function isNull (v) {
  let result = false;
  if (v === undefined || v === null || v === '') {
    result = true;
  }
  return result;
}

module.exports = router;