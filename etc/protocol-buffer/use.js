const fs = require('fs');
const protobuf = require('protocol-buffers');

const level = require('level');
const db = level('db');

let messages = protobuf(fs.readFileSync('./simple_message.proto'));

db.put('hello', {name: 'Song Min Woo'}, {valueEncoding: messages.SimpleMessage}, function (err) {
    db.get('hello', {valueEncoding:messages.SimpleMessage}, function (err, msg) {
        console.log(msg);
    });
});

//너무 복잡한데..?