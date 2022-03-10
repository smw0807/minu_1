const express = require('express');
const router = express.Router();
const mysql = require('../../mysql');

//async/await 사용 가능한 mysql2 방식
router.post('/user_table', async (req, res) => {
  console.info('/api/mysql/make/user_table');
  let rt = {
    ok: false,
    msg: '',
    result: null
  }
  let conn = null;
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

    conn = await mysql.getConnection();
    //myslq2/promise에서 결과를 배열로 반환하기 때문에 배열로 받아야한다.
    const [ result ] = await conn.query(sql);

    rt.ok = true;
    rt.msg = 'ok';
    rt.result = result;

    conn.release();
  } catch (err) {
    console.error("makeTable/user_table Error!!");
    console.error(err);
    rt.msg = 'user_table Error';
    rt.result = err.message;

    conn.release();
  }
  res.send(rt);
})

// callback 방식의 mysql
// router.post('/user_table', async (req, res) => {
//   console.info('/api/mysql/make/user_table');
//   let rt = {
//     ok: false,
//     msg: '',
//     result: null
//   }
//   try {
//     const sql = `CREATE TABLE tb_user (
//       user_id varchar(255),
//       user_nm varchar(255),
//       user_pw varchar(255),
//       user_addr varchar(255),
//       user_mk_dt datetime,
//       user_upd_dt datetime,
//       is_use tinyint(1)
//       )`;
//     mysql.getConnection((err, connection) => {
//       if (err) {
//         console.error('connection Error : ', err);
//         rt.msg = 'connection Error';
//         rt.result = err;
//         res.send(rt);
//       } else {
//         connection.query(sql, (err, rs, fields) => {
//           if (err) {
//             console.error('query Error : ', err);
//             rt.msg = 'query Error';
//             rt.result = err;
//             res.send(rt);
//           } else {
//             console.log('result : ', rs);
//             rt.ok = true;
//             rt.msg = 'success!!';
//             rt.result = rs;
//             res.send(rt);
//           }
//         })
//         connection.release();
//       }
//     });
//   } catch (err) {
//     console.error("makeTable/user_table Error!!");
//     console.error(err);
//     rt.msg = 'user_table Error';
//     rt.result = err.message;
//     res.send(rt);
//   }
// })

module.exports = router;