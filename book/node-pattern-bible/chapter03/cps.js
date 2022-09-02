//연속 전달 방식
function addCps(a, b, cb) {
  cb(a + b);
}
console.log('before');
addCps(1, 2, rs => {
  console.log(`Result : ${rs}`);
});
console.log('before');
