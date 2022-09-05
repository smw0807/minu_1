function asyncOperation(cb) {
  process.nextTick(cb);
}
function task1(cb) {
  console.log('task1');
  asyncOperation(() => {
    task2(cb);
  });
}

function task2(cb) {
  console.log('task2');
  asyncOperation(() => {
    task3(cb);
  });
}

function task3(cb) {
  console.log('task3');
  asyncOperation(() => {
    cb();
  });
}

task1(() => {
  console.log('task 1, 2, and 3 executed');
});
