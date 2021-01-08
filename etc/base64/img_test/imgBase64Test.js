const fs = require('fs');

let readFile = fs.readFileSync('./test.jpg'); //이미지 파일 읽기

let encode = Buffer.from(readFile).toString('base64'); //파일 인코딩

let makeEncodeFile = fs.writeFileSync('./encodeFile', encode) //인코딩 파일 만들기

let readFile2 = fs.readFileSync('./encodeFile', 'base64'); //인코딩된 파일 읽기

let decode = Buffer.from(encode, 'base64'); //파일 디코딩

let makeDecodeFile = fs.writeFileSync('./decode.jpg', decode); //디코딩된 파일 만들기