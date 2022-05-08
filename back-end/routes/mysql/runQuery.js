const mysql = require('../../mysql');

function runQuery(sql) {
  return new Promise( async (resolve, reject) => {
    let conn = null;
    try {
      conn = await mysql.getConnection();
      await conn.beginTransaction(); //트랜젝션 시작
      const [ result ] = await conn.query(sql);
      await conn.commit(); //커밋
      conn.release();
      resolve(result);
    } catch (err) {
      if (conn !== null) {
        await conn.rollback(); //롤백
        conn.release();
      }
      reject(err);
    }
  })  
}

module.exports = runQuery;