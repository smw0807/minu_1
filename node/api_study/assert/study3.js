const assert = require('assert');

var a = 1;
var b = '1';

function test () {
    var bool = false;
    console.log(a === b);
    if (a === b) {
        bool = true;
    } else {
        bool = false;
    }
    return bool;
}

var rs = assert.ok(test(), ["Result not true...."]);
console.log(rs);
console.log("여기까지 옴?");