/**
 * 참고 블로그
 * https://t-anb.tistory.com/53
 * https://darrengwon.tistory.com/688
 * https://velog.io/@gwon713/Nodejs-MySQL-DB-connection-pool
 */
const mysql = require('mysql');

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PW,
  MYSQL_DB,
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PW,
  database: MYSQL_DB,
  connectTimeout: 5000,
  connectionLimit: 30 //default 10
})

module.exports = pool