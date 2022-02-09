// function rating(aDriver) {
//   return moreThanFiveLateDeliveries(aDriver) ? 2 : 1;
// }

// function moreThanFiveLateDeliveries(aDriver) {
//   return aDriver > 5
// }
function rating(aDriver) {
  return aDriver > 5 ? 2 : 1;
}

const rate = rating(10);
console.log(rate);