let text = "안녕하세요. hello.";
let base64encode = Buffer.from(text).toString('base64');
console.log(base64encode);

// let base64decode = Buffer.from(base64encode, 'base64').toString('ascii'); //한글 깨짐
let base64decode = Buffer.from(base64encode, 'base64').toString('utf-8');
console.log(base64decode);
