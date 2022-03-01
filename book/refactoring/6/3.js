const assert = require('assert');
let tmp = [];
function test(a, b) {
  console.log(a, b);
  assert(b === true || b === false);
  tmp.push(a);
  console.log(tmp);
}
test('a', true);