// function reportLines(aCustomer) {
//   const lines = [];
//   gatherCustomerData(lines, aCustomer);
//   return lines;
// }

// function gatherCustomerData(out, aCustomer) {
//   out.push(["name", aCustomer.name]);
//   out.push(["location", aCustomer.location]);
// }
function reportLines(aCustomer) {
  const lines = [];
  lines.push(["name", aCustomer.name]);
  lines.push(["location", aCustomer.location]);
  return lines;
}
const test = {
  name : '송민우',
  location : '서울특별시'
}
const rl = reportLines(test);
console.log(rl);