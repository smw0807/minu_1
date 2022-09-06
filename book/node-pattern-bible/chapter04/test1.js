function run1(callback) {
  console.log('run1 start');
  setTimeout(() => {
    console.log('run1.....');
    callback();
  }, 3000);
}

// run1(() => {
//   console.log('run1 end');
// });

function run2(cb) {
  console.log('run2 start');
  // cb(run1 => console.log('??')); //X
  // cb(run1()); //X
  console.log('run2 end');
}

// run2() // X
run2(() => {});

function run3() {
  return cb => {
    setTimeout(() => {
      cb();
    }, 1000);
  };
}

run3(() => {
  console.log('??');
});
console.log(Math.random() * 1000);
