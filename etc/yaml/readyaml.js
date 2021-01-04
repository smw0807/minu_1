const fs = require('fs');
const yaml = require('js-yaml');

let test = fs.readFileSync('./test.yaml', 'utf-8');
let data = yaml.safeLoad(test);
console.log(data);
console.log("-------------------------------------1");
let an = fs.readFileSync('./anchorTest.yaml', 'utf-8');
let anData = yaml.safeLoad(an);
console.log(anData);
console.log("-------------------------------------2");
let an2 = fs.readFileSync('./anchorTest2.yaml', 'utf-8');
let anData2 = yaml.safeLoad(an2);
console.log(anData2);
console.log("-------------------------------------3");
let an3 = fs.readFileSync('./anchorTest3.yaml', 'utf-8');
let anData3 = yaml.safeLoad(an3);
console.log(anData3);