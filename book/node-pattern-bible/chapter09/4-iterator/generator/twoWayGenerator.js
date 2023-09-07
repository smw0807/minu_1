function* twoWayGenerator() {
  const what = yield null;
  yield 'Hello ' + what;
}

const twoWay = twoWayGenerator();
console.log(twoWay.next()); //{ value: null, done: false
console.log(twoWay.next('world')); //{ value: 'Hello world', done: false }
