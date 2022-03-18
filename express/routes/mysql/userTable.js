const express = require('express');
const router = express.Router();
const { encryptPassword } = require('../../utils/authenticate');
const run = require('./runQuery');

const table = 'tb_user';

router.post('/row', async (req, res) => {
  let rt = {
    ok: false,
    msg : '',
    result : null
  }
  const params = req.body;
  try {
    if (isNull(params.user_id)) throw { message : 'Parameter user_id is null...'};
    const sql = `SELECT * FROM ${table} WHERE user_id="${params.user_id}"`;
    const rs = await run(sql);
    rt.msg = 'ok';
    rt.result = rs[0];
  } catch (err) {
    console.error('userTable/row Error!!', err);
    rt.msg = 'userTable row Error';
    rt.result = err.message;
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
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = await run(sql);
  } catch (err) {
    console.error('userTable/insert Error!!', err);
    rt.msg = 'user_insert Error';
    rt.result = err.message;
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
  try {
    if (isNull(params.user_id)) throw { message : '수정할 대상 정보가 없습니다.'}
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
    if (tmp.length == 0) {
      throw { message : '입력된 값이 없음'};
    } else {
      sql += `${tmp.toString()} WHERE user_id="${params.user_id}"`;
      rt.ok = true;
      rt.msg = 'ok';
      rt.result = await run(sql);
    }
  } catch (err) {
    console.error('userTable/updae Error!!', err);
    rt.msg = 'user_update Error';
    rt.result = err.message;
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
  try {
    /**
     * 삭제할 user_id가 있는지 체크하는 쿼리 필요
     */
    if (isNull(params.user_id)) throw { message : 'parameter user_id is null....'};
    const sql = `DELETE FROM ${table} WHERE user_id="${params.user_id}"`;
    rt.ok = true;
    rt.msg = 'ok';
    rt.result = await run(sql);
  } catch (err) {
    console.error('userTable/delete Error!!', err);
    rt.msg = 'userTable/delete Error';
    rt.result = err.message;
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