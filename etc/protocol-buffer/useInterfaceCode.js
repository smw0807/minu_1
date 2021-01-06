const fs = require('fs');
const messages = require('./message');

//인터페이스 코드 규격에 맞는 데이터 넣고 인코딩?
let buf = messages.SimpleMessage.encode({
    name: 'song min woo',
    num64: 30,
    type: {
        Ping: 1000
    },
    name_list: ["one!", "two!!", "tree!!!"]
})

console.log(buf);
//프로토콜 버퍼 인코딩 파일 만들기
let make = fs.writeFileSync('protocol-buffer-encoding', buf);

let obj = messages.SimpleMessage.decode(buf);
console.log(obj);

//디코딩 파일 만들기
let mk = fs.writeFileSync('protocol-buffer-decoding', JSON.stringify(obj));