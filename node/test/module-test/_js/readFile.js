const fs = require('fs');

function run() {
  // const read = fs.readFileSync('../_bulk/text');
  const read = fs.readFileSync('_bulk/text', 'utf-8');
  console.log(read);
}
module.exports = run;