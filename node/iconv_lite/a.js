const exec = require('child_process').execSync;
const iconv = require('iconv-lite');

const cmd = 'ping -n 4 8.8.8.8';

let rs = exec(cmd);
// rs = rs.toString();
// console.log(rs);
rs = iconv.decode(rs, 'euc-kr');
console.log(rs);
