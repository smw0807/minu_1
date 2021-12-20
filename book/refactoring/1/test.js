const a = require('./invoices.json');
const b = require('./plays.json');

const test1 = Math.max(a.performances[0].audience - 30, 0);
console.log(test1); //25