const fs = require('fs');
const protobuf = require('protocol-buffers');

//컴파일
let js = protobuf.toJS(fs.readFileSync('./simple_message.proto')); //이 스키마 파일을 컴파일해서
let go = fs.writeFileSync('message.js', js); //인터페이스 코드로 만들어 준다.