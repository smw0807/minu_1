const fs = require('fs');
const yaml = require('js-yaml');

let test = fs.readFileSync('./test.yaml', 'utf-8');
let data = yaml.safeLoad(test);
console.log(test);
console.log(data.object);
console.log(data.object.str2);
console.log(data.object.obj);
console.log("-------------------------------------1");
let an = fs.readFileSync('./anchorTest.yaml', 'utf-8');
let anData = yaml.safeLoad(an);
console.log(anData);
console.log("-------------------------------------2");
let an2 = fs.readFileSync('./anchorTest2.yaml', 'utf-8');
let anData2 = yaml.safeLoad(an2);
console.log(anData);