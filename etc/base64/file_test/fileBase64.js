const fs = require('fs');

let file = fs.readFileSync('./message.js', 'utf-8'); //message.js 파일 읽기

let encode = Buffer.from(file).toString('base64'); //파일 base64로 인코딩

let mk = fs.writeFileSync('./encodeFile', encode); // 인코딩된 파일 만들기

let file2 = fs.readFileSync('./encodeFile', 'utf-8'); // 인코딩된 파일 읽기

let decode = Buffer.from(file2, 'base64').toString('utf-8'); //파일 디코딩

let mk2 = fs.writeFileSync('./decodeFile.js', decode); //디코딩된 파일 만들기