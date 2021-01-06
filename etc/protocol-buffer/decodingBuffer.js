const fs = require('fs'); 
const messages = require('./message'); //인터페이스 파일

let buf = fs.readFileSync('./protocol-buffer-encoding');

let obj = messages.SimpleMessage.decode(buf);
console.log(obj);