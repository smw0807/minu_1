const fs = require('fs');
const yaml = require('js-yaml');

let test = fs.readFileSync('./test.yaml', 'utf-8');
let data = yaml.safeLoad(test);
console.log(test);
console.log(data.object);
console.log(data.object.str2);
console.log(data.object.obj);