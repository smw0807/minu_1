const { resolve } = require('app-root-path');

function* fruitGenerator() {
  yield 'peach';
  yield 'watermelon';
  return 'summer';
}

const fruitGeneratorObj = fruitGenerator();
console.log(fruitGeneratorObj);
console.log(fruitGeneratorObj.next()); // 1
console.log(fruitGeneratorObj.next()); // 2
console.log(fruitGeneratorObj.next()); // 3
/**
Object [Generator] {}
{ value: 'peach', done: false }
{ value: 'watermelon', done: false }
{ value: 'summer', done: true }
 */

for (const fruit of fruitGenerator()) {
  console.log(fruit);
}
/**
peach
watermelon

summer는 제네레이터에 의해 생성되는 값이 아니라 반복이 종료되어 반환하는(요소가 아닌) 값이기 때문에 출력하지 않음
 */

async function* testGenerator() {
  yield runA();
  yield runB();
  yield runC();
}

function runA() {
  console.log('a');
}

function runB() {
  console.log('b');
}

function runC() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('setTimeout.... C');
      resolve();
    }, 3000);
  });
}

const run = testGenerator();

console.log(run.next());
// console.log(run.next());
// console.log(run.next());
