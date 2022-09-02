function run1(a, b, cb) {
  setImmediate(() => cb(a + b), 100);
}

function run2(a, b, cb) {
  process.nextTick(() => cb(a + b));
}

function run3(a, b, cb) {
  setTimeout(() => cb(a + b), 100);
}

run3(3, 4, rs => {
  console.log(`Run3 : ${rs}`);
});
run1(1, 2, rs => {
  console.log(`Run1 : ${rs}`);
});
run1(3, 4, rs => {
  console.log(`Run1 : ${rs}`);
});
run2(10, 10, rs => {
  console.log(`Run2 : ${rs}`);
});
run1(5, 6, rs => {
  console.log(`Run1 : ${rs}`);
});
run3(3, 4, rs => {
  console.log(`Run3 : ${rs}`);
});
