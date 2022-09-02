function additionAsync(a, b, cb) {
  setTimeout(() => cb(a + b), 100);
}
console.log('before');
additionAsync(1, 2, rs => {
  console.log(`Result : ${rs}`);
});
console.log('after');
