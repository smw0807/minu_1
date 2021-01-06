const { encode } = require('iconv-lite');
const fs = require('fs');
const protobuf = require('protocol-buffers');

let en = true; //인코딩 실행
let de = true; //디코딩 실행

let messages = protobuf(fs.readFileSync('./simple_message.proto'));
// console.log(messages);

//인코딩
if (en) {
    let buf = messages.SimpleMessage.encode({
        name: 'protocol buffers!!',
        num64: 10,
        float64: 23.1
    });
    console.log(buf);
}
//결과값
//<Buffer 0a 12 70 72 6f 74 6f 63 6f 6c 20 62 75 66 66 65 72 73 21 21 10 0a 19 9a 99 99 99 99 19 37 40>

//디코딩
if (de) {
    let obj = messages.SimpleMessage.decode(buf);
    console.log(obj);
}

/* 결과값
{
  name: 'protocol buffers!!',
  num64: 10,
  float64: 23.1,
  uuid: null,
  type: 0,
  name_list: [],
  num64_list: [],
  map_field: {},
  another_msg: null,
  another_msg2: []
}
*/


